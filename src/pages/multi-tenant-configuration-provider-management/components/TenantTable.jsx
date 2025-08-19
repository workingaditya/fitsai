import React, { useState } from 'react';
import { CheckCircle, XCircle, Settings, Users, Database, Globe, GitBranch, Activity, Edit, Trash2, Eye } from 'lucide-react';
import Icon from '../../../components/AppIcon';



const TenantTable = ({ 
  tenants = [], 
  selectedTenant, 
  onTenantSelect, 
  onBulkOperation, 
  activeView, 
  providerConfigs = [] 
}) => {
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleSelectTenant = (tenantId, checked) => {
    if (checked) {
      setSelectedTenants(prev => [...prev, tenantId]);
    } else {
      setSelectedTenants(prev => prev?.filter(id => id !== tenantId));
    }
    setShowBulkActions(selectedTenants?.length > 0 || checked);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTenants(tenants?.map(t => t?.id) || []);
    } else {
      setSelectedTenants([]);
    }
    setShowBulkActions(checked);
  };

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: 'bg-blue-100 text-blue-800',
      professional: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-green-100 text-green-800'
    };
    return planConfig?.[plan] || planConfig?.basic;
  };

  const getProviderIcon = (providerType) => {
    const iconMap = {
      vector: GitBranch,
      llm: Activity,
      search: Globe,
      database: Database,
      default: Settings
    };
    const Icon = iconMap?.[providerType] || iconMap?.default;
    return <Icon className="h-4 w-4" />;
  };

  const getTenantProviders = (tenant) => {
    const config = tenant?.provider_config || {};
    return Object.entries(config)?.map(([type, settings]) => ({
      type,
      provider: settings?.provider || 'none'
    })) || [];
  };

  const getUsageColor = (usage, limit) => {
    const percentage = (usage / limit) * 100;
    if (percentage > 90) return 'text-red-600';
    if (percentage > 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (!tenants?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Users className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
        <p className="text-sm text-gray-500 text-center">
          Create your first tenant to get started with multi-tenant configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeView === 'tenants' ? 'Tenants' : 
             activeView === 'configs'? 'Provider Configurations' : 'Usage Analytics'}
          </h2>
          {selectedTenants?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedTenants?.length} selected
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onBulkOperation?.('activate', selectedTenants)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Activate
                </button>
                <button
                  onClick={() => onBulkOperation?.('deactivate', selectedTenants)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Deactivate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Table Content */}
      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedTenants?.length === tenants?.length}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan & Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Providers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants?.map((tenant) => {
              const isSelected = selectedTenant?.id === tenant?.id;
              const isChecked = selectedTenants?.includes(tenant?.id);
              const providers = getTenantProviders(tenant);
              const usage = tenant?.resource_usage || {};
              
              return (
                <tr
                  key={tenant?.id}
                  onClick={() => onTenantSelect?.(tenant)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        e?.stopPropagation();
                        handleSelectTenant(tenant?.id, e?.target?.checked);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant?.name}</div>
                        <div className="text-sm text-gray-500">@{tenant?.slug}</div>
                        <div className="text-xs text-gray-400">{tenant?.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadge(tenant?.plan)}`}>
                        {tenant?.plan}
                      </span>
                      <div className="flex items-center">
                        {tenant?.is_active ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-xs ${tenant?.is_active ? 'text-green-700' : 'text-red-700'}`}>
                          {tenant?.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {providers?.slice(0, 3)?.map((provider) => (
                        <div
                          key={provider?.type}
                          className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1"
                          title={`${provider?.type}: ${provider?.provider}`}
                        >
                          {getProviderIcon(provider?.type)}
                          <span className="text-xs text-gray-700 capitalize">
                            {provider?.provider}
                          </span>
                        </div>
                      ))}
                      {providers?.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{providers?.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">API:</span>
                        <span className={getUsageColor(usage?.api_calls || 0, 50000)}>
                          {(usage?.api_calls || 0)?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Storage:</span>
                        <span className={getUsageColor(usage?.storage_gb || 0, 1000)}>
                          {usage?.storage_gb || 0} GB
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Users:</span>
                        <span className="text-gray-900">{usage?.users || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          onTenantSelect?.(tenant);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          // Handle edit
                        }}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e?.stopPropagation();
                          // Handle delete
                        }}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>
            Showing {tenants?.length} tenants
          </div>
          <div className="flex items-center space-x-4">
            <span>Total Resource Usage:</span>
            <div className="flex items-center space-x-3">
              <span className="text-blue-600">
                {tenants?.reduce((sum, t) => sum + (t?.resource_usage?.api_calls || 0), 0)?.toLocaleString()} API calls
              </span>
              <span className="text-green-600">
                {tenants?.reduce((sum, t) => sum + (t?.resource_usage?.storage_gb || 0), 0)} GB storage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantTable;