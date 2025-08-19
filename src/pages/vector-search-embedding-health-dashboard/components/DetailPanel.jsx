import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, AlertTriangle, Info, Settings, Activity, Database } from 'lucide-react';

const DetailPanel = ({ selectedMetric, integrationHealth, costAnalysis, performanceTrends, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedMetric) {
    return (
      <div className="w-96 bg-gray-50 border-l border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Database className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Select a vector metric to view details</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Info },
    { key: 'performance', label: 'Performance', icon: TrendingUp },
    { key: 'costs', label: 'Costs', icon: DollarSign },
    { key: 'config', label: 'Config', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Index Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Index Name</span>
                  <span className="text-sm font-medium text-gray-900">{selectedMetric?.index_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Namespace</span>
                  <span className="text-sm font-medium text-gray-900">{selectedMetric?.namespace || 'default'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dimensions</span>
                  <span className="text-sm font-medium text-gray-900">{selectedMetric?.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Vectors</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedMetric?.total_vectors?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedMetric?.index_status === 'healthy' ?'bg-green-100 text-green-800'
                      : selectedMetric?.index_status === 'degraded' ?'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'
                  }`}>
                    {selectedMetric?.index_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Health Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Index Fullness</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedMetric?.fullness_percentage?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedMetric?.fullness_percentage > 80 
                          ? 'bg-red-500' 
                          : selectedMetric?.fullness_percentage > 60 
                          ? 'bg-yellow-500' :'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(selectedMetric?.fullness_percentage || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium">Query Latency</div>
                    <div className="text-lg font-bold text-blue-900">
                      {selectedMetric?.query_latency_ms?.toFixed(1)}ms
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-xs text-green-600 font-medium">Similarity Score</div>
                    <div className="text-lg font-bold text-green-900">
                      {selectedMetric?.similarity_threshold?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Updates</h3>
              <div className="text-sm text-gray-600">
                Last updated: {new Date(selectedMetric?.last_updated)?.toLocaleString()}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Overview</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 font-medium">Average Query Time</div>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedMetric?.query_latency_ms?.toFixed(1)}ms
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedMetric?.query_latency_ms < 100 ? 'Excellent' : 
                     selectedMetric?.query_latency_ms < 200 ? 'Good' : 'Needs Optimization'}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Recommendations */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Optimization Recommendations</h3>
              <div className="space-y-2">
                {selectedMetric?.fullness_percentage > 80 && (
                  <div className="flex items-start p-2 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-800">High Index Utilization</div>
                      <div className="text-yellow-700">
                        Consider scaling up your vector index capacity to maintain optimal performance.
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedMetric?.query_latency_ms > 200 && (
                  <div className="flex items-start p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-red-800">High Query Latency</div>
                      <div className="text-red-700">
                        Query latency is above optimal range. Check index configuration and network connectivity.
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedMetric?.query_latency_ms <= 100 && selectedMetric?.fullness_percentage <= 80 && (
                  <div className="flex items-start p-2 bg-green-50 rounded-lg">
                    <Info className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-green-800">Optimal Performance</div>
                      <div className="text-green-700">
                        Your vector index is performing within optimal parameters.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            {selectedMetric?.metadata && Object.keys(selectedMetric?.metadata)?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Details</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedMetric?.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
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
                  <div className="text-xs text-blue-600 font-medium">Cost per Query</div>
                  <div className="text-lg font-bold text-blue-900">
                    ${selectedMetric?.cost_per_query?.toFixed(6)}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs text-green-600 font-medium">Monthly Projection</div>
                  <div className="text-lg font-bold text-green-900">
                    ${costAnalysis?.projectedMonthlyCost?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Storage Cost</span>
                  <span className="font-medium text-gray-900">
                    ${(selectedMetric?.total_vectors * 0.000001)?.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Query Cost</span>
                  <span className="font-medium text-gray-900">
                    ${selectedMetric?.cost_per_query?.toFixed(6)}/query
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Optimization */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Optimization Opportunities</h3>
              <div className="space-y-2">
                {costAnalysis?.costOptimizationOpportunities?.map((opportunity, index) => (
                  <div key={index} className="p-2 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800">
                      {opportunity?.type}
                    </div>
                    <div className="text-sm text-yellow-700">
                      {opportunity?.recommendation}
                    </div>
                    {opportunity?.potential_savings && (
                      <div className="text-sm font-medium text-green-600 mt-1">
                        Potential savings: ${opportunity?.potential_savings?.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'config':
        return (
          <div className="space-y-6">
            {/* Configuration */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Index Configuration</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vector Dimensions</span>
                  <span className="text-sm font-medium text-gray-900">{selectedMetric?.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Similarity Threshold</span>
                  <span className="text-sm font-medium text-gray-900">{selectedMetric?.similarity_threshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tenant</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedMetric?.tenant?.name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Information */}
            {selectedMetric?.service && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Service Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service Name</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMetric?.service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service Type</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMetric?.service?.service_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service Status</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedMetric?.service?.status === 'healthy' ?'bg-green-100 text-green-800' :'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedMetric?.service?.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Configuration Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Configuration Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Update Configuration
                </button>
                <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Reset to Defaults
                </button>
              </div>
            </div>
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
          <Database className="h-5 w-5 text-blue-600 mr-2" />
          Vector Details
        </h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Index Name Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{selectedMetric?.index_name}</h3>
        <p className="text-sm text-gray-600">{selectedMetric?.namespace || 'default'} namespace</p>
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
                    ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
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

export default DetailPanel;