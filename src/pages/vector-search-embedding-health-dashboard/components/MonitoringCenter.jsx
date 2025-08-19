import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, Clock, AlertTriangle } from 'lucide-react';

const MonitoringCenter = ({ vectorMetrics, performanceTrends, healthSummary, timeRange, onMetricSelect }) => {
  const [selectedChart, setSelectedChart] = useState('latency');

  // Prepare chart data
  const latencyData = performanceTrends?.queryLatency || [];
  const throughputData = performanceTrends?.throughput || [];
  const errorRateData = performanceTrends?.errorRate || [];

  const operationTypeData = healthSummary?.operationsByType ? 
    Object.entries(healthSummary?.operationsByType)?.map(([type, data]) => ({
      name: type,
      count: data?.count,
      success: data?.success,
      successRate: data?.count > 0 ? (data?.success / data?.count) * 100 : 0,
      avgTime: data?.totalTime / Math.max(data?.count, 1)
    })) : [];

  const indexStatusData = healthSummary?.indexStatusDistribution ? 
    Object.entries(healthSummary?.indexStatusDistribution)?.map(([status, count]) => ({
      name: status,
      value: count
    })) : [];

  const COLORS = {
    healthy: '#10B981',
    degraded: '#F59E0B', 
    error: '#EF4444',
    maintenance: '#3B82F6'
  };

  const chartOptions = [
    { key: 'latency', label: 'Query Latency', icon: Clock },
    { key: 'throughput', label: 'Throughput', icon: TrendingUp },
    { key: 'errors', label: 'Error Rate', icon: AlertTriangle },
    { key: 'operations', label: 'Operations', icon: Activity }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'latency':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value)?.toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value)?.toLocaleString()}
                formatter={(value) => [`${value}ms`, 'Latency']}
              />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'throughput':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value)?.toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value)?.toLocaleString()}
                formatter={(value) => [`${value}`, 'Queries/sec']}
              />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'errors':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={errorRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value)?.toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value)?.toLocaleString()}
                formatter={(value) => [`${value}%`, 'Error Rate']}
              />
              <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'operations':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={operationTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Chart Controls */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Vector Search Analytics</h2>
        <div className="flex space-x-2">
          {chartOptions?.map((option) => {
            const IconComponent = option?.icon;
            return (
              <button
                key={option?.key}
                onClick={() => setSelectedChart(option?.key)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedChart === option?.key
                    ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {option?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {chartOptions?.find(opt => opt?.key === selectedChart)?.label} Trends
          </h3>
          <div className="text-sm text-gray-500">
            Last {timeRange}
          </div>
        </div>
        {renderChart()}
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Index Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Index Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={indexStatusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {indexStatusData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[entry?.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Operation Success Rates */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Operation Success Rates</h3>
          <div className="space-y-3">
            {operationTypeData?.map((operation) => (
              <div key={operation?.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {operation?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {operation?.successRate?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${operation?.successRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{operation?.success}/{operation?.count} successful</span>
                    <span>{operation?.avgTime?.toFixed(0)}ms avg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vector Metrics Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Vector Index Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Index Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vectors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fullness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Query Latency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Namespace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vectorMetrics?.map((metric) => (
                <tr key={metric?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {metric?.index_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {metric?.dimensions} dimensions
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      metric?.index_status === 'healthy' ?'bg-green-100 text-green-800'
                        : metric?.index_status === 'degraded' ?'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'
                    }`}>
                      {metric?.index_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric?.total_vectors?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(metric?.fullness_percentage || 0, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {metric?.fullness_percentage?.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric?.query_latency_ms?.toFixed(1)}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                      {metric?.namespace || 'default'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onMetricSelect(metric)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringCenter;