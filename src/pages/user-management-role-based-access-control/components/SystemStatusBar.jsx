import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemStatusBar = () => {
  const [systemStatus, setSystemStatus] = useState({
    ldap: { status: 'connected', lastSync: new Date(Date.now() - 5 * 60 * 1000), users: 277 },
    sso: { status: 'connected', provider: 'Active Directory', sessions: 156 },
    database: { status: 'connected', responseTime: 45, connections: 23 },
    audit: { status: 'connected', logs: 1247, storage: '78%' }
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        database: {
          ...prev?.database,
          responseTime: Math.floor(Math.random() * 100) + 20,
          connections: Math.floor(Math.random() * 50) + 10
        },
        sso: {
          ...prev?.sso,
          sessions: Math.floor(Math.random() * 200) + 100
        }
      }));
    }, 30000);

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

  const formatLastSync = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* LDAP Status */}
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(systemStatus?.ldap?.status)} 
              size={16} 
              className={getStatusColor(systemStatus?.ldap?.status)}
            />
            <div>
              <span className="text-sm font-medium text-card-foreground">LDAP</span>
              <p className="text-xs text-muted-foreground">
                {systemStatus?.ldap?.users} users • Synced {formatLastSync(systemStatus?.ldap?.lastSync)}
              </p>
            </div>
          </div>

          {/* SSO Status */}
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(systemStatus?.sso?.status)} 
              size={16} 
              className={getStatusColor(systemStatus?.sso?.status)}
            />
            <div>
              <span className="text-sm font-medium text-card-foreground">SSO</span>
              <p className="text-xs text-muted-foreground">
                {systemStatus?.sso?.sessions} active sessions
              </p>
            </div>
          </div>

          {/* Database Status */}
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(systemStatus?.database?.status)} 
              size={16} 
              className={getStatusColor(systemStatus?.database?.status)}
            />
            <div>
              <span className="text-sm font-medium text-card-foreground">Database</span>
              <p className="text-xs text-muted-foreground">
                {systemStatus?.database?.responseTime}ms • {systemStatus?.database?.connections} connections
              </p>
            </div>
          </div>

          {/* Audit Status */}
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(systemStatus?.audit?.status)} 
              size={16} 
              className={getStatusColor(systemStatus?.audit?.status)}
            />
            <div>
              <span className="text-sm font-medium text-card-foreground">Audit</span>
              <p className="text-xs text-muted-foreground">
                {systemStatus?.audit?.logs} logs • {systemStatus?.audit?.storage} storage
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Icon name="Info" size={14} className="mr-2" />
            {showDetails ? 'Hide' : 'Details'}
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Sync Now
          </Button>
        </div>
      </div>
      {/* Detailed Status */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-card-foreground">LDAP Directory</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Server:</span>
                  <span className="text-card-foreground">ldap.company.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Port:</span>
                  <span className="text-card-foreground">636 (SSL)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base DN:</span>
                  <span className="text-card-foreground">dc=company,dc=com</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-card-foreground">SSO Provider</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="text-card-foreground">{systemStatus?.sso?.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span className="text-card-foreground">SAML 2.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate:</span>
                  <span className="text-success">Valid</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-card-foreground">Database</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-card-foreground">PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="text-card-foreground">14.9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pool Size:</span>
                  <span className="text-card-foreground">50</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-card-foreground">Audit Trail</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retention:</span>
                  <span className="text-card-foreground">7 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Encryption:</span>
                  <span className="text-success">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Backup:</span>
                  <span className="text-success">Daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemStatusBar;