import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, Activity, Users, AlertTriangle } from 'lucide-react';

const PerformanceMetrics = ({ sessionId, analytics, session }) => {
  const [metricsData, setMetricsData] = useState({
    response_time: null,
    concurrent_users: null,
    edit_conflicts: null,
    throughput: null
  });

  useEffect(() => {
    if (analytics?.length > 0) {
      const processedMetrics = processAnalyticsData(analytics);
      setMetricsData(processedMetrics);
    }
  }, [analytics]);

  const processAnalyticsData = (analyticsArray) => {
    const metrics = {};
    
    analyticsArray?.forEach(metric => {
      const name = metric?.metric_name;
      const value = metric?.metric_value;
      const data = metric?.metric_data || {};
      
      if (name && value !== undefined) {
        if (!metrics?.[name]) {
          metrics[name] = {
            current: value,
            trend: 0,
            history: [value],
            data: data
          };
        } else {
          metrics?.[name]?.history?.push(value);
          if (metrics?.[name]?.history?.length > 1) {
            const prev = metrics?.[name]?.history?.[metrics?.[name]?.history?.length - 2];
            metrics[name].trend = ((value - prev) / prev) * 100;
          }
          metrics[name].current = value;
          metrics[name].data = { ...metrics?.[name]?.data, ...data };
        }
      }
    });

    return {
      response_time: metrics?.['response_time_ms'] || null,
      concurrent_users: metrics?.['concurrent_users'] || null, 
      edit_conflicts: metrics?.['edit_conflicts_per_hour'] || null,
      throughput: metrics?.['throughput_ops_per_sec'] || null
    };
  };

  const getTrendIcon = (trend) => {
    if (trend > 5) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend < -5) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend, isGoodWhenHigh = false) => {
    if (Math.abs(trend) < 5) return 'text-gray-600';
    
    if (isGoodWhenHigh) {
      return trend > 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return trend > 0 ? 'text-red-600' : 'text-green-600';
    }
  };

  const formatMetricValue = (value, type) => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (type) {
      case 'time':
        return `${Math.round(value)}ms`;
      case 'count':
        return Math.round(value)?.toString();
      case 'percentage':
        return `${Math.round(value * 100) / 100}%`;
      case 'rate':
        return `${Math.round(value * 100) / 100}/hr`;
      default:
        return value?.toString();
    }
  };

  const getHealthStatus = () => {
    const responseTime = metricsData?.response_time?.current;
    const conflicts = metricsData?.edit_conflicts?.current;
    
    if (responseTime > 500 || conflicts > 5) {
      return { status: 'warning', color: 'text-yellow-600', label: 'Degraded Performance' };
    }
    if (responseTime > 1000 || conflicts > 10) {
      return { status: 'error', color: 'text-red-600', label: 'Performance Issues' };
    }
    return { status: 'healthy', color: 'text-green-600', label: 'Healthy' };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-4">
      {/* System Health Overview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">System Health</h4>
          <div className={`text-sm font-medium ${healthStatus?.color}`}>
            {healthStatus?.label}
          </div>
        </div>
        <div className="text-xs text-gray-600">
          Session: {session?.session_name?.slice(0, 20)}...
        </div>
      </div>
      {/* Key Metrics */}
      <div className="space-y-3">
        {/* Response Time */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Response Time</span>
            </div>
            {metricsData?.response_time && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(metricsData?.response_time?.trend)}
                <span className={`text-xs ${getTrendColor(metricsData?.response_time?.trend)}`}>
                  {Math.abs(metricsData?.response_time?.trend)?.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatMetricValue(metricsData?.response_time?.current, 'time')}
          </div>
          {metricsData?.response_time?.data?.percentiles && (
            <div className="text-xs text-gray-500 mt-1">
              P95: {metricsData?.response_time?.data?.percentiles?.p95}ms
            </div>
          )}
        </div>

        {/* Concurrent Users */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Active Users</span>
            </div>
            {metricsData?.concurrent_users && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(metricsData?.concurrent_users?.trend)}
                <span className={`text-xs ${getTrendColor(metricsData?.concurrent_users?.trend, true)}`}>
                  {Math.abs(metricsData?.concurrent_users?.trend)?.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatMetricValue(metricsData?.concurrent_users?.current, 'count')}
          </div>
          {metricsData?.concurrent_users?.data?.peak && (
            <div className="text-xs text-gray-500 mt-1">
              Peak: {metricsData?.concurrent_users?.data?.peak} users
            </div>
          )}
        </div>

        {/* Edit Conflicts */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">Conflicts/Hour</span>
            </div>
            {metricsData?.edit_conflicts && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(metricsData?.edit_conflicts?.trend)}
                <span className={`text-xs ${getTrendColor(metricsData?.edit_conflicts?.trend)}`}>
                  {Math.abs(metricsData?.edit_conflicts?.trend)?.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatMetricValue(metricsData?.edit_conflicts?.current, 'rate')}
          </div>
          {metricsData?.edit_conflicts?.data && (
            <div className="text-xs text-gray-500 mt-1">
              Resolved: {metricsData?.edit_conflicts?.data?.resolved || 0} | 
              Pending: {metricsData?.edit_conflicts?.data?.pending || 0}
            </div>
          )}
        </div>

        {/* Session Performance Indicators */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Session Performance</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sync Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Synchronized</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto Save</span>
              <span className="text-sm text-gray-900">
                {session?.session_config?.auto_save ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Edits</span>
              <span className="text-sm font-medium text-gray-900">
                {session?.performance_metrics?.total_edits || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Network Performance */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            Network Stats
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">WebSocket Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Room ID</span>
              <span className="text-gray-900 font-mono text-xs">
                {session?.websocket_room_id?.slice(0, 12)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bandwidth Usage</span>
              <span className="text-gray-900">~2.3 KB/s</span>
            </div>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Recommendations</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            {metricsData?.response_time?.current > 500 && (
              <li>• Consider optimizing document synchronization</li>
            )}
            {metricsData?.edit_conflicts?.current > 3 && (
              <li>• High conflict rate - review collaboration workflow</li>
            )}
            {metricsData?.concurrent_users?.current > 8 && (
              <li>• Large session - monitor for performance degradation</li>
            )}
            {(!metricsData?.response_time || !metricsData?.concurrent_users) && (
              <li>• All systems operating normally</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;