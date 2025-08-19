import React from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign, Users, Database, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';


const TenantDetailPanel = ({ selectedTenant, tenants = [], providerConfigs = [] }) => {
  const getTenantStats = () => {
    if (!selectedTenant) return null;

    const usage = selectedTenant?.resource_usage || {};
    const billing = selectedTenant?.billing_data || {};
    
    return {
      apiCalls: usage?.api_calls || 0,
      storageGB: usage?.storage_gb || 0,
      activeUsers: usage?.users || 0,
      monthlyCost: billing?.monthly_cost || 0,
      usageCost: billing?.usage_cost || 0
    };
  };

  const getSystemOverview = () => {
    return {
      totalTenants: tenants?.length || 0,
      activeTenants: tenants?.filter(t => t?.is_active)?.length || 0,
      totalConfigs: providerConfigs?.length || 0,
      totalApiCalls: tenants?.reduce((sum, t) => sum + (t?.resource_usage?.api_calls || 0), 0) || 0,
      totalStorage: tenants?.reduce((sum, t) => sum + (t?.resource_usage?.storage_gb || 0), 0) || 0,
      totalRevenue: tenants?.reduce((sum, t) => sum + (t?.billing_data?.monthly_cost || 0), 0) || 0
    };
  };

  const getRecentActivity = () => {
    // Mock recent activity - in real app this would come from audit logs
    return [
      {
        id: 1,
        action: 'Provider switched to Pinecone',
        tenant: 'FITS AI Production',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: 'config'
      },
      {
        id: 2,
        action: 'Usage limit increased',
        tenant: 'Demo Environment',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        type: 'billing'
      },
      {
        id: 3,
        action: 'New tenant created',
        tenant: 'Enterprise Client',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        type: 'tenant'
      },
      {
        id: 4,
        action: 'Vector index updated',
        tenant: 'FITS AI Production',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        type: 'system'
      }
    ];
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      config: Database,
      billing: DollarSign,
      tenant: Users,
      system: Activity
    };
    const Icon = iconMap?.[type] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      config: 'text-blue-600',
      billing: 'text-green-600',
      tenant: 'text-purple-600',
      system: 'text-orange-600'
    };
    return colorMap?.[type] || 'text-gray-600';
  };

  const stats = getTenantStats();
  const systemOverview = getSystemOverview();
  const recentActivity = getRecentActivity();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Details & Monitoring</h2>
        <p className="text-sm text-gray-500 mt-1">Real-time insights and analytics</p>
      </div>
      {/* Selected Tenant Stats */}
      {selectedTenant && stats && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">{selectedTenant?.name}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-500">API Calls</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {stats?.apiCalls?.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-purple-500" />
                <span className="text-xs text-gray-500">Storage</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{stats?.storageGB} GB</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-gray-500">Users</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{stats?.activeUsers}</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -3%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-500">Monthly Cost</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">${stats?.monthlyCost}</div>
                <div className="text-xs text-gray-500">+${stats?.usageCost} usage</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* System Overview */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">System Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{systemOverview?.activeTenants}</div>
            <div className="text-xs text-blue-700">Active Tenants</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{systemOverview?.totalConfigs}</div>
            <div className="text-xs text-green-700">Configurations</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm font-bold text-purple-600">
              {(systemOverview?.totalApiCalls / 1000)?.toFixed(0)}K
            </div>
            <div className="text-xs text-purple-700">API Calls</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-sm font-bold text-orange-600">
              ${systemOverview?.totalRevenue?.toLocaleString()}
            </div>
            <div className="text-xs text-orange-700">Revenue</div>
          </div>
        </div>
      </div>
      {/* Real-time Alerts */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Active Alerts</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <div>
              <div className="text-xs font-medium text-yellow-800">High Usage</div>
              <div className="text-xs text-yellow-700">Demo tenant at 95% API limit</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-xs font-medium text-green-800">All Systems Healthy</div>
              <div className="text-xs text-green-700">No critical issues detected</div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3">
                <div className={`p-1 rounded-full bg-gray-100 ${getActivityColor(activity?.type)}`}>
                  {getActivityIcon(activity?.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">
                    {activity?.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity?.tenant}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(activity?.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quick Stats Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Uptime</span>
            <span className="text-green-600 font-medium">99.9%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Avg Response</span>
            <span className="text-gray-900 font-medium">125ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Success Rate</span>
            <span className="text-green-600 font-medium">99.2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Last Updated</span>
            <span className="text-gray-900 font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailPanel;