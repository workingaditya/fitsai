import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const ServiceCategoriesPanel = ({ 
  services = [], 
  providerConfigs = {},
  selectedCategory,
  onCategoryChange,
  statusFilter,
  onStatusFilterChange,
  environmentFilter,
  onEnvironmentFilterChange,
  searchQuery,
  onSearchChange
}) => {
  // Count services by category
  const categoryCounts = services?.reduce((acc, service) => {
    const type = service?.service_type?.toLowerCase();
    acc.all = (acc?.all || 0) + 1;
    
    // Map service types to categories
    if (['auth', 'sso', 'ldap']?.includes(type)) {
      acc.authentication = (acc?.authentication || 0) + 1;
    } else if (['vector', 'pinecone', 'pgvector']?.includes(type)) {
      acc.vector_storage = (acc?.vector_storage || 0) + 1;
    } else if (['search', 'tavily']?.includes(type)) {
      acc.search = (acc?.search || 0) + 1;
    } else if (['llm', 'ai']?.includes(type)) {
      acc.ai_models = (acc?.ai_models || 0) + 1;
    } else {
      acc[type] = (acc?.[type] || 0) + 1;
    }
    
    return acc;
  }, { all: 0 });

  const statusCounts = services?.reduce((acc, service) => {
    acc[service?.status] = (acc?.[service?.status] || 0) + 1;
    return acc;
  }, {});

  const environmentCounts = services?.reduce((acc, service) => {
    acc[service?.environment] = (acc?.[service?.environment] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    { 
      id: 'all', 
      label: 'All Services', 
      icon: 'Server', 
      count: categoryCounts?.all || 0,
      description: 'All system integrations'
    },
    { 
      id: 'authentication', 
      label: 'Authentication', 
      icon: 'Shield', 
      count: categoryCounts?.authentication || 0,
      description: 'SSO, LDAP, MFA providers'
    },
    { 
      id: 'ai_models', 
      label: 'AI Models', 
      icon: 'Brain', 
      count: categoryCounts?.ai_models || 0,
      description: 'LLM providers and AI services'
    },
    { 
      id: 'vector_storage', 
      label: 'Vector Storage', 
      icon: 'Database', 
      count: categoryCounts?.vector_storage || 0,
      description: 'Embedding and vector databases'
    },
    { 
      id: 'search', 
      label: 'Search', 
      icon: 'Search', 
      count: categoryCounts?.search || 0,
      description: 'Web search and content discovery'
    },
    { 
      id: 'api', 
      label: 'API Services', 
      icon: 'Globe', 
      count: categoryCounts?.api || 0,
      description: 'REST and GraphQL APIs'
    },
    { 
      id: 'websocket', 
      label: 'Real-time', 
      icon: 'Wifi', 
      count: categoryCounts?.websocket || 0,
      description: 'WebSocket and collaboration'
    },
    { 
      id: 'database', 
      label: 'Databases', 
      icon: 'HardDrive', 
      count: categoryCounts?.database || 0,
      description: 'Primary data storage'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses', count: services?.length || 0 },
    { value: 'healthy', label: 'Healthy', count: statusCounts?.healthy || 0 },
    { value: 'degraded', label: 'Degraded', count: statusCounts?.degraded || 0 },
    { value: 'down', label: 'Down', count: statusCounts?.down || 0 },
    { value: 'maintenance', label: 'Maintenance', count: statusCounts?.maintenance || 0 }
  ];

  const environmentOptions = [
    { value: 'all', label: 'All Environments' },
    { value: 'production', label: 'Production', count: environmentCounts?.production || 0 },
    { value: 'staging', label: 'Staging', count: environmentCounts?.staging || 0 },
    { value: 'development', label: 'Development', count: environmentCounts?.development || 0 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'degraded': return 'text-warning';
      case 'down': return 'text-destructive';
      case 'maintenance': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Search & Filter</h3>
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full"
          icon={<Icon name="Search" size={16} />}
        />
      </div>
      {/* Service Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Service Types</h3>
        <div className="space-y-1">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all hover:bg-muted/50 ${
                selectedCategory === category?.id ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={category?.icon} 
                  size={18} 
                  className={selectedCategory === category?.id ? 'text-primary' : 'text-muted-foreground'} 
                />
                <div>
                  <p className={`text-sm font-medium ${
                    selectedCategory === category?.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {category?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{category?.description}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category?.id 
                  ? 'bg-primary/20 text-primary' :'bg-muted text-muted-foreground'
              }`}>
                {category?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Status Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Status</h3>
        <div className="space-y-1">
          {statusOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => onStatusFilterChange(option?.value)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all hover:bg-muted/50 ${
                statusFilter === option?.value ? 'bg-primary/10' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  option?.value === 'all' ? 'bg-muted-foreground' : 
                  option?.value === 'healthy' ? 'bg-success' :
                  option?.value === 'degraded' ? 'bg-warning' :
                  option?.value === 'down'? 'bg-destructive' : 'bg-blue-500'
                }`} />
                <span className={`text-sm ${
                  statusFilter === option?.value ? 'text-primary font-medium' : 'text-foreground'
                }`}>
                  {option?.label}
                </span>
              </div>
              {option?.count !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {option?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Environment Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Environment</h3>
        <div className="space-y-1">
          {environmentOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => onEnvironmentFilterChange(option?.value)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all hover:bg-muted/50 ${
                environmentFilter === option?.value ? 'bg-primary/10' : ''
              }`}
            >
              <span className={`text-sm ${
                environmentFilter === option?.value ? 'text-primary font-medium' : 'text-foreground'
              }`}>
                {option?.label}
              </span>
              {option?.count !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {option?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Provider Config Summary */}
      {Object.keys(providerConfigs)?.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Providers</h3>
          <div className="space-y-2">
            {Object.entries(providerConfigs)?.map(([type, providers]) => (
              <div key={type} className="p-3 border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{type?.replace('_', ' ')}</span>
                  <span className="text-xs text-muted-foreground">{providers?.length}</span>
                </div>
                <div className="mt-2 space-y-1">
                  {providers?.slice(0, 3)?.map((provider) => (
                    <div key={provider?.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{provider?.provider_name}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        provider?.is_enabled ? 'bg-success' : 'bg-muted-foreground'
                      }`} />
                    </div>
                  ))}
                  {providers?.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{providers?.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="RefreshCw" size={16} />
            Refresh All Services
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="Zap" size={16} />
            Run Health Checks
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="Download" size={16} />
            Export Status Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoriesPanel;