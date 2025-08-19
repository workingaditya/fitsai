import React, { useState } from 'react';
import { Settings, Database, Globe, Activity, GitBranch, Save, RefreshCw, CheckCircle, AlertTriangle, Info, Edit, Copy } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const TenantConfigPanel = ({ 
  selectedTenant, 
  onProviderSwitch, 
  providerTemplates, 
  activeView 
}) => {
  const [editingProvider, setEditingProvider] = useState(null);
  const [configData, setConfigData] = useState({});
  const [testingProvider, setTestingProvider] = useState(null);

  const handleProviderChange = async (providerType, newProvider) => {
    const template = providerTemplates?.[providerType]?.[newProvider];
    if (!template) return;

    try {
      await onProviderSwitch?.(
        selectedTenant?.id, 
        providerType, 
        newProvider, 
        template?.defaultConfig
      );
      setEditingProvider(null);
      setConfigData({});
    } catch (err) {
      console.error('Failed to switch provider:', err);
    }
  };

  const handleConfigUpdate = (key, value) => {
    setConfigData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveConfig = async () => {
    if (!editingProvider || !selectedTenant) return;

    try {
      await onProviderSwitch?.(
        selectedTenant?.id,
        editingProvider?.type,
        editingProvider?.provider,
        configData
      );
      setEditingProvider(null);
      setConfigData({});
    } catch (err) {
      console.error('Failed to save configuration:', err);
    }
  };

  const testProviderConnection = async (providerType, provider) => {
    setTestingProvider({ type: providerType, provider });
    
    // Simulate testing
    setTimeout(() => {
      setTestingProvider(null);
    }, 2000);
  };

  const getProviderIcon = (providerType) => {
    const iconMap = {
      vector: GitBranch,
      llm: Activity,
      search: Globe,
      collab: Database,
      database: Database
    };
    const Icon = iconMap?.[providerType] || Settings;
    return <Icon className="h-5 w-5" />;
  };

  const getProviderStatus = (providerType, currentProvider) => {
    // This would typically check actual connectivity
    const statuses = ['healthy', 'warning', 'error'];
    const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
    
    return {
      status: randomStatus,
      message: randomStatus === 'healthy' ? 'Connected' : 
               randomStatus === 'warning' ? 'Degraded performance' : 
               'Connection failed'
    };
  };

  const renderProviderCard = (providerType, config) => {
    const currentProvider = config?.provider || 'none';
    const templates = providerTemplates?.[providerType] || {};
    const providerStatus = getProviderStatus(providerType, currentProvider);
    const isEditing = editingProvider?.type === providerType;

    return (
      <div key={providerType} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getProviderIcon(providerType)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {providerType} Provider
              </h3>
              <p className="text-sm text-gray-500">
                Current: {templates?.[currentProvider]?.name || currentProvider}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              providerStatus?.status === 'healthy' ? 'bg-green-100 text-green-800' :
              providerStatus?.status === 'warning'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {providerStatus?.status === 'healthy' ? (
                <CheckCircle className="h-3 w-3" />
              ) : providerStatus?.status === 'warning' ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              <span>{providerStatus?.message}</span>
            </div>
            
            <button
              onClick={() => setEditingProvider({ type: providerType, provider: currentProvider })}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-4">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Provider
              </label>
              <select
                value={editingProvider?.provider}
                onChange={(e) => setEditingProvider(prev => ({ ...prev, provider: e?.target?.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(templates)?.map(([key, template]) => (
                  <option key={key} value={key}>
                    {template?.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {templates?.[editingProvider?.provider]?.description}
              </p>
            </div>

            {/* Configuration Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Configuration
              </label>
              <div className="space-y-3">
                {Object.entries(templates?.[editingProvider?.provider]?.defaultConfig || {})?.map(([key, defaultValue]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 capitalize">
                      {key?.replace(/_/g, ' ')}
                    </label>
                    {typeof defaultValue === 'boolean' ? (
                      <input
                        type="checkbox"
                        checked={configData?.[key] !== undefined ? configData?.[key] : defaultValue}
                        onChange={(e) => handleConfigUpdate(key, e?.target?.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    ) : Array.isArray(defaultValue) ? (
                      <textarea
                        value={JSON.stringify(configData?.[key] !== undefined ? configData?.[key] : defaultValue)}
                        onChange={(e) => {
                          try {
                            handleConfigUpdate(key, JSON.parse(e?.target?.value));
                          } catch (err) {
                            // Keep as string if not valid JSON
                          }
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows={2}
                      />
                    ) : (
                      <input
                        type={typeof defaultValue === 'number' ? 'number' : 'text'}
                        value={configData?.[key] !== undefined ? configData?.[key] : defaultValue}
                        onChange={(e) => handleConfigUpdate(key, 
                          typeof defaultValue === 'number' ? parseFloat(e?.target?.value) : e?.target?.value
                        )}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => testProviderConnection(providerType, editingProvider?.provider)}
                disabled={testingProvider?.type === providerType}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {testingProvider?.type === providerType ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                {testingProvider?.type === providerType ? 'Testing...' : 'Test Connection'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingProvider(null);
                    setConfigData({});
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Current Configuration Display */}
            <div className="bg-gray-50 rounded-md p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Configuration</h4>
              <div className="space-y-1">
                {Object.entries(config)?.filter(([key]) => key !== 'provider')?.map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{key?.replace(/_/g, ' ')}:</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => testProviderConnection(providerType, currentProvider)}
                disabled={testingProvider?.type === providerType}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {testingProvider?.type === providerType ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                Test
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(config, null, 2));
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!selectedTenant) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenant selected</h3>
          <p className="text-sm text-gray-500">
            Select a tenant from the list to view and configure provider settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{selectedTenant?.name}</h2>
          <p className="text-gray-600">Provider Configuration & Management</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            selectedTenant?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {selectedTenant?.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className="text-sm text-gray-500">@{selectedTenant?.slug}</span>
        </div>
      </div>

      {/* Configuration Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Provider Configuration</h3>
            <p className="text-sm text-blue-700 mt-1">
              Configure providers for this tenant. Changes take effect immediately and may impact active services.
            </p>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(selectedTenant?.provider_config || {})?.map(([providerType, config]) =>
          renderProviderCard(providerType, config)
        )}
      </div>

      {/* Usage and Billing Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">API Calls</span>
              <span className="text-sm font-medium text-gray-900">
                {(selectedTenant?.resource_usage?.api_calls || 0)?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Storage Used</span>
              <span className="text-sm font-medium text-gray-900">
                {selectedTenant?.resource_usage?.storage_gb || 0} GB
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Active Users</span>
              <span className="text-sm font-medium text-gray-900">
                {selectedTenant?.resource_usage?.users || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Plan</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {selectedTenant?.plan}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Monthly Cost</span>
              <span className="text-sm font-medium text-gray-900">
                ${selectedTenant?.billing_data?.monthly_cost || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Usage Cost</span>
              <span className="text-sm font-medium text-gray-900">
                ${selectedTenant?.billing_data?.usage_cost || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantConfigPanel;