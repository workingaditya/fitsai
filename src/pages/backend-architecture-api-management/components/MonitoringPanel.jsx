import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  Database,
  Globe,
  Server,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';


const MonitoringPanel = ({ metrics = [], services = [], selectedService }) => {
  const [liveMetrics, setLiveMetrics] = useState([]);

  useEffect(() => {
    // Simulate live metrics updates
    const interval = setInterval(() => {
      const newMetric = {
        id: Date.now(),
        service_id: selectedService?.id || services?.[0]?.id,
        metric_name: ['cpu_usage', 'memory_usage', 'response_time', 'requests_per_minute']?.[Math.floor(Math.random() * 4)],
        metric_value: Math.random() * 100,
        metric_unit: 'percent',
        timestamp: new Date()?.toISOString(),
        service: selectedService || services?.[0]
      };
      
      setLiveMetrics(prev => [newMetric, ...prev]?.slice(0, 20));
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedService, services]);

  const getMetricIcon = (metricName) => {
    const iconMap = {
      cpu_usage: Activity,
      memory_usage: Database,
      response_time: Clock,
      requests_per_minute: Globe,
      active_connections: Server,
      query_response_time: Database,
      health_check_response_time: Zap,
      default: Activity
    };
    const Icon = iconMap?.[metricName] || iconMap?.default;
    return <Icon className="h-4 w-4" />;
  };

  const getMetricColor = (metricName, value) => {
    const thresholds = {
      cpu_usage: { warning: 70, danger: 90 },
      memory_usage: { warning: 80, danger: 95 },
      response_time: { warning: 1000, danger: 2000 },
      query_response_time: { warning: 200, danger: 500 }
    };

    const threshold = thresholds?.[metricName];
    if (!threshold) return 'text-blue-600 bg-blue-50';

    if (value >= threshold?.danger) return 'text-red-600 bg-red-50';
    if (value >= threshold?.warning) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatMetricValue = (value, unit) => {
    if (unit === 'percent') {
      return `${Math.round(value)}%`;
    } else if (unit === 'milliseconds') {
      return `${Math.round(value)}ms`;
    } else if (unit === 'count') {
      return Math.round(value)?.toLocaleString();
    }
    return Math.round(value * 100) / 100;
  };

  const getServiceHealth = (serviceId) => {
    const serviceMetrics = metrics?.filter(m => m?.service_id === serviceId) || [];
    if (!serviceMetrics?.length) return 'unknown';

    const recentMetrics = serviceMetrics?.slice(0, 5);
    const hasIssues = recentMetrics?.some(m => {
      if (m?.metric_name === 'cpu_usage' && m?.metric_value > 90) return true;
      if (m?.metric_name === 'memory_usage' && m?.metric_value > 95) return true;
      if (m?.metric_name === 'response_time' && m?.metric_value > 2000) return true;
      return false;
    });

    return hasIssues ? 'warning' : 'healthy';
  };

  const allMetrics = [...(metrics || []), ...liveMetrics];
  const recentMetrics = allMetrics?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp))?.slice(0, 15);

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="h-5 w-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-900">Live Monitoring</h2>
        </div>
        <p className="text-sm text-gray-500">Real-time system metrics</p>
      </div>
      {/* Service Health Overview */}
      {selectedService && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {selectedService?.name} Health
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Status</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                selectedService?.status === 'healthy' ? 'bg-green-100 text-green-800' :
                selectedService?.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                selectedService?.status === 'down'? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedService?.status}
              </span>
            </div>
            {selectedService?.last_health_check && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Last Check</span>
                <span className="text-xs text-gray-700">
                  {formatDistanceToNow(new Date(selectedService.last_health_check), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">System Overview</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-800">Healthy</span>
            </div>
            <span className="text-sm font-semibold text-green-900">
              {services?.filter(s => s?.status === 'healthy')?.length || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">Degraded</span>
            </div>
            <span className="text-sm font-semibold text-yellow-900">
              {services?.filter(s => s?.status === 'degraded')?.length || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-800">Down</span>
            </div>
            <span className="text-sm font-semibold text-red-900">
              {services?.filter(s => s?.status === 'down')?.length || 0}
            </span>
          </div>
        </div>
      </div>
      {/* Live Metrics Stream */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Live Metrics</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>

          <div className="space-y-2">
            {recentMetrics?.length ? (
              recentMetrics?.map((metric, index) => (
                <div key={`${metric?.id || index}-${metric?.timestamp}`} className="bg-white border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getMetricColor(metric?.metric_name, metric?.metric_value)}`}>
                        {getMetricIcon(metric?.metric_name)}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900 capitalize">
                          {metric?.metric_name?.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {metric?.service?.name || 'System'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatMetricValue(metric?.metric_value, metric?.metric_unit)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(metric?.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  {/* Trend indicator for some metrics */}
                  {['cpu_usage', 'memory_usage', 'response_time']?.includes(metric?.metric_name) && (
                    <div className="flex items-center justify-end">
                      {Math.random() > 0.5 ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <TrendingDown className="h-3 w-3" />
                          <span className="text-xs">Improving</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-600">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-xs">Increasing</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Activity className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No metrics data available</p>
                <p className="text-xs text-gray-400 mt-1">Metrics will appear here in real-time</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Resource Usage Summary */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Resource Usage</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">API Calls/Hour</span>
            <span className="text-gray-900 font-medium">1,250</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Storage Usage</span>
            <span className="text-gray-900 font-medium">120.5 GB</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Active Users</span>
            <span className="text-gray-900 font-medium">234</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Response Time</span>
            <span className="text-gray-900 font-medium">125ms</span>
          </div>
        </div>
      </div>
      {/* Alerts Section */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Active Alerts</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <div>
              <div className="text-xs font-medium text-yellow-800">High Memory Usage</div>
              <div className="text-xs text-yellow-700">API Server: 85%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPanel;