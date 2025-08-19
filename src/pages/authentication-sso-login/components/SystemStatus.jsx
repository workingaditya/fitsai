import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = () => {
  const systemServices = [
    {
      name: 'Active Directory',
      status: 'operational',
      lastCheck: '2 min ago'
    },
    {
      name: 'LDAP Services',
      status: 'operational',
      lastCheck: '1 min ago'
    },
    {
      name: 'Authentication API',
      status: 'warning',
      lastCheck: '5 min ago'
    },
    {
      name: 'MFA Services',
      status: 'operational',
      lastCheck: '3 min ago'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'warning': return 'Degraded';
      case 'error': return 'Outage';
      default: return 'Unknown';
    }
  };

  return (
    <div className="mt-8 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground">System Status</h4>
        <button className="text-xs text-primary hover:text-primary/80 font-medium">
          View Details
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {systemServices?.map((service) => (
          <div key={service?.name} className="flex items-center justify-between p-2 bg-background rounded border border-border">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(service?.status)} 
                size={12} 
                className={getStatusColor(service?.status)}
              />
              <span className="text-xs text-foreground font-medium">{service?.name}</span>
            </div>
            <div className="text-right">
              <p className={`text-xs font-medium ${getStatusColor(service?.status)}`}>
                {getStatusText(service?.status)}
              </p>
              <p className="text-xs text-muted-foreground">{service?.lastCheck}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Last updated: Aug 13, 2025 2:57 PM</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-success font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;