import React from 'react';
import { Server, Database, Globe, Settings, Shield, Activity, GitBranch } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const NavigationSidebar = ({ 
  activeTab, 
  onTabChange, 
  services = [], 
  selectedService, 
  onServiceSelect 
}) => {
  const navigationItems = [
    { 
      id: 'services', 
      label: 'Backend Services', 
      icon: Server,
      description: 'Service status and management',
      count: services?.length || 0
    },
    { 
      id: 'database', 
      label: 'Database Management', 
      icon: Database,
      description: 'PostgreSQL and pgvector',
      count: services?.filter(s => s?.service_type === 'database')?.length || 0
    },
    { 
      id: 'vectors', 
      label: 'Vector Stores', 
      icon: GitBranch,
      description: 'Vector database adapters',
      status: 'pgvector'
    },
    { 
      id: 'apis', 
      label: 'API Endpoints', 
      icon: Globe,
      description: 'REST API management',
      count: services?.filter(s => s?.service_type === 'api')?.length || 0
    },
    { 
      id: 'auth', 
      label: 'Authentication', 
      icon: Shield,
      description: 'JWT and security policies',
      status: 'active'
    },
    { 
      id: 'monitoring', 
      label: 'Monitoring', 
      icon: Activity,
      description: 'Real-time system metrics',
      status: 'live'
    },
    { 
      id: 'config', 
      label: 'Configuration', 
      icon: Settings,
      description: 'System settings and CORS',
      status: 'configured'
    }
  ];

  const getServiceStatusColor = (status) => {
    const colors = {
      healthy: 'bg-green-500',
      degraded: 'bg-yellow-500',
      down: 'bg-red-500',
      maintenance: 'bg-blue-500'
    };
    return colors?.[status] || 'bg-gray-400';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">System Components</h2>
        <p className="text-sm text-gray-500 mt-1">Backend architecture overview</p>
      </div>
      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigationItems?.map((item) => {
            const Icon = item?.icon;
            const isActive = activeTab === item?.id;
            
            return (
              <button
                key={item?.id}
                onClick={() => onTabChange?.(item?.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-900' :'hover:bg-gray-50 border-2 border-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-md ${
                    isActive ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      isActive ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {item?.label}
                      </p>
                      {item?.count !== undefined && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item?.count}
                        </span>
                      )}
                      {item?.status && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item?.status === 'active' || item?.status === 'live' || item?.status === 'configured' ?'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
                        }`}>
                          {item?.status}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {item?.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
      {/* Service Quick List */}
      {services?.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Active Services</h3>
            <div className="space-y-2">
              {services?.slice(0, 4)?.map((service) => (
                <button
                  key={service?.id}
                  onClick={() => onServiceSelect?.(service)}
                  className={`w-full text-left p-2 rounded-md transition-all duration-200 ${
                    selectedService?.id === service?.id
                      ? 'bg-blue-50 border border-blue-200' :'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getServiceStatusColor(service?.status)}`}></div>
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {service?.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {service?.service_type} • {service?.environment}
                  </div>
                </button>
              ))}
              {services?.length > 4 && (
                <button
                  onClick={() => onTabChange?.('services')}
                  className="w-full text-left p-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  View all {services?.length} services →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* System Status Summary */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500 mb-2">System Overview</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">
              {services?.filter(s => s?.status === 'healthy')?.length || 0}
            </div>
            <div className="text-xs text-green-700">Healthy</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-lg font-bold text-gray-600">{services?.length || 0}</div>
            <div className="text-xs text-gray-700">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;