import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemHealthOverview = ({ systemHealth, services = [], onRefresh }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success border-success/20 bg-success/10';
      case 'warning':
        return 'text-warning border-warning/20 bg-warning/10';
      case 'error':
        return 'text-destructive border-destructive/20 bg-destructive/10';
      default:
        return 'text-muted-foreground border-border bg-muted/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const overallStatus = systemHealth?.overall_status || 'unknown';
  const healthyCount = systemHealth?.healthy_services || 0;
  const warningCount = systemHealth?.warnings || 0;
  const errorCount = systemHealth?.errors || 0;
  const totalCount = systemHealth?.services_count || 0;

  // Calculate uptime percentage
  const uptimePercentage = totalCount > 0 ? ((healthyCount / totalCount) * 100)?.toFixed(1) : 0;

  // Get service type distribution
  const serviceTypes = services?.reduce((acc, service) => {
    const type = service?.service_type || 'unknown';
    acc[type] = (acc?.[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Overall System Status */}
      <div className={`rounded-lg border-2 p-6 ${getStatusColor(overallStatus)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">System Status</p>
            <p className="text-2xl font-bold capitalize">{overallStatus}</p>
          </div>
          <Icon 
            name={getStatusIcon(overallStatus)} 
            size={32} 
            className="opacity-80"
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm opacity-75">
          <span>Uptime: {uptimePercentage}%</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="p-1 h-auto opacity-75 hover:opacity-100"
          >
            <Icon name="RefreshCw" size={14} />
          </Button>
        </div>
      </div>

      {/* Healthy Services */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Healthy Services</p>
            <p className="text-2xl font-bold text-success">{healthyCount}</p>
          </div>
          <div className="rounded-full bg-success/10 p-3">
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (healthyCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="ml-2 min-w-fit">{totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Services with Issues */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Issues Detected</p>
            <p className="text-2xl font-bold text-warning">{warningCount + errorCount}</p>
          </div>
          <div className="rounded-full bg-warning/10 p-3">
            <Icon name="AlertTriangle" size={24} className="text-warning" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span className="text-muted-foreground">{warningCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span className="text-muted-foreground">{errorCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Integrations */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Integrations</p>
            <p className="text-2xl font-bold text-foreground">{totalCount}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Icon name="Layers" size={24} className="text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Service Types:</span>
            <span>{Object?.keys(serviceTypes)?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthOverview;