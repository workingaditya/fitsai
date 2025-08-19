import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import ModelStatusCard from './components/ModelStatusCard';
import ModelFilterSidebar from './components/ModelFilterSidebar';
import PerformanceMonitoringPanel from './components/PerformanceMonitoringPanel';
import ModelConfigurationModal from './components/ModelConfigurationModal';
import ModelDeploymentWizard from './components/ModelDeploymentWizard';

const LLMModelConfigurationPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [deploymentWizardOpen, setDeploymentWizardOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for LLM models
  const models = [
    {
      id: 'mistral-7b-1',
      name: 'Mistral 7B',
      version: 'v0.1.0',
      category: 'language',
      status: 'active',
      responseTime: 125,
      accuracy: 94.2,
      activeUsers: 23,
      memoryUsage: 7.2,
      cpuUtilization: 68,
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      repetitionPenalty: 1.1,
      memoryLimit: 8,
      maxConcurrentUsers: 50,
      enableLogging: true,
      enableCaching: true,
      autoScale: false,
      priority: 'high'
    },
    {
      id: 'llama2-7b-1',
      name: 'Llama 2 7B',
      version: 'v2.0.1',
      category: 'chat',
      status: 'active',
      responseTime: 142,
      accuracy: 92.8,
      activeUsers: 18,
      memoryUsage: 6.8,
      cpuUtilization: 72,
      maxTokens: 4096,
      temperature: 0.8,
      topP: 0.95,
      topK: 50,
      repetitionPenalty: 1.0,
      memoryLimit: 8,
      maxConcurrentUsers: 40,
      enableLogging: true,
      enableCaching: false,
      autoScale: true,
      priority: 'medium'
    },
    {
      id: 'codellama-7b-1',
      name: 'Code Llama 7B',
      version: 'v1.0.2',
      category: 'code',
      status: 'active',
      responseTime: 168,
      accuracy: 96.5,
      activeUsers: 12,
      memoryUsage: 8.1,
      cpuUtilization: 65,
      maxTokens: 8192,
      temperature: 0.1,
      topP: 0.9,
      topK: 30,
      repetitionPenalty: 1.2,
      memoryLimit: 12,
      maxConcurrentUsers: 30,
      enableLogging: true,
      enableCaching: true,
      autoScale: false,
      priority: 'high'
    },
    {
      id: 'vicuna-7b-1',
      name: 'Vicuna 7B',
      version: 'v1.3.0',
      category: 'instruct',
      status: 'maintenance',
      responseTime: 135,
      accuracy: 93.7,
      activeUsers: 0,
      memoryUsage: 0,
      cpuUtilization: 0,
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      repetitionPenalty: 1.1,
      memoryLimit: 8,
      maxConcurrentUsers: 45,
      enableLogging: true,
      enableCaching: true,
      autoScale: true,
      priority: 'medium'
    },
    {
      id: 'alpaca-7b-1',
      name: 'Alpaca 7B',
      version: 'v1.0.0',
      category: 'instruct',
      status: 'inactive',
      responseTime: 0,
      accuracy: 91.3,
      activeUsers: 0,
      memoryUsage: 0,
      cpuUtilization: 0,
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      repetitionPenalty: 1.1,
      memoryLimit: 8,
      maxConcurrentUsers: 35,
      enableLogging: false,
      enableCaching: false,
      autoScale: false,
      priority: 'low'
    },
    {
      id: 'falcon-7b-1',
      name: 'Falcon 7B',
      version: 'v1.0.0',
      category: 'language',
      status: 'error',
      responseTime: 0,
      accuracy: 89.2,
      activeUsers: 0,
      memoryUsage: 0,
      cpuUtilization: 0,
      maxTokens: 2048,
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      repetitionPenalty: 1.1,
      memoryLimit: 8,
      maxConcurrentUsers: 40,
      enableLogging: true,
      enableCaching: true,
      autoScale: false,
      priority: 'low'
    }
  ];

  // Mock alerts data
  const alerts = [
    {
      id: 1,
      title: 'High CPU Usage',
      message: 'Llama 2 7B model experiencing elevated CPU usage',
      model: 'Llama 2 7B',
      severity: 'warning',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      title: 'Model Deployment Failed',
      message: 'Falcon 7B deployment encountered configuration error',
      model: 'Falcon 7B',
      severity: 'critical',
      timestamp: '15 min ago'
    },
    {
      id: 3,
      title: 'Maintenance Scheduled',
      message: 'Vicuna 7B scheduled for routine maintenance',
      model: 'Vicuna 7B',
      severity: 'info',
      timestamp: '1 hour ago'
    }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' },
    { value: 'responseTime', label: 'Response Time' },
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'activeUsers', label: 'Active Users' },
    { value: 'cpuUtilization', label: 'CPU Usage' }
  ];

  // Calculate model counts for filters
  const modelCounts = {
    language: models?.filter(m => m?.category === 'language')?.length,
    code: models?.filter(m => m?.category === 'code')?.length,
    chat: models?.filter(m => m?.category === 'chat')?.length,
    instruct: models?.filter(m => m?.category === 'instruct')?.length,
    embedding: models?.filter(m => m?.category === 'embedding')?.length,
    active: models?.filter(m => m?.status === 'active')?.length,
    inactive: models?.filter(m => m?.status === 'inactive')?.length,
    maintenance: models?.filter(m => m?.status === 'maintenance')?.length,
    error: models?.filter(m => m?.status === 'error')?.length
  };

  // Filter and sort models
  const filteredModels = models?.filter(model => {
      const matchesSearch = model?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           model?.version?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesCategory = selectedCategories?.length === 0 || selectedCategories?.includes(model?.category);
      const matchesStatus = selectedStatuses?.length === 0 || selectedStatuses?.includes(model?.status);
      return matchesSearch && matchesCategory && matchesStatus;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        case 'responseTime':
          return a?.responseTime - b?.responseTime;
        case 'accuracy':
          return b?.accuracy - a?.accuracy;
        case 'activeUsers':
          return b?.activeUsers - a?.activeUsers;
        case 'cpuUtilization':
          return b?.cpuUtilization - a?.cpuUtilization;
        default:
          return 0;
      }
    });

  const handleModelConfigure = (modelId) => {
    const model = models?.find(m => m?.id === modelId);
    setSelectedModel(model);
    setConfigModalOpen(true);
  };

  const handleModelToggle = (modelId) => {
    console.log('Toggle model:', modelId);
    // In a real app, this would make an API call to start/stop the model
  };

  const handleModelDetails = (modelId) => {
    console.log('View model details:', modelId);
    // In a real app, this would navigate to a detailed view
  };

  const handleConfigSave = (modelId, config) => {
    console.log('Save configuration for model:', modelId, config);
    // In a real app, this would make an API call to update the model configuration
  };

  const handleModelDeploy = (config) => {
    console.log('Deploy new model:', config);
    // In a real app, this would make an API call to deploy the new model
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSearchQuery('');
  };

  const handleViewAlert = (alertId) => {
    console.log('View alert:', alertId);
    // In a real app, this would show alert details
  };

  useEffect(() => {
    // Auto-refresh performance data every 30 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>LLM Model Configuration & Performance Monitoring - FITS AI</title>
        <meta name="description" content="Configure and monitor LLM model performance, resource utilization, and deployment settings" />
      </Helmet>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="admin"
      />
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="admin"
      />
      <main className={`transition-all duration-normal ${
        sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'
      } mt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center">
                <Icon name="Cpu" size={28} className="mr-3 text-primary" />
                LLM Model Configuration & Performance Monitoring
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and monitor local language model deployments and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                loading={refreshing}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
              <Button
                variant="default"
                onClick={() => setDeploymentWizardOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Deploy Model
              </Button>
            </div>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search models by name or version..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
              />
            </div>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by..."
              className="w-48"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Filter Sidebar */}
            <div className="col-span-3">
              <ModelFilterSidebar
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                selectedStatuses={selectedStatuses}
                onStatusChange={setSelectedStatuses}
                onClearFilters={handleClearFilters}
                modelCounts={modelCounts}
              />
            </div>

            {/* Model Cards Grid */}
            <div className="col-span-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Active Models ({filteredModels?.length})
                  </h2>
                  {(selectedCategories?.length > 0 || selectedStatuses?.length > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      iconName="X"
                      iconPosition="left"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4">
                  {filteredModels?.map((model) => (
                    <ModelStatusCard
                      key={model?.id}
                      model={model}
                      onConfigure={handleModelConfigure}
                      onToggle={handleModelToggle}
                      onViewDetails={handleModelDetails}
                    />
                  ))}
                </div>

                {filteredModels?.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No models found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or deploy a new model.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Monitoring Panel */}
            <div className="col-span-3">
              <PerformanceMonitoringPanel
                performanceData={{}}
                alerts={alerts}
                onRefresh={handleRefresh}
                onViewAlert={handleViewAlert}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      <ModelConfigurationModal
        model={selectedModel}
        isOpen={configModalOpen}
        onClose={() => {
          setConfigModalOpen(false);
          setSelectedModel(null);
        }}
        onSave={handleConfigSave}
      />
      <ModelDeploymentWizard
        isOpen={deploymentWizardOpen}
        onClose={() => setDeploymentWizardOpen(false)}
        onDeploy={handleModelDeploy}
      />
    </div>
  );
};

export default LLMModelConfigurationPage;