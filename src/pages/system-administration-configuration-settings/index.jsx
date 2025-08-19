import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import GeneralSettings from './components/GeneralSettings';
import SecuritySettings from './components/SecuritySettings';
import IntegrationSettings from './components/IntegrationSettings';
import PerformanceSettings from './components/PerformanceSettings';
import SettingsNavigation from './components/SettingsNavigation';
import ConfigurationHeader from './components/ConfigurationHeader';

const SystemAdministrationConfigurationSettings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      systemName: 'FITS AI',
      organizationName: 'Enterprise IT',
      systemDescription: 'Enterprise AI knowledge assistant for IT support automation',
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      primaryColor: '#10b981',
      logoUrl: '',
      maintenanceMode: false,
      maintenanceMessage: 'System is currently under maintenance. Please try again later.'
    },
    security: {
      ssoEnabled: true,
      mfaRequired: true,
      passwordComplexity: true,
      sessionTimeout: '60',
      maxFailedLogins: '5',
      encryptionAlgorithm: 'AES-256',
      encryptInTransit: true,
      encryptBackups: true,
      auditLogging: true,
      complianceReporting: true,
      auditRetention: '365',
      apiRateLimit: '1000',
      ipWhitelist: '',
      bruteForceProtection: true,
      suspiciousActivityDetection: true,
      securityAlertEmail: 'security@company.com'
    },
    integrations: {
      itsm: {
        provider: 'servicenow',
        serverUrl: 'https://company.service-now.com',
        username: 'api_user',
        apiToken: '',
        autoCreateTickets: false,
        syncKnowledgeBase: true
      },
      ldap: {
        type: 'active-directory',
        server: 'ldap://dc.company.com:389',
        baseDn: 'DC=company,DC=com',
        bindDn: 'CN=service,OU=Users,DC=company,DC=com',
        bindPassword: '',
        useSSL: true,
        autoSync: true
      },
      email: {
        smtpServer: 'smtp.company.com',
        smtpPort: '587',
        fromEmail: 'noreply@company.com',
        username: '',
        password: '',
        useSSL: true,
        enableNotifications: true
      },
      api: {
        knowledgeBaseUrl: 'https://api.company.com/kb',
        monitoringUrl: 'https://monitoring.company.com/api',
        apiKey: ''
      }
    },
    performance: {
      cachingStrategy: 'redis',
      cacheTtl: '3600',
      maxCacheSize: '1024',
      enableQueryCache: true,
      enableResponseCache: true,
      enableStaticCache: true,
      loadBalancingMethod: 'round-robin',
      healthCheckInterval: '30',
      maxConnectionsPerServer: '1000',
      enableStickySession: false,
      enableFailover: true,
      maxCpuUsage: '80',
      maxMemoryUsage: '85',
      maxConcurrentUsers: '500',
      connectionPoolSize: '100',
      queryTimeout: '30',
      threadPoolSize: '50',
      requestQueueSize: '1000',
      enableCompression: true,
      enableKeepAlive: true,
      enablePipelining: false
    }
  });

  const [unsavedChanges, setUnsavedChanges] = useState({
    general: false,
    security: false,
    integrations: false,
    performance: false
  });

  const [originalSettings, setOriginalSettings] = useState(settings);

  useEffect(() => {
    // Check for unsaved changes
    const hasChanges = {
      general: JSON.stringify(settings?.general) !== JSON.stringify(originalSettings?.general),
      security: JSON.stringify(settings?.security) !== JSON.stringify(originalSettings?.security),
      integrations: JSON.stringify(settings?.integrations) !== JSON.stringify(originalSettings?.integrations),
      performance: JSON.stringify(settings?.performance) !== JSON.stringify(originalSettings?.performance)
    };
    setUnsavedChanges(hasChanges);
  }, [settings, originalSettings]);

  const handleSettingsChange = (section, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [section]: newSettings
    }));
  };

  const handleSaveAll = () => {
    // Simulate API call to save settings
    console.log('Saving all settings:', settings);
    setOriginalSettings(settings);
    // Show success notification
  };

  const handleDiscardAll = () => {
    setSettings(originalSettings);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const hasAnyUnsavedChanges = Object.values(unsavedChanges)?.some(Boolean);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            hasUnsavedChanges={unsavedChanges?.general}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            hasUnsavedChanges={unsavedChanges?.security}
          />
        );
      case 'integrations':
        return (
          <IntegrationSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            hasUnsavedChanges={unsavedChanges?.integrations}
          />
        );
      case 'performance':
        return (
          <PerformanceSettings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            hasUnsavedChanges={unsavedChanges?.performance}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="admin"
      />
      
      <div className={`transition-all duration-normal ${
        sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'
      }`}>
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole="admin"
        />
        
        <main className="pt-16">
          <ConfigurationHeader
            activeTab={activeTab}
            hasUnsavedChanges={hasAnyUnsavedChanges}
            onSaveAll={handleSaveAll}
            onDiscardAll={handleDiscardAll}
          />
          
          <div className="flex h-[calc(100vh-200px)]">
            <SettingsNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              unsavedChanges={unsavedChanges}
            />
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {renderActiveTab()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemAdministrationConfigurationSettings;