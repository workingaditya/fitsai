import React from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

export default function StatusIndicator({ status, label, details }) {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'operational': case'online': case'healthy':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-400',
          icon: CheckCircle
        };
      case 'degraded': case'busy': case'warning':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-400',
          icon: AlertCircle
        };
      case 'down':
      case 'offline': case'error':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-400',
          icon: XCircle
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-400',
          icon: Clock
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config?.icon;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 ${config?.bgColor} rounded-full`}></div>
        <span className="text-xs text-gray-500">
          {details || status?.charAt(0)?.toUpperCase() + status?.slice(1)}
        </span>
      </div>
    </div>
  );
}