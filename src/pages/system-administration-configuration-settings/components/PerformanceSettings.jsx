import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PerformanceSettings = ({ settings, onSettingsChange, hasUnsavedChanges }) => {
  const [localSettings, setLocalSettings] = useState(settings?.performance || {});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const cachingStrategies = [
    { value: 'redis', label: 'Redis (Recommended)' },
    { value: 'memcached', label: 'Memcached' },
    { value: 'memory', label: 'In-Memory' },
    { value: 'disk', label: 'Disk-based' }
  ];

  const loadBalancingMethods = [
    { value: 'round-robin', label: 'Round Robin' },
    { value: 'least-connections', label: 'Least Connections' },
    { value: 'weighted', label: 'Weighted' },
    { value: 'ip-hash', label: 'IP Hash' }
  ];

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onSettingsChange('performance', updatedSettings);
  };

  const performanceMetrics = [
    { label: 'CPU Usage', value: '45%', status: 'success', trend: 'stable' },
    { label: 'Memory Usage', value: '67%', status: 'warning', trend: 'increasing' },
    { label: 'Disk I/O', value: '23%', status: 'success', trend: 'decreasing' },
    { label: 'Network Usage', value: '34%', status: 'success', trend: 'stable' },
    { label: 'Active Connections', value: '1,247', status: 'success', trend: 'stable' },
    { label: 'Response Time', value: '1.2s', status: 'warning', trend: 'increasing' },
    { label: 'Cache Hit Rate', value: '89%', status: 'success', trend: 'stable' },
    { label: 'Error Rate', value: '0.3%', status: 'success', trend: 'stable' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return 'TrendingUp';
      case 'decreasing': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Minus';
    }
  };

  return (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">System Performance</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceMetrics?.map((metric, index) => (
            <div key={index} className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{metric?.label}</span>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getTrendIcon(metric?.trend)} 
                    size={12} 
                    className={getStatusColor(metric?.status)}
                  />
                </div>
              </div>
              <p className={`text-lg font-semibold ${getStatusColor(metric?.status)}`}>
                {metric?.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Caching Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Database" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Caching Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Caching Strategy"
              options={cachingStrategies}
              value={localSettings?.cachingStrategy || 'redis'}
              onChange={(value) => handleInputChange('cachingStrategy', value)}
              description="Primary caching mechanism"
            />
            
            <Input
              label="Cache TTL (seconds)"
              type="number"
              value={localSettings?.cacheTtl || '3600'}
              onChange={(e) => handleInputChange('cacheTtl', e?.target?.value)}
              placeholder="3600"
              description="Default time-to-live for cached items"
            />
            
            <Input
              label="Max Cache Size (MB)"
              type="number"
              value={localSettings?.maxCacheSize || '1024'}
              onChange={(e) => handleInputChange('maxCacheSize', e?.target?.value)}
              placeholder="1024"
              description="Maximum memory allocation for cache"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={localSettings?.enableQueryCache || true}
                  onChange={(e) => handleInputChange('enableQueryCache', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Enable Query Caching</span>
              </label>
              
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={localSettings?.enableResponseCache || true}
                  onChange={(e) => handleInputChange('enableResponseCache', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Enable Response Caching</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localSettings?.enableStaticCache || true}
                  onChange={(e) => handleInputChange('enableStaticCache', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Enable Static Asset Caching</span>
              </label>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Cache Statistics</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Hit Rate:</span>
                  <span className="text-success">89.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Miss Rate:</span>
                  <span className="text-warning">10.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <span>687 MB / 1024 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Load Balancing */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Scale" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Load Balancing</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Load Balancing Method"
              options={loadBalancingMethods}
              value={localSettings?.loadBalancingMethod || 'round-robin'}
              onChange={(value) => handleInputChange('loadBalancingMethod', value)}
              description="Algorithm for distributing requests"
            />
            
            <Input
              label="Health Check Interval (seconds)"
              type="number"
              value={localSettings?.healthCheckInterval || '30'}
              onChange={(e) => handleInputChange('healthCheckInterval', e?.target?.value)}
              placeholder="30"
              description="Frequency of server health checks"
            />
            
            <Input
              label="Max Connections per Server"
              type="number"
              value={localSettings?.maxConnectionsPerServer || '1000'}
              onChange={(e) => handleInputChange('maxConnectionsPerServer', e?.target?.value)}
              placeholder="1000"
              description="Maximum concurrent connections per backend server"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={localSettings?.enableStickySession || false}
                  onChange={(e) => handleInputChange('enableStickySession', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Enable Sticky Sessions</span>
              </label>
              
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={localSettings?.enableFailover || true}
                  onChange={(e) => handleInputChange('enableFailover', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Enable Automatic Failover</span>
              </label>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Server Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Server 1 (Primary)</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span className="text-success">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Server 2 (Secondary)</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span className="text-success">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Server 3 (Backup)</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="AlertTriangle" size={12} className="text-warning" />
                    <span className="text-warning">Degraded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Resource Limits */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Gauge" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Resource Limits</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Max CPU Usage (%)"
            type="number"
            value={localSettings?.maxCpuUsage || '80'}
            onChange={(e) => handleInputChange('maxCpuUsage', e?.target?.value)}
            placeholder="80"
            description="CPU usage threshold for alerts"
          />
          
          <Input
            label="Max Memory Usage (%)"
            type="number"
            value={localSettings?.maxMemoryUsage || '85'}
            onChange={(e) => handleInputChange('maxMemoryUsage', e?.target?.value)}
            placeholder="85"
            description="Memory usage threshold for alerts"
          />
          
          <Input
            label="Max Concurrent Users"
            type="number"
            value={localSettings?.maxConcurrentUsers || '500'}
            onChange={(e) => handleInputChange('maxConcurrentUsers', e?.target?.value)}
            placeholder="500"
            description="Maximum simultaneous active users"
          />
        </div>
      </div>
      {/* Advanced Performance Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Advanced Settings</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Icon name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} size={16} className="mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>
        
        {showAdvanced && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Connection Pool Size"
                type="number"
                value={localSettings?.connectionPoolSize || '100'}
                onChange={(e) => handleInputChange('connectionPoolSize', e?.target?.value)}
                placeholder="100"
                description="Database connection pool size"
              />
              
              <Input
                label="Query Timeout (seconds)"
                type="number"
                value={localSettings?.queryTimeout || '30'}
                onChange={(e) => handleInputChange('queryTimeout', e?.target?.value)}
                placeholder="30"
                description="Maximum time for database queries"
              />
              
              <Input
                label="Thread Pool Size"
                type="number"
                value={localSettings?.threadPoolSize || '50'}
                onChange={(e) => handleInputChange('threadPoolSize', e?.target?.value)}
                placeholder="50"
                description="Worker thread pool size"
              />
              
              <Input
                label="Request Queue Size"
                type="number"
                value={localSettings?.requestQueueSize || '1000'}
                onChange={(e) => handleInputChange('requestQueueSize', e?.target?.value)}
                placeholder="1000"
                description="Maximum queued requests"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={localSettings?.enableCompression || true}
                    onChange={(e) => handleInputChange('enableCompression', e?.target?.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">Enable Response Compression</span>
                </label>
                
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={localSettings?.enableKeepAlive || true}
                    onChange={(e) => handleInputChange('enableKeepAlive', e?.target?.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">Enable HTTP Keep-Alive</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSettings?.enablePipelining || false}
                    onChange={(e) => handleInputChange('enablePipelining', e?.target?.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">Enable HTTP Pipelining</span>
                </label>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Performance Recommendations</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={12} className="text-success mt-0.5" />
                    <span>CPU usage is within optimal range</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={12} className="text-warning mt-0.5" />
                    <span>Consider increasing memory allocation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Icon name="Info" size={12} className="text-accent mt-0.5" />
                    <span>Cache hit rate could be improved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Save Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning">Performance changes may require system restart</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Reset Changes
            </Button>
            <Button variant="default" size="sm">
              Apply Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceSettings;