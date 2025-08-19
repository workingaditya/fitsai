import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemStatusIndicator = () => {
  const [systemStatus, setSystemStatus] = useState({
    llm: {
      status: 'connected',
      name: 'Mistral 7B',
      responseTime: '1.2s',
      uptime: '99.8%'
    },
    itsm: {
      status: 'connected',
      name: 'ServiceNow',
      lastSync: '5 min ago',
      uptime: '99.9%'
    },
    knowledgeBase: {
      status: 'syncing',
      name: 'Enterprise KB',
      lastUpdate: '2 hours ago',
      articles: 1247
    },
    ldap: {
      status: 'connected',
      name: 'Active Directory',
      users: 342,
      lastSync: '1 min ago'
    }
  });

  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'syncing': return 'text-warning';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'syncing': return 'RefreshCw';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'disconnected': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'syncing': return 'Syncing';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        llm: {
          ...prev?.llm,
          responseTime: `${(Math.random() * 2 + 0.5)?.toFixed(1)}s`
        },
        knowledgeBase: {
          ...prev?.knowledgeBase,
          status: Math.random() > 0.7 ? 'syncing' : 'connected'
        }
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const overallStatus = Object.values(systemStatus)?.every(service => 
    service?.status === 'connected' ) ?'healthy' : 'warning';

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2"
      >
        <div className={`w-2 h-2 rounded-full ${
          overallStatus === 'healthy' ? 'bg-success' : 'bg-warning'
        } animate-pulse`} />
        <span className="text-sm">System Status</span>
        <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={14} />
      </Button>
      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-popover-foreground">System Status</h3>
              <div className={`flex items-center space-x-2 ${
                overallStatus === 'healthy' ? 'text-success' : 'text-warning'
              }`}>
                <Icon name={overallStatus === 'healthy' ? 'CheckCircle' : 'AlertTriangle'} size={16} />
                <span className="text-sm capitalize">{overallStatus}</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* LLM Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Brain" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-popover-foreground">
                    {systemStatus?.llm?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Response: {systemStatus?.llm?.responseTime} • Uptime: {systemStatus?.llm?.uptime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getStatusIcon(systemStatus?.llm?.status)} 
                  size={14} 
                  className={getStatusColor(systemStatus?.llm?.status)}
                />
                <span className={`text-xs ${getStatusColor(systemStatus?.llm?.status)}`}>
                  {getStatusText(systemStatus?.llm?.status)}
                </span>
              </div>
            </div>

            {/* ITSM Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Settings" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-popover-foreground">
                    {systemStatus?.itsm?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last sync: {systemStatus?.itsm?.lastSync} • Uptime: {systemStatus?.itsm?.uptime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getStatusIcon(systemStatus?.itsm?.status)} 
                  size={14} 
                  className={getStatusColor(systemStatus?.itsm?.status)}
                />
                <span className={`text-xs ${getStatusColor(systemStatus?.itsm?.status)}`}>
                  {getStatusText(systemStatus?.itsm?.status)}
                </span>
              </div>
            </div>

            {/* Knowledge Base Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Database" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-popover-foreground">
                    {systemStatus?.knowledgeBase?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {systemStatus?.knowledgeBase?.articles} articles • Updated: {systemStatus?.knowledgeBase?.lastUpdate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getStatusIcon(systemStatus?.knowledgeBase?.status)} 
                  size={14} 
                  className={`${getStatusColor(systemStatus?.knowledgeBase?.status)} ${
                    systemStatus?.knowledgeBase?.status === 'syncing' ? 'animate-spin' : ''
                  }`}
                />
                <span className={`text-xs ${getStatusColor(systemStatus?.knowledgeBase?.status)}`}>
                  {getStatusText(systemStatus?.knowledgeBase?.status)}
                </span>
              </div>
            </div>

            {/* LDAP Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Users" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-popover-foreground">
                    {systemStatus?.ldap?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {systemStatus?.ldap?.users} users • Last sync: {systemStatus?.ldap?.lastSync}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getStatusIcon(systemStatus?.ldap?.status)} 
                  size={14} 
                  className={getStatusColor(systemStatus?.ldap?.status)}
                />
                <span className={`text-xs ${getStatusColor(systemStatus?.ldap?.status)}`}>
                  {getStatusText(systemStatus?.ldap?.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full text-center">
              View Detailed Monitoring
            </Button>
          </div>
        </div>
      )}
      {/* Click outside handler */}
      {showDetails && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default SystemStatusIndicator;