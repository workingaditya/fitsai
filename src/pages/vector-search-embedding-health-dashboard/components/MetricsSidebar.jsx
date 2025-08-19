import React from 'react';
import { Database, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

const MetricsSidebar = ({ vectorMetrics, integrationHealth, selectedMetric, onMetricSelect, healthSummary }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 text-blue-600 mr-2" />
          Vector Metrics
        </h2>
      </div>

      {/* Health Overview Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Index Health Overview</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Indexes</span>
            <span className="text-sm font-medium text-gray-900">{healthSummary?.totalIndexes || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Healthy</span>
            <span className="text-sm font-medium text-green-600">{healthSummary?.healthyIndexes || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Vectors</span>
            <span className="text-sm font-medium text-gray-900">
              {healthSummary?.totalVectors?.toLocaleString() || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Vector Metrics List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Vector Indexes</h3>
          <div className="space-y-2">
            {vectorMetrics?.map((metric) => (
              <div
                key={metric?.id}
                onClick={() => onMetricSelect(metric)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedMetric?.id === metric?.id
                    ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {metric?.index_name}
                  </h4>
                  {getStatusIcon(metric?.index_status)}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Vectors</span>
                    <span className="text-gray-900 font-medium">
                      {metric?.total_vectors?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Latency</span>
                    <span className="text-gray-900 font-medium">
                      {metric?.query_latency_ms?.toFixed(1)}ms
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Fullness</span>
                    <span className="text-gray-900 font-medium">
                      {metric?.fullness_percentage?.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {metric?.namespace && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {metric?.namespace}
                    </span>
                  </div>
                )}

                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(metric?.index_status)}`}>
                    {metric?.index_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Health Section */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-1" />
            Integration Health
          </h3>
          <div className="space-y-2">
            {integrationHealth?.map((integration) => (
              <div key={integration?.id} className="p-2 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {integration?.integration_name}
                  </span>
                  {getStatusIcon(integration?.status)}
                </div>
                
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{integration?.integration_type}</span>
                  <span>{integration?.response_time_ms?.toFixed(0)}ms</span>
                </div>

                <div className="mt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Uptime</span>
                    <span className="text-gray-900 font-medium">
                      {integration?.uptime_percentage?.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-1">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded ${getStatusBadgeColor(integration?.status)}`}>
                    {integration?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Run Health Check
          </button>
          <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Export Metrics
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsSidebar;