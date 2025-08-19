import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Server, AlertCircle, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

import NavigationSidebar from './components/NavigationSidebar';
import ConfigurationPanel from './components/ConfigurationPanel';
import MonitoringPanel from './components/MonitoringPanel';
import { backendArchitectureService } from '../../services/backendArchitectureService';
import Icon from '../../components/AppIcon';


const BackendArchitectureAPIManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadBackendData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const serviceChannel = backendArchitectureService?.subscribeToServiceUpdates((update) => {
      if (update?.type === 'service_update') {
        loadServices();
      } else if (update?.type === 'endpoint_update') {
        loadEndpoints();
      }
    });

    const metricsChannel = backendArchitectureService?.subscribeToMetrics((newMetric) => {
      setMetrics(prev => [newMetric, ...prev]?.slice(0, 100));
    });

    return () => {
      backendArchitectureService?.unsubscribe(serviceChannel);
      backendArchitectureService?.unsubscribe(metricsChannel);
    };
  }, []);

  const loadBackendData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadServices(),
        loadEndpoints(),
        loadMetrics()
      ]);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load backend data');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const data = await backendArchitectureService?.getBackendServices();
      setServices(data);
      if (!selectedService && data?.length > 0) {
        setSelectedService(data?.[0]);
      }
    } catch (err) {
      throw new Error(`Failed to load services: ${err?.message}`);
    }
  };

  const loadEndpoints = async () => {
    try {
      const data = await backendArchitectureService?.getApiEndpoints();
      setEndpoints(data);
    } catch (err) {
      throw new Error(`Failed to load endpoints: ${err?.message}`);
    }
  };

  const loadMetrics = async () => {
    try {
      const data = await backendArchitectureService?.getSystemMetrics(null, '24h');
      setMetrics(data);
    } catch (err) {
      throw new Error(`Failed to load metrics: ${err?.message}`);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadBackendData();
    } catch (err) {
      setError(err?.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleServiceStatusUpdate = async (serviceId, newStatus) => {
    try {
      await backendArchitectureService?.updateServiceStatus(serviceId, newStatus);
      await loadServices();
    } catch (err) {
      setError(`Failed to update service status: ${err?.message}`);
    }
  };

  const performHealthCheck = async (serviceId) => {
    try {
      const result = await backendArchitectureService?.performHealthCheck(serviceId);
      await loadServices();
      return result;
    } catch (err) {
      setError(`Health check failed: ${err?.message}`);
    }
  };

  const getStatusIcon = (status) => {
    const statusConfig = {
      healthy: { icon: CheckCircle, color: 'text-green-500' },
      degraded: { icon: AlertCircle, color: 'text-yellow-500' },
      down: { icon: XCircle, color: 'text-red-500' },
      maintenance: { icon: Clock, color: 'text-blue-500' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.healthy;
    const Icon = config?.icon;
    return <Icon className={`h-5 w-5 ${config?.color}`} />;
  };

  const getEnvironmentBadge = (environment) => {
    const envConfig = {
      production: 'bg-green-100 text-green-800',
      staging: 'bg-yellow-100 text-yellow-800',
      development: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${envConfig?.[environment] || envConfig?.development}`}>
        {environment}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading Backend Architecture...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Backend Architecture & API Management - FITS AI</title>
        <meta name="description" content="Comprehensive backend administration interface for FITS AI system architecture" />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Server className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Backend Architecture</h1>
              </div>
              <span className="text-sm text-gray-500">System Administration & API Management</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    {services?.filter(s => s?.status === 'healthy')?.length || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600">
                    {services?.filter(s => s?.status === 'degraded')?.length || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    {services?.filter(s => s?.status === 'down')?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Navigation Sidebar - 25% */}
        <div className="w-1/4 bg-white shadow-sm min-h-screen">
          <NavigationSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            services={services}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
          />
        </div>

        {/* Main Configuration Area - 60% */}
        <div className="flex-1 px-6 py-6">
          <ConfigurationPanel
            activeTab={activeTab}
            services={services}
            endpoints={endpoints}
            selectedService={selectedService}
            onServiceStatusUpdate={handleServiceStatusUpdate}
            onHealthCheck={performHealthCheck}
            getStatusIcon={getStatusIcon}
            getEnvironmentBadge={getEnvironmentBadge}
          />
        </div>

        {/* Monitoring Panel - 15% */}
        <div className="w-1/4 bg-white shadow-sm min-h-screen border-l border-gray-200">
          <MonitoringPanel
            metrics={metrics}
            services={services}
            selectedService={selectedService}
          />
        </div>
      </div>
    </div>
  );
};

export default BackendArchitectureAPIManagement;