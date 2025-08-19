import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncidentPanel = ({ incidents = [], systemHealth, services = [] }) => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [recentOutages, setRecentOutages] = useState([]);
  const [automatedActions, setAutomatedActions] = useState([]);

  useEffect(() => {
    // Generate active alerts based on system health
    const alerts = [];
    
    services?.forEach((service) => {
      if (service?.status === 'down') {
        alerts?.push({
          id: `alert-${service?.id}`,
          type: 'service_outage',
          severity: 'high',
          title: `Service Outage: ${service?.name}`,
          message: `${service?.name} is currently down and not responding to health checks`,
          timestamp: new Date()?.toISOString(),
          affected_service: service?.name,
          service_id: service?.id
        });
      } else if (service?.status === 'degraded') {
        alerts?.push({
          id: `alert-${service?.id}`,
          type: 'performance_degradation',
          severity: 'medium',
          title: `Performance Issue: ${service?.name}`,
          message: `${service?.name} is experiencing degraded performance`,
          timestamp: new Date()?.toISOString(),
          affected_service: service?.name,
          service_id: service?.id
        });
      }
      
      // Check for authentication failures based on service type
      if (service?.service_type === 'auth' && service?.status !== 'healthy') {
        alerts?.push({
          id: `auth-alert-${service?.id}`,
          type: 'authentication_failure',
          severity: 'high',
          title: 'Authentication Service Issues',
          message: 'Users may experience login difficulties',
          timestamp: new Date()?.toISOString(),
          affected_service: service?.name,
          service_id: service?.id
        });
      }
    });

    // Add quota limit warnings (mock data)
    if (Math.random() > 0.7) {
      alerts?.push({
        id: 'quota-warning',
        type: 'quota_limit',
        severity: 'medium',
        title: 'API Quota Warning',
        message: 'OpenAI API usage is at 85% of monthly limit',
        timestamp: new Date(Date.now() - Math.random() * 3600000)?.toISOString(),
        affected_service: 'OpenAI LLM'
      });
    }

    setActiveAlerts(alerts?.slice(0, 5));

    // Generate recent outages
    const outages = services
      ?.filter(service => service?.status === 'down' || service?.status === 'degraded')
      ?.slice(0, 3)
      ?.map((service, index) => ({
        id: `outage-${service?.id}`,
        service_name: service?.name,
        start_time: new Date(Date.now() - Math.random() * 7200000)?.toISOString(),
        status: service?.status,
        duration: `${Math.floor(Math.random() * 120 + 10)}m`,
        impact: service?.status === 'down' ? 'High' : 'Medium'
      }));

    setRecentOutages(outages);

    // Generate automated actions
    const actions = [
      {
        id: 'action-1',
        type: 'auto_restart',
        action: 'Automatic service restart initiated',
        service: 'FITS API Server',
        timestamp: new Date(Date.now() - Math.random() * 1800000)?.toISOString(),
        status: 'completed'
      },
      {
        id: 'action-2',
        type: 'failover',
        action: 'Traffic routed to backup endpoint',
        service: 'Y-WebSocket Server',
        timestamp: new Date(Date.now() - Math.random() * 3600000)?.toISOString(),
        status: 'active'
      }
    ];

    setAutomatedActions(actions?.slice(0, 3));
  }, [services, systemHealth]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      case 'low':
        return 'Info';
      default:
        return 'Circle';
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'auto_restart':
        return 'RefreshCw';
      case 'failover':
        return 'ArrowRight';
      case 'scale_up':
        return 'TrendingUp';
      default:
        return 'Zap';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Bell" size={20} />
              <span>Active Alerts</span>
            </h3>
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
              {activeAlerts?.length}
            </span>
          </div>
        </div>
        
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {activeAlerts?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active alerts</p>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </div>
          ) : (
            activeAlerts?.map((alert) => (
              <div key={alert?.id} className={`p-3 rounded-lg border ${getSeverityColor(alert?.severity)}`}>
                <div className="flex items-start space-x-3">
                  <Icon name={getSeverityIcon(alert?.severity)} size={16} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{alert?.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{alert?.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert?.timestamp)}
                      </span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Outages */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} />
            <span>Recent Issues</span>
          </h3>
        </div>
        
        <div className="p-4 space-y-3">
          {recentOutages?.length === 0 ? (
            <div className="text-center py-4">
              <Icon name="Shield" size={24} className="text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent issues</p>
            </div>
          ) : (
            recentOutages?.map((outage) => (
              <div key={outage?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{outage?.service_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {outage?.status === 'down' ? 'Service outage' : 'Performance degradation'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{outage?.duration}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    outage?.impact === 'High' ? 'bg-destructive/10 text-destructive' :
                    outage?.impact === 'Medium'? 'bg-warning/10 text-warning' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {outage?.impact}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Automated Recovery Actions */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Zap" size={20} />
            <span>Auto Recovery</span>
          </h3>
        </div>
        
        <div className="p-4 space-y-3">
          {automatedActions?.length === 0 ? (
            <div className="text-center py-4">
              <Icon name="Zap" size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent actions</p>
            </div>
          ) : (
            automatedActions?.map((action) => (
              <div key={action?.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <Icon name={getActionIcon(action?.type)} size={16} className="text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{action?.action}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{action?.service}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(action?.timestamp)}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        action?.status === 'completed' ? 'bg-success' :
                        action?.status === 'active'? 'bg-warning' : 'bg-muted-foreground'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Integration Status Summary */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Activity" size={20} />
            <span>System Overview</span>
          </h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{systemHealth?.healthy_services || 0}</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{(systemHealth?.warnings || 0) + (systemHealth?.errors || 0)}</p>
              <p className="text-xs text-muted-foreground">Issues</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <Icon name="BarChart" size={16} />
              View Full Report
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Icon name="Settings" size={16} />
              Configure Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentPanel;