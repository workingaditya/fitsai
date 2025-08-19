import React from 'react';
import { Brain, Activity, CheckCircle, XCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';

const ModelFilterSidebar = ({ 
  llmMetrics, 
  integrationHealth, 
  selectedModel, 
  onModelSelect, 
  performanceSummary,
  selectedProvider,
  onProviderChange 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rate_limited':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rate_limited': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-orange-100 text-orange-800';
      case 'gemini': return 'bg-blue-100 text-blue-800';
      case 'local': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000)?.toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000)?.toFixed(1) + 'K';
    return num?.toString();
  };

  const groupedModels = llmMetrics?.reduce((acc, model) => {
    const provider = model?.provider || 'unknown';
    if (!acc?.[provider]) acc[provider] = [];
    acc?.[provider]?.push(model);
    return acc;
  }, {});

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          LLM Models
        </h2>
      </div>

      {/* Performance Overview */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Overview</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Models</span>
            <span className="text-sm font-medium text-gray-900">{performanceSummary?.totalModels || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Available</span>
            <span className="text-sm font-medium text-green-600">{performanceSummary?.availableModels || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Avg Conversation</span>
            <span className="text-sm font-medium text-gray-900">
              {performanceSummary?.avgConversationLength?.toFixed(0) || 0} msgs
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Satisfaction</span>
            <span className="text-sm font-medium text-gray-900">
              {performanceSummary?.conversationSatisfaction?.average?.toFixed(1) || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Model List by Provider */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Models by Provider</h3>
          
          {Object.entries(groupedModels || {})?.map(([provider, models]) => (
            <div key={provider} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 capitalize">{provider}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getProviderColor(provider)}`}>
                  {models?.length} models
                </span>
              </div>
              
              <div className="space-y-2">
                {models?.map((model) => (
                  <div
                    key={model?.id}
                    onClick={() => onModelSelect(model)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedModel?.id === model?.id
                        ? 'border-purple-500 bg-purple-50' :'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {model?.model_name}
                      </h5>
                      {getStatusIcon(model?.model_status)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Requests</span>
                        <span className="text-gray-900 font-medium">
                          {formatNumber(model?.request_count)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Tokens</span>
                        <span className="text-gray-900 font-medium">
                          {formatNumber(model?.total_tokens)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Avg Response</span>
                        <span className="text-gray-900 font-medium">
                          {model?.avg_response_time_ms?.toFixed(0)}ms
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Success Rate</span>
                        <span className="text-gray-900 font-medium">
                          {model?.success_rate?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Cost</span>
                        <span className="text-gray-900 font-medium">
                          ${model?.total_cost?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(model?.model_status)}`}>
                        {model?.model_status}
                      </span>
                    </div>

                    {/* Error indicators */}
                    {model?.error_count > 0 && (
                      <div className="mt-2 flex items-center text-xs text-red-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {model?.error_count} errors
                      </div>
                    )}

                    {/* Rate limit indicators */}
                    {model?.rate_limit_hits > 0 && (
                      <div className="mt-1 flex items-center text-xs text-yellow-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {model?.rate_limit_hits} rate limits
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Health Section */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Activity className="h-4 w-4 mr-1" />
            LLM Service Health
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
                  <span>Response Time</span>
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

                {/* Cost information */}
                {integration?.cost_current_month > 0 && (
                  <div className="mt-1 flex items-center text-xs text-gray-600">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${integration?.cost_current_month?.toFixed(2)} this month
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Refresh Metrics
          </button>
          <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Export Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelFilterSidebar;