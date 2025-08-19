import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

import FilterPanel from './components/FilterPanel';
import AuditTable from './components/AuditTable';
import ComplianceReports from './components/ComplianceReports';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import AnalyticsInsights from './components/AnalyticsInsights';

const AuditTrailComplianceReporting = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('audit_logs');
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [userRole] = useState('admin'); // Mock user role

  // Mock audit log data
  const mockAuditLogs = [
    {
      id: 1,
      timestamp: '2025-08-13T15:02:45Z',
      user: 'admin@company.com',
      role: 'Administrator',
      action: 'login',
      actionLabel: 'User Login',
      actionIcon: 'LogIn',
      resource: 'IT Dashboard',
      ipAddress: '192.168.1.100',
      outcome: 'success'
    },
    {
      id: 2,
      timestamp: '2025-08-13T15:01:23Z',
      user: 'john.doe@company.com',
      role: 'IT Support',
      action: 'data_access',
      actionLabel: 'Knowledge Base Access',
      actionIcon: 'BookOpen',
      resource: 'Network Troubleshooting Guide',
      ipAddress: '192.168.1.105',
      outcome: 'success'
    },
    {
      id: 3,
      timestamp: '2025-08-13T14:58:12Z',
      user: 'security@company.com',
      role: 'Security Officer',
      action: 'config_change',
      actionLabel: 'Configuration Change',
      actionIcon: 'Settings',
      resource: 'LLM Model Settings',
      ipAddress: '10.0.0.50',
      outcome: 'success'
    },
    {
      id: 4,
      timestamp: '2025-08-13T14:55:34Z',
      user: 'jane.smith@company.com',
      role: 'IT Support',
      action: 'login',
      actionLabel: 'Failed Login',
      actionIcon: 'LogIn',
      resource: 'Authentication System',
      ipAddress: '192.168.2.75',
      outcome: 'failure'
    },
    {
      id: 5,
      timestamp: '2025-08-13T14:52:18Z',
      user: 'compliance@company.com',
      role: 'Compliance Manager',
      action: 'compliance_check',
      actionLabel: 'Compliance Audit',
      actionIcon: 'Shield',
      resource: 'SOC 2 Controls',
      ipAddress: '172.16.0.25',
      outcome: 'warning'
    },
    {
      id: 6,
      timestamp: '2025-08-13T14:48:56Z',
      user: 'admin@company.com',
      role: 'Administrator',
      action: 'permission_change',
      actionLabel: 'Permission Update',
      actionIcon: 'Key',
      resource: 'User Role Assignment',
      ipAddress: '192.168.1.100',
      outcome: 'success'
    },
    {
      id: 7,
      timestamp: '2025-08-13T14:45:23Z',
      user: 'temp.user@company.com',
      role: 'Temporary User',
      action: 'login',
      actionLabel: 'Blocked Login',
      actionIcon: 'LogIn',
      resource: 'Authentication System',
      ipAddress: '203.0.113.45',
      outcome: 'blocked'
    },
    {
      id: 8,
      timestamp: '2025-08-13T14:42:11Z',
      user: 'system@company.com',
      role: 'System',
      action: 'system_admin',
      actionLabel: 'System Backup',
      actionIcon: 'Database',
      resource: 'Knowledge Base Backup',
      ipAddress: '127.0.0.1',
      outcome: 'success'
    }
  ];

  const mockSavedQueries = [
    {
      id: 1,
      name: 'Failed Logins Last 24h',
      filters: {
        dateRange: { startDate: '2025-08-12', endDate: '2025-08-13' },
        actions: ['login'],
        outcome: 'failure'
      }
    },
    {
      id: 2,
      name: 'Admin Changes This Week',
      filters: {
        dateRange: { startDate: '2025-08-06', endDate: '2025-08-13' },
        users: ['admin@company.com'],
        actions: ['config_change', 'permission_change']
      }
    },
    {
      id: 3,
      name: 'Security Events',
      filters: {
        actions: ['security_event'],
        complianceFramework: 'soc2'
      }
    }
  ];

  useEffect(() => {
    setAuditLogs(mockAuditLogs);
    setFilteredLogs(mockAuditLogs);
    setSavedQueries(mockSavedQueries);
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...auditLogs];

    // Apply date range filter
    if (filters?.dateRange?.startDate && filters?.dateRange?.endDate) {
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      endDate?.setHours(23, 59, 59, 999);
      
      filtered = filtered?.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    // Apply user filter
    if (filters?.users && filters?.users?.length > 0) {
      filtered = filtered?.filter(log => filters?.users?.includes(log?.user));
    }

    // Apply action filter
    if (filters?.actions && filters?.actions?.length > 0) {
      filtered = filtered?.filter(log => filters?.actions?.includes(log?.action));
    }

    // Apply outcome filter
    if (filters?.outcome) {
      filtered = filtered?.filter(log => log?.outcome === filters?.outcome);
    }

    // Apply IP address filter
    if (filters?.ipAddress) {
      filtered = filtered?.filter(log => 
        log?.ipAddress?.includes(filters?.ipAddress) ||
        log?.ipAddress?.match(new RegExp(filters.ipAddress.replace(/\*/g, '.*')))
      );
    }

    setFilteredLogs(filtered);
  };

  const handleSaveQuery = (query) => {
    const newQuery = {
      ...query,
      id: savedQueries?.length + 1
    };
    setSavedQueries(prev => [...prev, newQuery]);
  };

  const handleLoadQuery = (query) => {
    handleFiltersChange(query?.filters);
  };

  const handleExportLogs = (selection) => {
    const logsToExport = selection === 'all' ? filteredLogs : 
      filteredLogs?.filter(log => selection?.includes(log?.id));
    
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Outcome']?.join(','),
      ...logsToExport?.map(log => [
        log?.timestamp,
        log?.user,
        log?.actionLabel,
        log?.resource,
        log?.ipAddress,
        log?.outcome
      ]?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    window.URL?.revokeObjectURL(url);
  };

  const handleViewLogDetails = (log) => {
    // Mock implementation - would open detailed view modal
    console.log('Viewing details for log:', log);
  };

  const handleGenerateReport = (reportConfig) => {
    // Mock implementation - would generate compliance report
    console.log('Generating report:', reportConfig);
  };

  const handleScheduleReport = (scheduleConfig) => {
    // Mock implementation - would schedule report
    console.log('Scheduling report:', scheduleConfig);
  };

  const handleConfigureAlert = () => {
    // Mock implementation - would open alert configuration
    console.log('Configuring alert thresholds');
  };

  const handleInvestigateAnomaly = (anomaly) => {
    // Mock implementation - would open investigation workflow
    console.log('Investigating anomaly:', anomaly);
  };

  const tabs = [
    { id: 'audit_logs', label: 'Audit Logs', icon: 'FileText' },
    { id: 'compliance_reports', label: 'Compliance Reports', icon: 'Shield' },
    { id: 'real_time', label: 'Real-time Monitoring', icon: 'Activity' },
    { id: 'analytics', label: 'Analytics & Insights', icon: 'BarChart3' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
      />
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
      />
      <main className={`transition-all duration-normal ${
        sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'
      } mt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Audit Trail & Compliance Reporting</h1>
                <p className="text-muted-foreground">
                  Monitor system activities, generate compliance reports, and analyze security events
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="FileText" size={20} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Logs</p>
                    <p className="text-xl font-bold text-card-foreground">{filteredLogs?.length?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Security Events</p>
                    <p className="text-xl font-bold text-card-foreground">
                      {filteredLogs?.filter(log => log?.outcome === 'failure' || log?.outcome === 'blocked')?.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Users" size={20} className="text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-xl font-bold text-card-foreground">
                      {new Set(filteredLogs.map(log => log.user))?.size}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                    <p className="text-xl font-bold text-card-foreground">94%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'audit_logs' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <FilterPanel
                    onFiltersChange={handleFiltersChange}
                    savedQueries={savedQueries}
                    onSaveQuery={handleSaveQuery}
                    onLoadQuery={handleLoadQuery}
                  />
                </div>
                <div className="lg:col-span-3">
                  <AuditTable
                    auditLogs={filteredLogs}
                    onExport={handleExportLogs}
                    onViewDetails={handleViewLogDetails}
                    userRole={userRole}
                  />
                </div>
              </div>
            )}

            {activeTab === 'compliance_reports' && (
              <ComplianceReports
                onGenerateReport={handleGenerateReport}
                onScheduleReport={handleScheduleReport}
              />
            )}

            {activeTab === 'real_time' && (
              <RealTimeMonitoring
                onConfigureAlert={handleConfigureAlert}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsInsights
                onInvestigateAnomaly={handleInvestigateAnomaly}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuditTrailComplianceReporting;