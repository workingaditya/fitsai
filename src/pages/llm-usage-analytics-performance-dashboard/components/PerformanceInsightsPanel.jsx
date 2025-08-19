import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, AlertTriangle, Info, Brain, Zap } from 'lucide-react';

const PerformanceInsightsPanel = ({ 
  selectedModel, 
  costOptimizationRecommendations, 
  tokenAnalysis, 
  integrationHealth,
  performanceSummary,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedModel) {
    return (
      <div className="w-96 bg-gray-50 border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Select a model to view performance insights</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Info },
    { key: 'performance', label: 'Performance', icon: TrendingUp },
    { key: 'costs', label: 'Costs', icon: DollarSign },
    { key: 'optimization', label: 'Optimization', icon: Zap }
  ];

  const calculateEfficiency = (model) => {
    const tokensPerRequest = model?.request_count > 0 ? model?.total_tokens / model?.request_count : 0;
    const costPerToken = model?.total_tokens > 0 ? model?.total_cost / model?.total_tokens : 0;
    const timePerToken = model?.total_tokens > 0 ? model?.avg_response_time_ms / model?.total_tokens : 0;
    
    return {
      tokensPerRequest: tokensPerRequest?.toFixed(1),
      costPerToken: (costPerToken * 1000)?.toFixed(4), // Cost per 1K tokens
      timePerToken: timePerToken?.toFixed(2)
    };
  };

  const efficiency = calculateEfficiency(selectedModel);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Model Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Model Name</span>
                  <span className="text-sm font-medium text-gray-900">{selectedModel?.model_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Provider</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedModel?.provider === 'openai' ?'bg-green-100 text-green-800'
                      : selectedModel?.provider === 'anthropic' ?'bg-orange-100 text-orange-800'
                      : selectedModel?.provider === 'gemini' ?'bg-blue-100 text-blue-800' :'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedModel?.provider}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedModel?.model_status === 'available' ?'bg-green-100 text-green-800'
                      : selectedModel?.model_status === 'rate_limited' ?'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'
                  }`}>
                    {selectedModel?.model_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Request</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedModel?.last_request_at ? 
                      new Date(selectedModel?.last_request_at)?.toLocaleString() : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Usage Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium">Total Requests</div>
                  <div className="text-lg font-bold text-purple-900">
                    {selectedModel?.request_count?.toLocaleString()}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">Total Tokens</div>
                  <div className="text-lg font-bold text-blue-900">
                    {(selectedModel?.total_tokens / 1000)?.toFixed(1)}K
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-green-600 font-medium">Success Rate</div>
                  <div className="text-lg font-bold text-green-900">
                    {selectedModel?.success_rate?.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-xs text-red-600 font-medium">Total Cost</div>
                  <div className="text-lg font-bold text-red-900">
                    ${selectedModel?.total_cost?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Token Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Token Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prompt Tokens</span>
                  <span className="font-medium text-gray-900">
                    {((selectedModel?.prompt_tokens || 0) / 1000)?.toFixed(1)}K
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion Tokens</span>
                  <span className="font-medium text-gray-900">
                    {((selectedModel?.completion_tokens || 0) / 1000)?.toFixed(1)}K
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="flex h-2 rounded-full">
                    <div 
                      className="bg-blue-500 rounded-l-full"
                      style={{ 
                        width: `${(selectedModel?.prompt_tokens / Math.max(selectedModel?.total_tokens, 1)) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-green-500 rounded-r-full"
                      style={{ 
                        width: `${(selectedModel?.completion_tokens / Math.max(selectedModel?.total_tokens, 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Prompt ({((selectedModel?.prompt_tokens / Math.max(selectedModel?.total_tokens, 1)) * 100)?.toFixed(1)}%)</span>
                  <span>Completion ({((selectedModel?.completion_tokens / Math.max(selectedModel?.total_tokens, 1)) * 100)?.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 font-medium">Average Response Time</div>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedModel?.avg_response_time_ms?.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedModel?.avg_response_time_ms < 500 ? 'Excellent' : 
                     selectedModel?.avg_response_time_ms < 1000 ? 'Good' : 
                     selectedModel?.avg_response_time_ms < 2000 ? 'Average' : 'Slow'}
                  </div>
                </div>
              </div>
            </div>

            {/* Efficiency Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Efficiency Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tokens per Request</span>
                  <span className="text-sm font-medium text-gray-900">{efficiency?.tokensPerRequest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost per 1K Tokens</span>
                  <span className="text-sm font-medium text-gray-900">${efficiency?.costPerToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time per Token</span>
                  <span className="text-sm font-medium text-gray-900">{efficiency?.timePerToken}ms</span>
                </div>
              </div>
            </div>

            {/* Error Analysis */}
            {(selectedModel?.error_count > 0 || selectedModel?.rate_limit_hits > 0) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Issue Analysis</h3>
                <div className="space-y-2">
                  {selectedModel?.error_count > 0 && (
                    <div className="flex items-start p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium text-red-800">API Errors</div>
                        <div className="text-red-700">
                          {selectedModel?.error_count} errors occurred. Check API integration and error handling.
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedModel?.rate_limit_hits > 0 && (
                    <div className="flex items-start p-2 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium text-yellow-800">Rate Limiting</div>
                        <div className="text-yellow-700">
                          {selectedModel?.rate_limit_hits} rate limit hits. Consider implementing request queuing.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance Recommendations */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Recommendations</h3>
              <div className="space-y-2">
                {selectedModel?.avg_response_time_ms > 2000 && (
                  <div className="flex items-start p-2 bg-orange-50 rounded-lg">
                    <Info className="h-4 w-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-orange-800">Optimize Response Time</div>
                      <div className="text-orange-700">
                        Consider reducing prompt length or switching to a faster model for better user experience.
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedModel?.success_rate < 95 && (
                  <div className="flex items-start p-2 bg-yellow-50 rounded-lg">
                    <Info className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-800">Improve Reliability</div>
                      <div className="text-yellow-700">
                        Success rate is below 95%. Review error handling and implement retry mechanisms.
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedModel?.avg_response_time_ms <= 1000 && selectedModel?.success_rate >= 95 && (
                  <div className="flex items-start p-2 bg-green-50 rounded-lg">
                    <Info className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-green-800">Excellent Performance</div>
                      <div className="text-green-700">
                        This model is performing optimally with good speed and reliability.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'costs':
        return (
          <div className="space-y-6">
            {/* Cost Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost Analysis</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium">Total Cost</div>
                  <div className="text-lg font-bold text-blue-900">
                    ${selectedModel?.total_cost?.toFixed(2)}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-green-600 font-medium">Cost per 1K Tokens</div>
                  <div className="text-lg font-bold text-green-900">
                    ${selectedModel?.cost_per_1k_tokens?.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost per Request</span>
                  <span className="font-medium text-gray-900">
                    ${(selectedModel?.total_cost / Math.max(selectedModel?.request_count, 1))?.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prompt Token Cost</span>
                  <span className="font-medium text-gray-900">
                    ${((selectedModel?.prompt_tokens / 1000) * selectedModel?.cost_per_1k_tokens)?.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion Token Cost</span>
                  <span className="font-medium text-gray-900">
                    ${((selectedModel?.completion_tokens / 1000) * selectedModel?.cost_per_1k_tokens)?.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Projection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Monthly Projection</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Based on current usage pattern</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  ${(selectedModel?.total_cost * 30)?.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Estimated monthly cost at current rate
                </div>
              </div>
            </div>

            {/* Cost Optimization */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost Optimization</h3>
              <div className="space-y-2">
                {selectedModel?.cost_per_1k_tokens > 0.01 && (
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800">
                      High Cost per Token
                    </div>
                    <div className="text-sm text-yellow-700">
                      Consider switching to a more cost-effective model for routine tasks.
                    </div>
                  </div>
                )}
                
                {selectedModel?.total_tokens / Math.max(selectedModel?.request_count, 1) > 2000 && (
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">
                      High Token Usage
                    </div>
                    <div className="text-sm text-blue-700">
                      Review prompt efficiency to reduce token consumption per request.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-6">
            {/* Global Recommendations */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Optimization Recommendations</h3>
              <div className="space-y-3">
                {costOptimizationRecommendations?.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    rec?.priority === 'high' ? 'bg-red-50' :
                    rec?.priority === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
                  }`}>
                    <div className={`text-sm font-medium ${
                      rec?.priority === 'high' ? 'text-red-800' :
                      rec?.priority === 'medium' ? 'text-yellow-800' : 'text-blue-800'
                    }`}>
                      {rec?.title}
                    </div>
                    <div className={`text-sm ${
                      rec?.priority === 'high' ? 'text-red-700' :
                      rec?.priority === 'medium' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {rec?.description}
                    </div>
                    {rec?.impact && (
                      <div className="text-sm font-medium text-green-600 mt-1">
                        {rec?.impact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Model-Specific Optimizations */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Model-Specific Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Optimize Token Usage
                </button>
                <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Configure Rate Limiting
                </button>
                <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Export Performance Report
                </button>
              </div>
            </div>

            {/* Tenant Information */}
            {selectedModel?.tenant && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tenant Configuration</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tenant</span>
                    <span className="font-medium text-gray-900">{selectedModel?.tenant?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium text-gray-900 capitalize">{selectedModel?.tenant?.plan}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          Model Insights
        </h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Model Name Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{selectedModel?.model_name}</h3>
        <p className="text-sm text-gray-600 capitalize">{selectedModel?.provider} • {selectedModel?.model_status}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs?.map((tab) => {
            const IconComponent = tab?.icon;
            return (
              <button
                key={tab?.key}
                onClick={() => setActiveTab(tab?.key)}
                className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab?.key
                    ? 'border-purple-500 text-purple-600' :'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <IconComponent className="h-4 w-4 mr-1" />
                  {tab?.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PerformanceInsightsPanel;