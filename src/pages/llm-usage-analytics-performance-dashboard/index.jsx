import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, DollarSign, Users, Zap, AlertTriangle, BarChart3 } from 'lucide-react';
import ModelFilterSidebar from './components/ModelFilterSidebar';
import AnalyticsCenter from './components/AnalyticsCenter';
import PerformanceInsightsPanel from './components/PerformanceInsightsPanel';
import llmAnalyticsService from '../../services/llmAnalyticsService';
import integrationHealthService from '../../services/integrationHealthService';

const LLMUsageAnalyticsPerformanceDashboard = () => {
  const [llmMetrics, setLlmMetrics] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState({});
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [tokenAnalysis, setTokenAnalysis] = useState({});
  const [costOptimizationRecommendations, setCostOptimizationRecommendations] = useState([]);
  const [integrationHealth, setIntegrationHealth] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange, selectedProvider]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (selectedProvider !== 'all') {
        filters.provider = selectedProvider;
      }

      const [metrics, summary, conversationData, tokenData, recommendations, integrations] = await Promise.all([
        llmAnalyticsService?.getLLMUsageMetrics(filters),
        llmAnalyticsService?.getLLMPerformanceSummary(null, selectedTimeRange),
        llmAnalyticsService?.getLLMConversations({ timeRange: selectedTimeRange }),
        llmAnalyticsService?.getTokenUsageAnalysis(null, selectedTimeRange),
        llmAnalyticsService?.getCostOptimizationRecommendations(null),
        integrationHealthService?.getIntegrationHealth({ integration_type: 'llm' })
      ]);

      setLlmMetrics(metrics);
      setPerformanceSummary(summary);
      setConversations(conversationData);
      setTokenAnalysis(tokenData);
      setCostOptimizationRecommendations(recommendations);
      setIntegrationHealth(integrations);
    } catch (err) {
      setError(`Failed to load dashboard data: ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
  };

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'rate_limited': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000)?.toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000)?.toFixed(1) + 'K';
    return num?.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LLM Usage Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="h-8 w-8 text-purple-600 mr-3" />
              LLM Usage Analytics & Performance Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Multi-LLM usage patterns, performance metrics, and cost optimization across enterprise deployment
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => handleProviderChange(e?.target?.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Providers</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Gemini</option>
              <option value="local">Local Models</option>
            </select>

            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e?.target?.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Quick Status */}
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getModelStatusColor('available')}`}>
                {performanceSummary?.availableModels || 0}/{performanceSummary?.totalModels || 0} Available
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="ml-2 text-sm font-medium text-purple-900">Total Requests</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-purple-900">
              {formatNumber(performanceSummary?.totalRequests || 0)}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-sm font-medium text-blue-900">Total Tokens</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {formatNumber(performanceSummary?.totalTokens || 0)}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="ml-2 text-sm font-medium text-green-900">Avg Response</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {performanceSummary?.avgResponseTime?.toFixed(0) || '0'}ms
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="ml-2 text-sm font-medium text-yellow-900">Success Rate</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-yellow-900">
              {performanceSummary?.avgSuccessRate?.toFixed(1) || '0'}%
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-red-600" />
              <span className="ml-2 text-sm font-medium text-red-900">Total Cost</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-red-900">
              ${performanceSummary?.totalCost?.toFixed(2) || '0.00'}
            </p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-indigo-600" />
              <span className="ml-2 text-sm font-medium text-indigo-900">Conversations</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-indigo-900">
              {formatNumber(performanceSummary?.totalConversations || 0)}
            </p>
          </div>
        </div>
      </div>
      {/* Main Dashboard Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Sidebar - Model Filters */}
        <ModelFilterSidebar
          llmMetrics={llmMetrics}
          integrationHealth={integrationHealth}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
          performanceSummary={performanceSummary}
          selectedProvider={selectedProvider}
          onProviderChange={handleProviderChange}
        />

        {/* Center - Analytics Area */}
        <AnalyticsCenter
          llmMetrics={llmMetrics}
          performanceSummary={performanceSummary}
          conversations={conversations}
          tokenAnalysis={tokenAnalysis}
          timeRange={selectedTimeRange}
          selectedProvider={selectedProvider}
          onModelSelect={handleModelSelect}
        />

        {/* Right Panel - Performance Insights */}
        <PerformanceInsightsPanel
          selectedModel={selectedModel}
          costOptimizationRecommendations={costOptimizationRecommendations}
          tokenAnalysis={tokenAnalysis}
          integrationHealth={integrationHealth}
          performanceSummary={performanceSummary}
          onClose={() => setSelectedModel(null)}
        />
      </div>
    </div>
  );
};

export default LLMUsageAnalyticsPerformanceDashboard;