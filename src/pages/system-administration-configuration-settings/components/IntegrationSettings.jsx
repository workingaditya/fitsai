import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const IntegrationSettings = ({ settings, onSettingsChange, hasUnsavedChanges }) => {
  const [localSettings, setLocalSettings] = useState(settings?.integrations || {});
  const [testingConnection, setTestingConnection] = useState(null);

  const itsmProviders = [
    { value: 'servicenow', label: 'ServiceNow' },
    { value: 'jira', label: 'Jira Service Management' },
    { value: 'remedy', label: 'BMC Remedy' },
    { value: 'cherwell', label: 'Cherwell' },
    { value: 'freshservice', label: 'Freshservice' },
    { value: 'custom', label: 'Custom API' }
  ];

  const ldapTypes = [
    { value: 'active-directory', label: 'Active Directory' },
    { value: 'openldap', label: 'OpenLDAP' },
    { value: 'azure-ad', label: 'Azure Active Directory' },
    { value: 'okta', label: 'Okta' },
    { value: 'ping-identity', label: 'Ping Identity' }
  ];

  const handleInputChange = (section, field, value) => {
    const updatedSettings = {
      ...localSettings,
      [section]: {
        ...localSettings?.[section],
        [field]: value
      }
    };
    setLocalSettings(updatedSettings);
    onSettingsChange('integrations', updatedSettings);
  };

  const testConnection = async (type) => {
    setTestingConnection(type);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingConnection(null);
    // Show success/error message
  };

  const integrationStatus = {
    itsm: { status: 'connected', lastSync: '2 minutes ago', health: 'healthy' },
    ldap: { status: 'connected', lastSync: '5 minutes ago', health: 'healthy' },
    email: { status: 'warning', lastSync: '1 hour ago', health: 'degraded' },
    monitoring: { status: 'disconnected', lastSync: 'Never', health: 'offline' }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'disconnected': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-8">
      {/* Integration Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Integration Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(integrationStatus)?.map(([key, integration]) => (
            <div key={key} className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground capitalize">{key}</span>
                <Icon 
                  name={getStatusIcon(integration?.status)} 
                  size={16} 
                  className={getStatusColor(integration?.status)}
                />
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Last sync: {integration?.lastSync}
              </p>
              <p className={`text-xs font-medium ${getStatusColor(integration?.status)}`}>
                {integration?.health}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* ITSM Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Ticket" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">ITSM Integration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="ITSM Provider"
              options={itsmProviders}
              value={localSettings?.itsm?.provider || 'servicenow'}
              onChange={(value) => handleInputChange('itsm', 'provider', value)}
              description="Select your IT service management platform"
            />
            
            <Input
              label="Server URL"
              type="url"
              value={localSettings?.itsm?.serverUrl || 'https://company.service-now.com'}
              onChange={(e) => handleInputChange('itsm', 'serverUrl', e?.target?.value)}
              placeholder="https://company.service-now.com"
              description="Base URL for your ITSM instance"
            />
            
            <Input
              label="API Username"
              type="text"
              value={localSettings?.itsm?.username || 'api_user'}
              onChange={(e) => handleInputChange('itsm', 'username', e?.target?.value)}
              placeholder="Enter API username"
              description="Service account for API access"
            />
          </div>
          
          <div className="space-y-4">
            <Input
              label="API Token/Password"
              type="password"
              value={localSettings?.itsm?.apiToken || ''}
              onChange={(e) => handleInputChange('itsm', 'apiToken', e?.target?.value)}
              placeholder="Enter API token or password"
              description="Authentication credentials for API"
            />
            
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={localSettings?.itsm?.autoCreateTickets || false}
                  onChange={(e) => handleInputChange('itsm', 'autoCreateTickets', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Auto-create tickets from AI conversations</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localSettings?.itsm?.syncKnowledgeBase || true}
                  onChange={(e) => handleInputChange('itsm', 'syncKnowledgeBase', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Sync knowledge articles</span>
              </label>
            </div>
            
            <Button
              variant="outline"
              onClick={() => testConnection('itsm')}
              loading={testingConnection === 'itsm'}
              className="w-full"
            >
              <Icon name="TestTube" size={16} className="mr-2" />
              Test Connection
            </Button>
          </div>
        </div>
      </div>
      {/* LDAP/Active Directory */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Users" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">LDAP/Active Directory</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Directory Type"
              options={ldapTypes}
              value={localSettings?.ldap?.type || 'active-directory'}
              onChange={(value) => handleInputChange('ldap', 'type', value)}
              description="Type of directory service"
            />
            
            <Input
              label="LDAP Server"
              type="text"
              value={localSettings?.ldap?.server || 'ldap://dc.company.com:389'}
              onChange={(e) => handleInputChange('ldap', 'server', e?.target?.value)}
              placeholder="ldap://dc.company.com:389"
              description="LDAP server URL and port"
            />
            
            <Input
              label="Base DN"
              type="text"
              value={localSettings?.ldap?.baseDn || 'DC=company,DC=com'}
              onChange={(e) => handleInputChange('ldap', 'baseDn', e?.target?.value)}
              placeholder="DC=company,DC=com"
              description="Base distinguished name for searches"
            />
          </div>
          
          <div className="space-y-4">
            <Input
              label="Bind DN"
              type="text"
              value={localSettings?.ldap?.bindDn || 'CN=service,OU=Users,DC=company,DC=com'}
              onChange={(e) => handleInputChange('ldap', 'bindDn', e?.target?.value)}
              placeholder="CN=service,OU=Users,DC=company,DC=com"
              description="Service account for LDAP binding"
            />
            
            <Input
              label="Bind Password"
              type="password"
              value={localSettings?.ldap?.bindPassword || ''}
              onChange={(e) => handleInputChange('ldap', 'bindPassword', e?.target?.value)}
              placeholder="Enter bind password"
              description="Password for service account"
            />
            
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={localSettings?.ldap?.useSSL || true}
                  onChange={(e) => handleInputChange('ldap', 'useSSL', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Use SSL/TLS encryption</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localSettings?.ldap?.autoSync || true}
                  onChange={(e) => handleInputChange('ldap', 'autoSync', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Auto-sync user accounts</span>
              </label>
            </div>
            
            <Button
              variant="outline"
              onClick={() => testConnection('ldap')}
              loading={testingConnection === 'ldap'}
              className="w-full"
            >
              <Icon name="TestTube" size={16} className="mr-2" />
              Test Connection
            </Button>
          </div>
        </div>
      </div>
      {/* Email Integration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Mail" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Email Integration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="SMTP Server"
              type="text"
              value={localSettings?.email?.smtpServer || 'smtp.company.com'}
              onChange={(e) => handleInputChange('email', 'smtpServer', e?.target?.value)}
              placeholder="smtp.company.com"
              description="SMTP server for outgoing emails"
            />
            
            <Input
              label="SMTP Port"
              type="number"
              value={localSettings?.email?.smtpPort || '587'}
              onChange={(e) => handleInputChange('email', 'smtpPort', e?.target?.value)}
              placeholder="587"
              description="SMTP server port (usually 587 or 465)"
            />
            
            <Input
              label="From Email"
              type="email"
              value={localSettings?.email?.fromEmail || 'noreply@company.com'}
              onChange={(e) => handleInputChange('email', 'fromEmail', e?.target?.value)}
              placeholder="noreply@company.com"
              description="Default sender email address"
            />
          </div>
          
          <div className="space-y-4">
            <Input
              label="SMTP Username"
              type="text"
              value={localSettings?.email?.username || ''}
              onChange={(e) => handleInputChange('email', 'username', e?.target?.value)}
              placeholder="Enter SMTP username"
              description="Authentication username for SMTP"
            />
            
            <Input
              label="SMTP Password"
              type="password"
              value={localSettings?.email?.password || ''}
              onChange={(e) => handleInputChange('email', 'password', e?.target?.value)}
              placeholder="Enter SMTP password"
              description="Authentication password for SMTP"
            />
            
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={localSettings?.email?.useSSL || true}
                  onChange={(e) => handleInputChange('email', 'useSSL', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Use SSL/TLS</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={localSettings?.email?.enableNotifications || true}
                  onChange={(e) => handleInputChange('email', 'enableNotifications', e?.target?.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Enable email notifications</span>
              </label>
            </div>
            
            <Button
              variant="outline"
              onClick={() => testConnection('email')}
              loading={testingConnection === 'email'}
              className="w-full"
            >
              <Icon name="TestTube" size={16} className="mr-2" />
              Test Connection
            </Button>
          </div>
        </div>
      </div>
      {/* API Endpoints */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">API Endpoints</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Knowledge Base API"
              type="url"
              value={localSettings?.api?.knowledgeBaseUrl || 'https://api.company.com/kb'}
              onChange={(e) => handleInputChange('api', 'knowledgeBaseUrl', e?.target?.value)}
              placeholder="https://api.company.com/kb"
              description="External knowledge base API endpoint"
            />
            
            <Input
              label="Monitoring API"
              type="url"
              value={localSettings?.api?.monitoringUrl || 'https://monitoring.company.com/api'}
              onChange={(e) => handleInputChange('api', 'monitoringUrl', e?.target?.value)}
              placeholder="https://monitoring.company.com/api"
              description="System monitoring API endpoint"
            />
          </div>
          
          <Input
            label="API Key"
            type="password"
            value={localSettings?.api?.apiKey || ''}
            onChange={(e) => handleInputChange('api', 'apiKey', e?.target?.value)}
            placeholder="Enter API key"
            description="Authentication key for external APIs"
          />
        </div>
      </div>
      {/* Save Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning">Integration changes may affect system connectivity</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Reset Changes
            </Button>
            <Button variant="default" size="sm">
              Save & Test All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationSettings;