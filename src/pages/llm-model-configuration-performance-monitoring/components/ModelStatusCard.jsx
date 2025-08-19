import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelStatusCard = ({ model, onConfigure, onToggle, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'inactive': return 'text-muted-foreground';
      case 'error': return 'text-error';
      case 'maintenance': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'inactive': return 'Circle';
      case 'error': return 'XCircle';
      case 'maintenance': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Cpu" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{model?.name}</h3>
            <p className="text-sm text-muted-foreground">{model?.version}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon(model?.status)} 
            size={20} 
            className={getStatusColor(model?.status)}
          />
          <span className={`text-sm font-medium ${getStatusColor(model?.status)}`}>
            {model?.status?.charAt(0)?.toUpperCase() + model?.status?.slice(1)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Response Time</p>
          <p className="text-lg font-semibold text-card-foreground">{model?.responseTime}ms</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Accuracy</p>
          <p className="text-lg font-semibold text-card-foreground">{model?.accuracy}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Users</p>
          <p className="text-lg font-semibold text-card-foreground">{model?.activeUsers}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Memory Usage</p>
          <p className="text-lg font-semibold text-card-foreground">{model?.memoryUsage}GB</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">CPU Utilization</span>
          <span className="text-sm font-medium text-card-foreground">{model?.cpuUtilization}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getUtilizationColor(model?.cpuUtilization)}`}
            style={{ width: `${model?.cpuUtilization}%` }}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConfigure(model?.id)}
          iconName="Settings"
          iconPosition="left"
        >
          Configure
        </Button>
        <Button
          variant={model?.status === 'active' ? 'destructive' : 'default'}
          size="sm"
          onClick={() => onToggle(model?.id)}
          iconName={model?.status === 'active' ? 'Pause' : 'Play'}
          iconPosition="left"
        >
          {model?.status === 'active' ? 'Stop' : 'Start'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(model?.id)}
          iconName="Eye"
        />
      </div>
    </div>
  );
};

export default ModelStatusCard;