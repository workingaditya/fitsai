import React from 'react';
import { Server, Database, Globe, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Icon from '../../../components/AppIcon';


const ServiceStatusGrid = ({ 
  services = [], 
  onServiceSelect, 
  selectedService, 
  onHealthCheck, 
  getStatusIcon, 
  getEnvironmentBadge 
}) => {
  const getServiceIcon = (serviceType) => {
    const iconMap = {
      api: Server,
      database: Database,
      websocket: Globe,
      queue: Activity,
      default: Server
    };
    const Icon = iconMap?.[serviceType] || iconMap?.default;
    return <Icon className="h-6 w-6" />;
  };

  const getServiceTypeColor = (serviceType) => {
    const colorMap = {
      api: 'bg-blue-100 text-blue-800',
      database: 'bg-green-100 text-green-800',
      websocket: 'bg-purple-100 text-purple-800',
      queue: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colorMap?.[serviceType] || colorMap?.default;
  };

  const getHealthScore = (service) => {
    if (!service) return 0;
    
    // Calculate based on status and other factors
    const statusScores = {
      healthy: 100,
      degraded: 60,
      down: 0,
      maintenance: 80
    };
    
    return statusScores?.[service?.status] || 0;
  };

  if (!services?.length) {
    return (
      <div className="text-center py-8">
        <Server className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Backend services will appear here once configured.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services?.map((service) => {
        const healthScore = getHealthScore(service);
        const isSelected = selectedService?.id === service?.id;
        
        return (
          <div
            key={service?.id}
            onClick={() => onServiceSelect?.(service)}
            className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected 
                ? 'border-blue-500 shadow-md ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Service Header */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getServiceTypeColor(service?.service_type)}`}>
                    {getServiceIcon(service?.service_type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{service?.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{service?.service_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(service?.status)}
                </div>
              </div>

              {/* Status and Environment */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    service?.status === 'healthy' ? 'bg-green-100 text-green-800' :
                    service?.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                    service?.status === 'down'? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {service?.status}
                  </span>
                </div>
                {getEnvironmentBadge(service?.environment)}
              </div>

              {/* Version and URL */}
              <div className="space-y-2 mb-4">
                {service?.version && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Version:</span>
                    <span className="text-gray-900 font-mono">{service?.version}</span>
                  </div>
                )}
                {service?.endpoint_url && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Endpoint:</span>
                    <span className="text-gray-900 font-mono text-xs truncate ml-2" title={service?.endpoint_url}>
                      {service?.endpoint_url?.replace('https://', '')?.replace('http://', '')}
                    </span>
                  </div>
                )}
              </div>

              {/* Health Score Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Health Score</span>
                  <span className="text-gray-900 font-medium">{healthScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      healthScore >= 80 ? 'bg-green-500' :
                      healthScore >= 60 ? 'bg-yellow-500': 'bg-red-500'
                    }`}
                    style={{ width: `${healthScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Last Health Check */}
              {service?.last_health_check && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last checked:</span>
                  <span>{formatDistanceToNow(new Date(service.last_health_check), { addSuffix: true })}</span>
                </div>
              )}

              {/* Configuration Indicator */}
              {service?.configuration && Object.keys(service?.configuration)?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span>{Object.keys(service?.configuration)?.length} config items</span>
                  </div>
                </div>
              )}
            </div>
            {/* Quick Actions */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e?.stopPropagation();
                    onHealthCheck?.(service?.id);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Run Health Check
                </button>
                <div className="text-xs text-gray-400">
                  Click to configure
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceStatusGrid;