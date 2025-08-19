import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeMonitoring = ({ onConfigureAlert }) => {
  const [activeUsers, setActiveUsers] = useState(47);
  const [systemChanges, setSystemChanges] = useState(12);
  const [securityEvents, setSecurityEvents] = useState(3);
  const [recentActivity, setRecentActivity] = useState([]);

  const alertThresholds = [
    {
      id: 1,
      name: 'Failed Login Attempts',
      threshold: 5,
      timeWindow: '5 minutes',
      status: 'active',
      triggered: false
    },
    {
      id: 2,
      name: 'Administrative Changes',
      threshold: 10,
      timeWindow: '1 hour',
      status: 'active',
      triggered: false
    },
    {
      id: 3,
      name: 'Unusual Access Patterns',
      threshold: 3,
      timeWindow: '15 minutes',
      status: 'active',
      triggered: true
    },
    {
      id: 4,
      name: 'Security Policy Violations',
      threshold: 1,
      timeWindow: 'immediate',
      status: 'active',
      triggered: false
    }
  ];

  const systemIntegrations = [
    {
      id: 1,
      name: 'SIEM Integration',
      type: 'Splunk Enterprise',
      status: 'connected',
      lastSync: '2025-08-13 15:02:15',
      events: 1247
    },
    {
      id: 2,
      name: 'ITSM Integration',
      type: 'ServiceNow',
      status: 'connected',
      lastSync: '2025-08-13 15:01:45',
      events: 89
    },
    {
      id: 3,
      name: 'Identity Provider',
      type: 'Active Directory',
      status: 'warning',
      lastSync: '2025-08-13 14:58:30',
      events: 234
    },
    {
      id: 4,
      name: 'Vulnerability Scanner',
      type: 'Nessus',
      status: 'connected',
      lastSync: '2025-08-13 15:00:12',
      events: 56
    }
  ];

  useEffect(() => {
    // Simulate real-time activity updates
    const interval = setInterval(() => {
      const activities = [
        {
          id: Date.now(),
          timestamp: new Date()?.toISOString(),
          user: 'john.doe@company.com',
          action: 'User Login',
          resource: 'IT Dashboard',
          outcome: 'success',
          risk: 'low'
        },
        {
          id: Date.now() + 1,
          timestamp: new Date(Date.now() - 30000)?.toISOString(),
          user: 'admin@company.com',
          action: 'Configuration Change',
          resource: 'LLM Settings',
          outcome: 'success',
          risk: 'medium'
        },
        {
          id: Date.now() + 2,
          timestamp: new Date(Date.now() - 60000)?.toISOString(),
          user: 'security@company.com',
          action: 'Security Event',
          resource: 'Firewall Rules',
          outcome: 'warning',
          risk: 'high'
        }
      ];

      setRecentActivity(prev => [...activities, ...prev?.slice(0, 7)]);
      
      // Simulate metric updates
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
      setSystemChanges(prev => Math.max(0, prev + Math.floor(Math.random() * 2) - 1));
      setSecurityEvents(prev => Math.max(0, prev + Math.floor(Math.random() * 2) - 1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-card-foreground">{activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live monitoring</span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Changes</p>
              <p className="text-2xl font-bold text-card-foreground">{systemChanges}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={24} className="text-warning" />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-xs text-muted-foreground">Last hour</span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Security Events</p>
              <p className="text-2xl font-bold text-card-foreground">{securityEvents}</p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-error" />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Icon name="AlertTriangle" size={12} className="text-error" />
            <span className="text-xs text-error">Requires attention</span>
          </div>
        </div>
      </div>
      {/* Alert Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Alert Thresholds</h3>
          </div>
          <Button variant="outline" size="sm" onClick={onConfigureAlert}>
            <Icon name="Plus" size={16} className="mr-2" />
            Add Alert
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertThresholds?.map((alert) => (
            <div 
              key={alert?.id} 
              className={`p-4 rounded-lg border ${
                alert?.triggered ? 'border-error bg-error/5' : 'border-border bg-muted/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-card-foreground">{alert?.name}</h4>
                <div className="flex items-center space-x-2">
                  {alert?.triggered && (
                    <Icon name="AlertTriangle" size={16} className="text-error" />
                  )}
                  <Button variant="ghost" size="sm">
                    <Icon name="Settings" size={14} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>Threshold: {alert?.threshold} events</div>
                <div>Time Window: {alert?.timeWindow}</div>
                <div className="flex items-center space-x-2">
                  <span>Status:</span>
                  <span className={`capitalize ${
                    alert?.status === 'active' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {alert?.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* System Integrations */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">System Integrations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemIntegrations?.map((integration) => (
            <div key={integration?.id} className="p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Database" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-card-foreground">{integration?.name}</h4>
                    <p className="text-xs text-muted-foreground">{integration?.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getStatusIcon(integration?.status)} 
                    size={16} 
                    className={getStatusColor(integration?.status)} 
                  />
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Last Sync: {integration?.lastSync}</div>
                <div>Events: {integration?.events?.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity Stream */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Live Activity Stream</h3>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
          {recentActivity?.map((activity) => (
            <div key={activity?.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="text-xs text-muted-foreground font-mono min-w-[60px]">
                {formatTimestamp(activity?.timestamp)}
              </div>
              
              <div className="flex items-center space-x-2 min-w-[120px]">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={12} className="text-primary" />
                </div>
                <span className="text-xs text-card-foreground truncate">
                  {activity?.user?.split('@')?.[0]}
                </span>
              </div>
              
              <div className="flex-1 text-xs text-card-foreground">
                <span className="font-medium">{activity?.action}</span>
                <span className="text-muted-foreground"> on {activity?.resource}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs capitalize ${getRiskColor(activity?.risk)}`}>
                  {activity?.risk}
                </span>
                <Icon 
                  name={activity?.outcome === 'success' ? 'CheckCircle' : 
                        activity?.outcome === 'warning' ? 'AlertTriangle' : 'XCircle'} 
                  size={12} 
                  className={activity?.outcome === 'success' ? 'text-success' : 
                           activity?.outcome === 'warning' ? 'text-warning' : 'text-error'} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;