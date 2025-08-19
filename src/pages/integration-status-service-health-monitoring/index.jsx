import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ServiceStatusGrid from './components/ServiceStatusGrid';
import ServiceCategoriesPanel from './components/ServiceCategoriesPanel';
import IncidentPanel from './components/IncidentPanel';
import SystemHealthOverview from './components/SystemHealthOverview';
import IntegrationTestModal from './components/IntegrationTestModal';
import { integrationStatusService } from '../../services/integrationStatusService';

const IntegrationStatusServiceHealthMonitoring = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  
  // Data states
  const [services, setServices] = useState([]);
  const [providerConfigs, setProviderConfigs] = useState({});
  const [systemHealth, setSystemHealth] = useState(null);
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [environmentFilter, setEnvironmentFilter] = useState('all');

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [servicesData, providersData, healthData, endpointsData] = await Promise.all([
        integrationStatusService?.getServicesOverview(),
        integrationStatusService?.getProviderConfigurations(),
        integrationStatusService?.getSystemHealth(),
        integrationStatusService?.getAPIEndpointsStatus()
      ]);

      setServices(servicesData);
      setProviderConfigs(providersData);
      setSystemHealth(healthData);
      setApiEndpoints(endpointsData);

      // Generate mock incidents based on service status
      const mockIncidents = servicesData
        ?.filter(service => service?.status !== 'healthy')
        ?.slice(0, 5)
        ?.map((service, index) => ({
          id: `incident-${service?.id}`,
          title: `Service ${service?.status === 'down' ? 'Outage' : 'Degradation'}: ${service?.name}`,
          description: `${service?.name} is experiencing ${service?.status} status`,
          severity: service?.status === 'down' ? 'high' : 'medium',
          status: 'active',
          affected_services: [service?.name],
          created_at: new Date(Date.now() - Math.random() * 3600000)?.toISOString(),
          updated_at: new Date()?.toISOString()
        })) || [];

      setIncidents(mockIncidents);
      setError(null);
    } catch (err) {
      setError(`Failed to load system status: ${err?.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Set up real-time subscription for metrics updates
    const unsubscribe = integrationStatusService?.subscribeToSystemMetrics((payload) => {
      // Refresh data when metrics are updated
      loadData(true);
    });

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);

    return () => {
      unsubscribe?.();
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    loadData(true);
  };

  const handleTestService = async (service) => {
    setSelectedService(service);
    setShowTestModal(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleEnvironmentFilterChange = (environment) => {
    setEnvironmentFilter(environment);
  };

  // Filter services based on selected criteria
  const filteredServices = services?.filter(service => {
    const matchesCategory = selectedCategory === 'all' || 
      service?.service_type?.toLowerCase() === selectedCategory?.toLowerCase() ||
      (selectedCategory === 'authentication' && ['auth', 'sso', 'ldap']?.includes(service?.service_type?.toLowerCase())) ||
      (selectedCategory === 'ai_models' && ['llm', 'ai']?.includes(service?.service_type?.toLowerCase())) ||
      (selectedCategory === 'vector_storage' && ['vector', 'pinecone', 'pgvector']?.includes(service?.service_type?.toLowerCase())) ||
      (selectedCategory === 'search' && ['search', 'tavily']?.includes(service?.service_type?.toLowerCase()));

    const matchesSearch = !searchQuery || 
      service?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      service?.service_type?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesStatus = statusFilter === 'all' || service?.status === statusFilter;
    const matchesEnvironment = environmentFilter === 'all' || service?.environment === environmentFilter;

    return matchesCategory && matchesSearch && matchesStatus && matchesEnvironment;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={setSidebarCollapsed} />
        <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'}`}>
          <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className="flex-1 p-6 pt-20">
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <Icon name="Loader" className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading system status...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={setSidebarCollapsed} />
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'}`}>
        <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 p-6 pt-20 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Integration Status & Service Health</h1>
              <p className="text-muted-foreground">
                Monitor all external integrations and system dependencies
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date()?.toLocaleTimeString()}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <Icon name={refreshing ? "Loader" : "RefreshCw"} size={16} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              
              <Button
                size="sm"
                onClick={() => setShowTestModal(true)}
              >
                <Icon name="Zap" size={16} />
                Test Integration
              </Button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
                <div>
                  <h3 className="font-medium text-destructive">System Status Error</h3>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <Icon name="RefreshCw" size={16} />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* System Health Overview */}
          <SystemHealthOverview 
            systemHealth={systemHealth} 
            services={services}
            onRefresh={handleRefresh}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Service Categories Panel - Left Sidebar */}
            <div className="lg:col-span-2">
              <ServiceCategoriesPanel
                services={services}
                providerConfigs={providerConfigs}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                environmentFilter={environmentFilter}
                onEnvironmentFilterChange={handleEnvironmentFilterChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Service Status Grid - Main Content */}
            <div className="lg:col-span-7">
              <ServiceStatusGrid
                services={filteredServices}
                apiEndpoints={apiEndpoints}
                onTestService={handleTestService}
                onServiceClick={setSelectedService}
              />
            </div>

            {/* Incident Panel - Right Sidebar */}
            <div className="lg:col-span-3">
              <IncidentPanel
                incidents={incidents}
                systemHealth={systemHealth}
                services={services}
              />
            </div>
          </div>
        </main>
      </div>
      {/* Integration Test Modal */}
      {showTestModal && (
        <IntegrationTestModal
          service={selectedService}
          onClose={() => {
            setShowTestModal(false);
            setSelectedService(null);
          }}
          onTestComplete={() => {
            loadData(true);
            setShowTestModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

export default IntegrationStatusServiceHealthMonitoring;