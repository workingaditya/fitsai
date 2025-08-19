import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { DollarSign, Clock, Activity, Users, Brain } from 'lucide-react';

const AnalyticsCenter = ({ 
  llmMetrics, 
  performanceSummary, 
  conversations, 
  tokenAnalysis, 
  timeRange, 
  selectedProvider,
  onModelSelect 
}) => {
  const [selectedChart, setSelectedChart] = useState('requests');

  // Prepare chart data
  const requestVolumeData = llmMetrics?.map(model => ({
    name: model?.model_name?.split('-')?.[0] || model?.model_name,
    requests: model?.request_count,
    cost: parseFloat(model?.total_cost) || 0,
    responseTime: model?.avg_response_time_ms,
    successRate: model?.success_rate
  })) || [];

  const tokenUsageData = llmMetrics?.map(model => ({
    name: model?.model_name?.split('-')?.[0] || model?.model_name,
    prompt: model?.prompt_tokens,
    completion: model?.completion_tokens,
    total: model?.total_tokens,
    cost: parseFloat(model?.total_cost) || 0
  })) || [];

  const providerDistribution = performanceSummary?.modelDistribution ? 
    Object.entries(performanceSummary?.modelDistribution)?.map(([provider, data]) => ({
      name: provider,
      requests: data?.requests,
      cost: data?.cost,
      models: data?.models,
      avgResponseTime: data?.avgResponseTime
    })) : [];

  const conversationTrends = conversations?.slice(0, 10)?.map((conv, index) => ({
    session: `Session ${index + 1}`,
    messages: conv?.message_count,
    tokens: conv?.total_tokens,
    duration: conv?.session_duration_seconds / 60, // Convert to minutes
    satisfaction: conv?.satisfaction_rating || 0
  })) || [];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  const chartOptions = [
    { key: 'requests', label: 'Request Volume', icon: Activity },
    { key: 'tokens', label: 'Token Usage', icon: Brain },
    { key: 'costs', label: 'Cost Analysis', icon: DollarSign },
    { key: 'performance', label: 'Response Times', icon: Clock },
    { key: 'conversations', label: 'Conversations', icon: Users }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'requests':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'requests' ? `${value?.toLocaleString()}` : value,
                name === 'requests' ? 'Requests' : 'Value'
              ]} />
              <Bar dataKey="requests" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'tokens':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={tokenUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value?.toLocaleString()} />
              <Area type="monotone" dataKey="prompt" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="completion" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'costs':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value?.toFixed(2)}`, 'Cost']} />
              <Bar dataKey="cost" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={requestVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value?.toFixed(0)}ms`, 'Response Time']} />
              <Line type="monotone" dataKey="responseTime" stroke="#ff7c7c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'conversations':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#8dd1e1" />
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">LLM Usage Analytics</h2>
        <div className="flex space-x-2 flex-wrap">
          {chartOptions?.map((option) => {
            const IconComponent = option?.icon;
            return (
              <button
                key={option?.key}
                onClick={() => setSelectedChart(option?.key)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
                  selectedChart === option?.key
                    ? 'bg-purple-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            {chartOptions?.find(opt => opt?.key === selectedChart)?.label} Analysis
          </h3>
          <div className="text-sm text-gray-500">
            Last {timeRange} • {selectedProvider === 'all' ? 'All Providers' : selectedProvider}
          </div>
        </div>
        {renderChart()}
      </div>
      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Provider Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Provider Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={providerDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="requests"
                label={({ name, value }) => `${name}: ${value?.toLocaleString()}`}
              >
                {providerDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value?.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Token Efficiency */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Token Efficiency by Model</h3>
          <div className="space-y-3">
            {tokenUsageData?.slice(0, 5)?.map((model, index) => (
              <div key={model?.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {model?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {((model?.total || 0) / 1000)?.toFixed(1)}K tokens
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min((model?.total / Math.max(...tokenUsageData?.map(m => m?.total), 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Prompt: {((model?.prompt || 0) / 1000)?.toFixed(1)}K</span>
                    <span>Completion: {((model?.completion || 0) / 1000)?.toFixed(1)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Model Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Model Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {llmMetrics?.map((model) => (
                <tr key={model?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => onModelSelect(model)}
                    >
                      {model?.model_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      model?.provider === 'openai' ?'bg-green-100 text-green-800'
                        : model?.provider === 'anthropic' ?'bg-orange-100 text-orange-800'
                        : model?.provider === 'gemini' ?'bg-blue-100 text-blue-800' :'bg-gray-100 text-gray-800'
                    }`}>
                      {model?.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model?.request_count?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(model?.total_tokens / 1000)?.toFixed(1)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {model?.avg_response_time_ms?.toFixed(0)}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            model?.success_rate >= 95 
                              ? 'bg-green-500' 
                              : model?.success_rate >= 90 
                              ? 'bg-yellow-500' :'bg-red-500'
                          }`}
                          style={{ width: `${model?.success_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {model?.success_rate?.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${model?.total_cost?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      model?.model_status === 'available' ?'bg-green-100 text-green-800'
                        : model?.model_status === 'rate_limited' ?'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'
                    }`}>
                      {model?.model_status}
                    </span>
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

export default AnalyticsCenter;