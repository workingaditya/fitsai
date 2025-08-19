import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceMonitoringPanel = ({ performanceData, alerts, onRefresh, onViewAlert }) => {
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const responseTimeData = [
    { time: '00:00', mistral: 120, llama: 150, codellama: 180, vicuna: 140 },
    { time: '04:00', mistral: 115, llama: 145, codellama: 175, vicuna: 135 },
    { time: '08:00', mistral: 130, llama: 160, codellama: 190, vicuna: 150 },
    { time: '12:00', mistral: 125, llama: 155, codellama: 185, vicuna: 145 },
    { time: '16:00', mistral: 135, llama: 165, codellama: 195, vicuna: 155 },
    { time: '20:00', mistral: 118, llama: 148, codellama: 178, vicuna: 138 }
  ];

  const resourceUsageData = [
    { model: 'Mistral', cpu: 65, memory: 78, gpu: 45 },
    { model: 'Llama', cpu: 72, memory: 85, gpu: 52 },
    { model: 'Code-Llama', cpu: 68, memory: 82, gpu: 48 },
    { model: 'Vicuna', cpu: 70, memory: 80, gpu: 50 }
  ];

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-card-foreground flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Performance Monitor
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          iconName="RefreshCw"
          className="text-muted-foreground hover:text-card-foreground"
        />
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto scrollbar-thin">
        {/* Real-time Alerts */}
        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
            <Icon name="Bell" size={16} className="mr-2" />
            Active Alerts ({alerts?.length})
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
            {alerts?.map((alert) => (
              <div
                key={alert?.id}
                className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => onViewAlert(alert?.id)}
              >
                <Icon 
                  name={getAlertIcon(alert?.severity)} 
                  size={16} 
                  className={getAlertColor(alert?.severity)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {alert?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {alert?.model} • {alert?.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time Chart */}
        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
            <Icon name="Clock" size={16} className="mr-2" />
            Response Time Trends
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mistral" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  name="Mistral"
                />
                <Line 
                  type="monotone" 
                  dataKey="llama" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  name="Llama"
                />
                <Line 
                  type="monotone" 
                  dataKey="codellama" 
                  stroke="var(--color-warning)" 
                  strokeWidth={2}
                  name="Code-Llama"
                />
                <Line 
                  type="monotone" 
                  dataKey="vicuna" 
                  stroke="var(--color-success)" 
                  strokeWidth={2}
                  name="Vicuna"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Usage */}
        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
            <Icon name="HardDrive" size={16} className="mr-2" />
            Resource Utilization
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="model" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="cpu" fill="var(--color-primary)" name="CPU %" />
                <Bar dataKey="memory" fill="var(--color-accent)" name="Memory %" />
                <Bar dataKey="gpu" fill="var(--color-success)" name="GPU %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Indicators */}
        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
            <Icon name="Shield" size={16} className="mr-2" />
            System Health
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-muted-foreground" />
                <span className="text-sm">Database Connection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-success">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Wifi" size={16} className="text-muted-foreground" />
                <span className="text-sm">API Gateway</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-success">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={16} className="text-muted-foreground" />
                <span className="text-sm">Security Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-warning">Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoringPanel;