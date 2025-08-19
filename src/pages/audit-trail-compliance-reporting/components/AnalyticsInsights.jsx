import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsInsights = ({ onInvestigateAnomaly }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('login_attempts');

  const timeframeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const metricOptions = [
    { value: 'login_attempts', label: 'Login Attempts' },
    { value: 'config_changes', label: 'Configuration Changes' },
    { value: 'data_access', label: 'Data Access Events' },
    { value: 'security_events', label: 'Security Events' }
  ];

  const loginTrendsData = [
    { date: '08/07', successful: 245, failed: 12, blocked: 3 },
    { date: '08/08', successful: 267, failed: 8, blocked: 1 },
    { date: '08/09', successful: 234, failed: 15, blocked: 2 },
    { date: '08/10', successful: 289, failed: 6, blocked: 0 },
    { date: '08/11', successful: 256, failed: 18, blocked: 4 },
    { date: '08/12', successful: 278, failed: 9, blocked: 1 },
    { date: '08/13', successful: 198, failed: 7, blocked: 2 }
  ];

  const userActivityData = [
    { user: 'admin@company.com', actions: 156, risk: 'medium' },
    { user: 'john.doe@company.com', actions: 89, risk: 'low' },
    { user: 'jane.smith@company.com', actions: 134, risk: 'low' },
    { user: 'security@company.com', actions: 201, risk: 'high' },
    { user: 'compliance@company.com', actions: 67, risk: 'low' }
  ];

  const actionDistributionData = [
    { name: 'User Login', value: 1247, color: '#10b981' },
    { name: 'Config Changes', value: 89, color: '#f59e0b' },
    { name: 'Data Access', value: 456, color: '#3b82f6' },
    { name: 'Security Events', value: 23, color: '#ef4444' },
    { name: 'System Admin', value: 167, color: '#8b5cf6' }
  ];

  const anomalies = [
    {
      id: 1,
      type: 'Unusual Access Pattern',
      description: 'Multiple failed login attempts from same IP address',
      severity: 'high',
      timestamp: '2025-08-13 14:45:23',
      affectedUser: 'john.doe@company.com',
      ipAddress: '192.168.1.100',
      status: 'investigating'
    },
    {
      id: 2,
      type: 'Policy Violation',
      description: 'Administrative action performed outside business hours',
      severity: 'medium',
      timestamp: '2025-08-13 02:15:45',
      affectedUser: 'admin@company.com',
      ipAddress: '10.0.0.50',
      status: 'resolved'
    },
    {
      id: 3,
      type: 'Privilege Escalation',
      description: 'User role changed to administrator without approval',
      severity: 'high',
      timestamp: '2025-08-12 16:30:12',
      affectedUser: 'temp.user@company.com',
      ipAddress: '172.16.0.25',
      status: 'blocked'
    },
    {
      id: 4,
      type: 'Data Exfiltration Risk',
      description: 'Large volume of data accessed in short timeframe',
      severity: 'medium',
      timestamp: '2025-08-12 11:22:18',
      affectedUser: 'contractor@company.com',
      ipAddress: '192.168.2.75',
      status: 'monitoring'
    }
  ];

  const complianceMetrics = [
    {
      framework: 'SOC 2 Type II',
      score: 94,
      status: 'compliant',
      lastAssessment: '2025-08-10',
      nextReview: '2025-11-10'
    },
    {
      framework: 'GDPR',
      score: 87,
      status: 'compliant',
      lastAssessment: '2025-08-08',
      nextReview: '2025-09-08'
    },
    {
      framework: 'ISO 27001',
      score: 91,
      status: 'compliant',
      lastAssessment: '2025-08-05',
      nextReview: '2025-10-05'
    },
    {
      framework: 'HIPAA',
      score: 78,
      status: 'needs_attention',
      lastAssessment: '2025-08-03',
      nextReview: '2025-08-17'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'investigating': return 'text-warning';
      case 'resolved': return 'text-success';
      case 'blocked': return 'text-error';
      case 'monitoring': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-success';
      case 'needs_attention': return 'text-warning';
      case 'non_compliant': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Analytics & Insights</h3>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            options={timeframeOptions}
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            className="w-40"
          />
          <Select
            options={metricOptions}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="w-48"
          />
        </div>
      </div>
      {/* Login Trends Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h4 className="text-md font-semibold text-card-foreground mb-4">Login Activity Trends</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={loginTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
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
              <Bar dataKey="successful" fill="var(--color-success)" name="Successful" />
              <Bar dataKey="failed" fill="var(--color-warning)" name="Failed" />
              <Bar dataKey="blocked" fill="var(--color-error)" name="Blocked" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Distribution */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="text-md font-semibold text-card-foreground mb-4">Action Distribution</h4>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={actionDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  labelLine={false}
                  fontSize={12}
                >
                  {actionDistributionData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Active Users */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="text-md font-semibold text-card-foreground mb-4">Top Active Users</h4>
          <div className="space-y-3">
            {userActivityData?.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-card-foreground">
                      {user?.user?.split('@')?.[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user?.actions} actions
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                  getSeverityColor(user?.risk)
                }`}>
                  {user?.risk} risk
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Security Anomalies */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-md font-semibold text-card-foreground">Security Anomalies</h4>
          <Button variant="outline" size="sm">
            <Icon name="Settings" size={16} className="mr-2" />
            Configure Detection
          </Button>
        </div>

        <div className="space-y-4">
          {anomalies?.map((anomaly) => (
            <div key={anomaly?.id} className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      getSeverityColor(anomaly?.severity)
                    }`}>
                      {anomaly?.severity}
                    </span>
                    <h5 className="text-sm font-medium text-card-foreground">{anomaly?.type}</h5>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{anomaly?.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">User:</span>
                      <div>{anomaly?.affectedUser}</div>
                    </div>
                    <div>
                      <span className="font-medium">IP Address:</span>
                      <div className="font-mono">{anomaly?.ipAddress}</div>
                    </div>
                    <div>
                      <span className="font-medium">Time:</span>
                      <div>{anomaly?.timestamp}</div>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <div className={`capitalize ${getStatusColor(anomaly?.status)}`}>
                        {anomaly?.status}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onInvestigateAnomaly(anomaly)}
                >
                  <Icon name="Search" size={14} className="mr-2" />
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Compliance Dashboard */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h4 className="text-md font-semibold text-card-foreground mb-6">Compliance Status</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceMetrics?.map((metric, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-medium text-card-foreground">{metric?.framework}</h5>
                <div className={`text-lg font-bold ${getComplianceColor(metric?.status)}`}>
                  {metric?.score}%
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    metric?.status === 'compliant' ? 'bg-success' :
                    metric?.status === 'needs_attention' ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${metric?.score}%` }}
                ></div>
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Last: {metric?.lastAssessment}</div>
                <div>Next: {metric?.nextReview}</div>
                <div className={`capitalize ${getComplianceColor(metric?.status)}`}>
                  {metric?.status?.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsInsights;