import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SecuritySettings = ({ settings, onSettingsChange, hasUnsavedChanges }) => {
  const [localSettings, setLocalSettings] = useState(settings?.security || {});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const encryptionOptions = [
    { value: 'AES-256', label: 'AES-256 (Recommended)' },
    { value: 'AES-192', label: 'AES-192' },
    { value: 'AES-128', label: 'AES-128' }
  ];

  const sessionTimeoutOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
    { value: '480', label: '8 hours' }
  ];

  const auditRetentionOptions = [
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '6 months' },
    { value: '365', label: '1 year' },
    { value: '1095', label: '3 years' },
    { value: '2555', label: '7 years' }
  ];

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onSettingsChange('security', updatedSettings);
  };

  const securityMetrics = [
    { label: 'Failed Login Attempts (24h)', value: '12', status: 'warning' },
    { label: 'Active Sessions', value: '247', status: 'success' },
    { label: 'Security Alerts', value: '3', status: 'error' },
    { label: 'Last Security Scan', value: '2 hours ago', status: 'success' }
  ];

  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Security Overview</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {securityMetrics?.map((metric, index) => (
            <div key={index} className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{metric?.label}</span>
                <Icon 
                  name={metric?.status === 'success' ? 'CheckCircle' : metric?.status === 'warning' ? 'AlertTriangle' : 'XCircle'} 
                  size={14} 
                  className={`${
                    metric?.status === 'success' ? 'text-success' : 
                    metric?.status === 'warning' ? 'text-warning' : 'text-error'
                  }`}
                />
              </div>
              <p className="text-lg font-semibold text-foreground">{metric?.value}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Authentication & Access */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Key" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Authentication & Access</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={localSettings?.ssoEnabled || true}
                onChange={(e) => handleInputChange('ssoEnabled', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Enable SSO Authentication</span>
            </label>
            
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={localSettings?.mfaRequired || true}
                onChange={(e) => handleInputChange('mfaRequired', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Require Multi-Factor Authentication</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localSettings?.passwordComplexity || true}
                onChange={(e) => handleInputChange('passwordComplexity', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Enforce Password Complexity</span>
            </label>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Session Timeout"
              options={sessionTimeoutOptions}
              value={localSettings?.sessionTimeout || '60'}
              onChange={(value) => handleInputChange('sessionTimeout', value)}
              description="Automatic logout after inactivity"
            />
            
            <Input
              label="Max Failed Login Attempts"
              type="number"
              value={localSettings?.maxFailedLogins || '5'}
              onChange={(e) => handleInputChange('maxFailedLogins', e?.target?.value)}
              placeholder="5"
              description="Account lockout threshold"
            />
          </div>
        </div>
      </div>
      {/* Data Encryption */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Lock" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Data Encryption</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Encryption Algorithm"
            options={encryptionOptions}
            value={localSettings?.encryptionAlgorithm || 'AES-256'}
            onChange={(value) => handleInputChange('encryptionAlgorithm', value)}
            description="Encryption standard for data at rest"
          />
          
          <div>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={localSettings?.encryptInTransit || true}
                onChange={(e) => handleInputChange('encryptInTransit', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Encrypt Data in Transit</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localSettings?.encryptBackups || true}
                onChange={(e) => handleInputChange('encryptBackups', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Encrypt Backup Files</span>
            </label>
          </div>
        </div>
      </div>
      {/* Audit & Compliance */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Audit & Compliance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={localSettings?.auditLogging || true}
                onChange={(e) => handleInputChange('auditLogging', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Enable Audit Logging</span>
            </label>
            
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={localSettings?.complianceReporting || true}
                onChange={(e) => handleInputChange('complianceReporting', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Generate Compliance Reports</span>
            </label>
          </div>
          
          <Select
            label="Audit Log Retention"
            options={auditRetentionOptions}
            value={localSettings?.auditRetention || '365'}
            onChange={(value) => handleInputChange('auditRetention', value)}
            description="How long to keep audit logs"
          />
        </div>
      </div>
      {/* Advanced Security Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Advanced Security</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Icon name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} size={16} className="mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>
        
        {showAdvanced && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="API Rate Limit (requests/minute)"
                type="number"
                value={localSettings?.apiRateLimit || '1000'}
                onChange={(e) => handleInputChange('apiRateLimit', e?.target?.value)}
                placeholder="1000"
                description="Maximum API requests per minute per user"
              />
              
              <Input
                label="IP Whitelist"
                type="text"
                value={localSettings?.ipWhitelist || ''}
                onChange={(e) => handleInputChange('ipWhitelist', e?.target?.value)}
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                description="Comma-separated IP ranges (leave empty to allow all)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={localSettings?.bruteForceProtection || true}
                    onChange={(e) => handleInputChange('bruteForceProtection', e?.target?.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">Brute Force Protection</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSettings?.suspiciousActivityDetection || true}
                    onChange={(e) => handleInputChange('suspiciousActivityDetection', e?.target?.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">Suspicious Activity Detection</span>
                </label>
              </div>
              
              <Input
                label="Security Alert Email"
                type="email"
                value={localSettings?.securityAlertEmail || 'security@company.com'}
                onChange={(e) => handleInputChange('securityAlertEmail', e?.target?.value)}
                placeholder="security@company.com"
                description="Email for security notifications"
              />
            </div>
          </div>
        )}
      </div>
      {/* Save Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning">Security changes require administrator approval</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Reset Changes
            </Button>
            <Button variant="default" size="sm">
              Request Approval
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;