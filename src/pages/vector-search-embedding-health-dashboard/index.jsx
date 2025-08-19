import React, { useState, useEffect } from 'react';
import { Activity, Database, Search, TrendingUp, AlertTriangle, DollarSign, Zap, BarChart3 } from 'lucide-react';
import MetricsSidebar from './components/MetricsSidebar';
import MonitoringCenter from './components/MonitoringCenter';
import DetailPanel from './components/DetailPanel';
import vectorSearchService from '../../services/vectorSearchService';
import integrationHealthService from '../../services/integrationHealthService';

const VectorSearchEmbeddingHealthDashboard = () => {
  const [vectorMetrics, setVectorMetrics] = useState([]);
  const [healthSummary, setHealthSummary] = useState({});
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [integrationHealth, setIntegrationHealth] = useState([]);
  const [performanceTrends, setPerformanceTrends] = useState({});
  const [costAnalysis, setCostAnalysis] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metrics, summary, integrations, trends, costs] = await Promise.all([
        vectorSearchService?.getVectorSearchMetrics(),
        vectorSearchService?.getVectorHealthSummary(null, selectedTimeRange),
        integrationHealthService?.getIntegrationHealth({ integration_type: 'vector' }),
        vectorSearchService?.getVectorPerformanceTrends(null, selectedTimeRange),
        vectorSearchService?.getVectorCostAnalysis(null, selectedTimeRange)
      ]);

      setVectorMetrics(metrics);
      setHealthSummary(summary);
      setIntegrationHealth(integrations);
      setPerformanceTrends(trends);
      setCostAnalysis(costs);
    } catch (err) {
      setError(`Failed to load dashboard data: ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricSelect = (metric) => {
    setSelectedMetric(metric);
  };

  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Vector Search Health Dashboard...</p>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              Vector Search & Embedding Health Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time monitoring of Pinecone integration and semantic search operations
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e?.target?.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Quick Status */}
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('healthy')}`}>
                {healthSummary?.healthyIndexes || 0}/{healthSummary?.totalIndexes || 0} Healthy
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-sm font-medium text-blue-900">Total Vectors</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {healthSummary?.totalVectors?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="ml-2 text-sm font-medium text-green-900">Avg Latency</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {healthSummary?.avgQueryLatency?.toFixed(1) || '0'}ms
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="ml-2 text-sm font-medium text-purple-900">Operations</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-purple-900">
              {healthSummary?.totalOperations?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="ml-2 text-sm font-medium text-yellow-900">Success Rate</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-yellow-900">
              {((healthSummary?.successfulOperations / Math.max(healthSummary?.totalOperations, 1)) * 100)?.toFixed(1) || '0'}%
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <span className="ml-2 text-sm font-medium text-red-900">Processing Time</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-red-900">
              {healthSummary?.avgProcessingTime?.toFixed(0) || '0'}ms
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Total Cost</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${costAnalysis?.totalCost?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>
      {/* Main Dashboard Content */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Sidebar - Metrics */}
        <MetricsSidebar
          vectorMetrics={vectorMetrics}
          integrationHealth={integrationHealth}
          selectedMetric={selectedMetric}
          onMetricSelect={handleMetricSelect}
          healthSummary={healthSummary}
        />

        {/* Center - Monitoring Area */}
        <MonitoringCenter
          vectorMetrics={vectorMetrics}
          performanceTrends={performanceTrends}
          healthSummary={healthSummary}
          timeRange={selectedTimeRange}
          onMetricSelect={handleMetricSelect}
        />

        {/* Right Panel - Detail View */}
        <DetailPanel
          selectedMetric={selectedMetric}
          integrationHealth={integrationHealth}
          costAnalysis={costAnalysis}
          performanceTrends={performanceTrends}
          onClose={() => setSelectedMetric(null)}
        />
      </div>
    </div>
  );
};

export default VectorSearchEmbeddingHealthDashboard;