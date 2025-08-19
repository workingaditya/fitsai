import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceStatusGrid = ({ services = [], apiEndpoints = [], onTestService, onServiceClick }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'border-success/20 bg-success/5';
      case 'degraded':
        return 'border-warning/20 bg-warning/5';
      case 'down':
        return 'border-destructive/20 bg-destructive/5';
      case 'maintenance':
        return 'border-blue-500/20 bg-blue-500/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'degraded':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'down':
        return { icon: 'XCircle', color: 'text-destructive' };
      case 'maintenance':
        return { icon: 'Settings', color: 'text-blue-500' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getServiceTypeIcon = (serviceType) => {
    switch (serviceType?.toLowerCase()) {
      case 'api':
        return 'Globe';
      case 'database': case'db':
        return 'Database';
      case 'websocket': case'ws':
        return 'Wifi';
      case 'auth': case'sso':
        return 'Shield';
      case 'llm': case'ai':
        return 'Brain';
      case 'vector': case'pinecone':
        return 'Search';
      case 'storage':
        return 'HardDrive';
      case 'search':
        return 'Search';
      default:
        return 'Server';
    }
  };

  const formatResponseTime = (ms) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000)?.toFixed(2)}s`;
  };

  const formatLastHealthCheck = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const sortServices = (services) => {
    return [...services]?.sort((a, b) => {
      let aVal = a?.[sortBy];
      let bVal = b?.[sortBy];
      
      if (sortBy === 'status') {
        const statusOrder = { 'down': 0, 'degraded': 1, 'maintenance': 2, 'healthy': 3 };
        aVal = statusOrder?.[aVal] ?? 999;
        bVal = statusOrder?.[bVal] ?? 999;
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal?.toLowerCase();
        bVal = bVal?.toLowerCase();
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedServices = sortServices(services);

  const ServiceCard = ({ service }) => {
    const statusInfo = getStatusIcon(service?.status);
    const serviceEndpoints = apiEndpoints?.filter(ep => ep?.service_id === service?.id) || [];
    const avgResponseTime = serviceEndpoints?.length > 0 
      ? serviceEndpoints?.reduce((acc, ep) => acc + (ep?.response_time_ms || 0), 0) / serviceEndpoints?.length
      : 0;
    const avgSuccessRate = serviceEndpoints?.length > 0
      ? serviceEndpoints?.reduce((acc, ep) => acc + (ep?.success_rate || 0), 0) / serviceEndpoints?.length
      : 100;

    return (
      <div 
        className={`rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg cursor-pointer ${getStatusColor(service?.status)}`}
        onClick={() => onServiceClick?.(service)}
      >
        {/* Service Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon name={getServiceTypeIcon(service?.service_type)} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{service?.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{service?.service_type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name={statusInfo?.icon} size={20} className={statusInfo?.color} />
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo?.color} bg-current/10`}>
              {service?.status}
            </span>
          </div>
        </div>
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Response Time</p>
            <p className="text-sm font-medium">{formatResponseTime(avgResponseTime)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="text-sm font-medium">{avgSuccessRate?.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Environment</p>
            <p className="text-sm font-medium capitalize">{service?.environment}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Version</p>
            <p className="text-sm font-medium">{service?.version || 'N/A'}</p>
          </div>
        </div>
        {/* Endpoints Summary */}
        {serviceEndpoints?.length > 0 && (
          <div className="mb-4 p-3 bg-muted/50 rounded-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Endpoints: {serviceEndpoints?.length}</span>
              <span className="text-muted-foreground">
                Active: {serviceEndpoints?.filter(ep => ep?.is_enabled)?.length}
              </span>
            </div>
          </div>
        )}
        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Last check: {formatLastHealthCheck(service?.last_health_check)}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e?.stopPropagation();
              onTestService?.(service);
            }}
            className="text-xs"
          >
            <Icon name="Zap" size={14} />
            Test
          </Button>
        </div>
      </div>
    );
  };

  if (services?.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-12">
        <div className="text-center">
          <Icon name="Server" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Services Found</h3>
          <p className="text-muted-foreground mb-4">
            No services match your current filters. Try adjusting your search criteria.
          </p>
          <Button variant="outline">
            <Icon name="RefreshCw" size={16} />
            Refresh Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {services?.length} service{services?.length !== 1 ? 's' : ''}
            </span>
            
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              {['name', 'status', 'service_type', 'environment']?.map((field) => (
                <Button
                  key={field}
                  variant={sortBy === field ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleSort(field)}
                  className="text-xs"
                >
                  {field?.replace('_', ' ')}
                  {sortBy === field && (
                    <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} className="ml-1" />
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Services Grid */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" :"space-y-4"
      }>
        {sortedServices?.map((service) => (
          <ServiceCard key={service?.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServiceStatusGrid;