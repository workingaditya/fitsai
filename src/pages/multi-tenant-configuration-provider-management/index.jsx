import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Plus, Search, RefreshCw, AlertCircle, X } from 'lucide-react';
import TenantTable from './components/TenantTable';
import TenantConfigPanel from './components/TenantConfigPanel';
import TenantDetailPanel from './components/TenantDetailPanel';
import { tenantManagementService } from '../../services/tenantManagementService';

const MultiTenantConfigurationProviderManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [providerConfigs, setProviderConfigs] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [activeView, setActiveView] = useState('tenants'); // tenants, configs, analytics
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    plan: '',
    region: '',
    is_active: true
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);

  // Load initial data
  useEffect(() => {
    loadTenantData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const channel = tenantManagementService?.subscribeToTenantUpdates((update) => {
      if (update?.type === 'tenant_update') {
        loadTenants();
      } else if (update?.type === 'config_update') {
        loadProviderConfigs();
      }
    });

    return () => {
      tenantManagementService?.unsubscribe(channel);
    };
  }, []);

  const loadTenantData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTenants(),
        loadProviderConfigs()
      ]);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load tenant data');
    } finally {
      setLoading(false);
    }
  };

  const loadTenants = async () => {
    try {
      const data = await tenantManagementService?.getTenants(filterOptions);
      setTenants(data);
      if (!selectedTenant && data?.length > 0) {
        setSelectedTenant(data?.[0]);
      }
    } catch (err) {
      throw new Error(`Failed to load tenants: ${err?.message}`);
    }
  };

  const loadProviderConfigs = async () => {
    try {
      const data = await tenantManagementService?.getProviderConfigs();
      setProviderConfigs(data);
    } catch (err) {
      throw new Error(`Failed to load provider configs: ${err?.message}`);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadTenantData();
    } catch (err) {
      setError(err?.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleTenantSelect = async (tenant) => {
    try {
      const fullTenantData = await tenantManagementService?.getTenantById(tenant?.id);
      setSelectedTenant(fullTenantData);
    } catch (err) {
      setError(`Failed to load tenant details: ${err?.message}`);
    }
  };

  const handleProviderSwitch = async (tenantId, providerType, newProvider, config) => {
    try {
      await tenantManagementService?.switchProvider(tenantId, providerType, newProvider, config);
      await loadTenantData();
      if (selectedTenant?.id === tenantId) {
        const updatedTenant = await tenantManagementService?.getTenantById(tenantId);
        setSelectedTenant(updatedTenant);
      }
    } catch (err) {
      setError(`Failed to switch provider: ${err?.message}`);
    }
  };

  const handleBulkOperation = async (operation, tenantIds, data = {}) => {
    try {
      switch (operation) {
        case 'activate':
          await tenantManagementService?.bulkUpdateTenants(tenantIds, { is_active: true });
          break;
        case 'deactivate':
          await tenantManagementService?.bulkUpdateTenants(tenantIds, { is_active: false });
          break;
        case 'update_plan':
          await tenantManagementService?.bulkUpdateTenants(tenantIds, { plan: data?.plan });
          break;
        default:
          throw new Error('Unknown bulk operation');
      }
      await loadTenants();
    } catch (err) {
      setError(`Bulk operation failed: ${err?.message}`);
    }
  };

  const filteredTenants = tenants?.filter(tenant => {
    const matchesSearch = !searchTerm || 
      tenant?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      tenant?.slug?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesFilters = 
      (!filterOptions?.plan || tenant?.plan === filterOptions?.plan) &&
      (!filterOptions?.region || tenant?.region === filterOptions?.region) &&
      (filterOptions?.is_active === undefined || tenant?.is_active === filterOptions?.is_active);

    return matchesSearch && matchesFilters;
  }) || [];

  const getProviderTemplates = () => tenantManagementService?.getProviderTemplates();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading Tenant Configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Multi-Tenant Configuration & Provider Management - FITS AI</title>
        <meta name="description" content="Tenant administration interface for FITS AI multi-tenant architecture" />
      </Helmet>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
              </div>
              <span className="text-sm text-gray-500">Multi-Tenant Configuration & Provider Management</span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg">
                <button
                  onClick={() => setActiveView('tenants')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'tenants' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tenants
                </button>
                <button
                  onClick={() => setActiveView('configs')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'configs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Provider Configs
                </button>
                <button
                  onClick={() => setActiveView('analytics')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Analytics
                </button>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={() => setShowAddTenant(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={filterOptions?.plan || ''}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, plan: e?.target?.value }))}
                className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="">All Plans</option>
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>

              <select
                value={filterOptions?.region || ''}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, region: e?.target?.value }))}
                className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="">All Regions</option>
                <option value="us-east-1">US East 1</option>
                <option value="us-west-2">US West 2</option>
                <option value="eu-west-1">EU West 1</option>
                <option value="ap-southeast-1">AP Southeast 1</option>
              </select>

              <select
                value={filterOptions?.is_active?.toString() || 'true'}
                onChange={(e) => setFilterOptions(prev => ({ 
                  ...prev, 
                  is_active: e?.target?.value === 'true' ? true : e?.target?.value === 'false' ? false : undefined 
                }))}
                className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
                <option value="">All Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Statistics Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Active Tenants:</span>
              <span className="text-sm font-semibold text-gray-900">
                {tenants?.filter(t => t?.is_active)?.length || 0}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Total Tenants:</span>
              <span className="text-sm font-semibold text-gray-900">{tenants?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Provider Configs:</span>
              <span className="text-sm font-semibold text-gray-900">{providerConfigs?.length || 0}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredTenants?.length} of {tenants?.length} tenants
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Main Tenant Table - 40% */}
        <div className="w-2/5 bg-white shadow-sm min-h-screen">
          <TenantTable
            tenants={filteredTenants}
            selectedTenant={selectedTenant}
            onTenantSelect={handleTenantSelect}
            onBulkOperation={handleBulkOperation}
            activeView={activeView}
            providerConfigs={providerConfigs}
          />
        </div>

        {/* Configuration Panel - 40% */}
        <div className="flex-1 px-6 py-6">
          <TenantConfigPanel
            selectedTenant={selectedTenant}
            onProviderSwitch={handleProviderSwitch}
            providerTemplates={getProviderTemplates()}
            activeView={activeView}
          />
        </div>

        {/* Detail Panel - 20% */}
        <div className="w-1/5 bg-white shadow-sm min-h-screen border-l border-gray-200">
          <TenantDetailPanel
            selectedTenant={selectedTenant}
            tenants={tenants}
            providerConfigs={providerConfigs}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiTenantConfigurationProviderManagement;