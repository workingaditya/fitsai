import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfigurationHeader = ({ activeTab, hasUnsavedChanges, onSaveAll, onDiscardAll }) => {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'general': return 'General Settings';
      case 'security': return 'Security Configuration';
      case 'integrations': return 'System Integrations';
      case 'performance': return 'Performance Optimization';
      default: return 'System Configuration';
    }
  };

  const getTabDescription = (tab) => {
    switch (tab) {
      case 'general': 
        return 'Configure system identity, branding, localization, and maintenance settings';
      case 'security': 
        return 'Manage authentication, encryption, audit trails, and security policies';
      case 'integrations': 
        return 'Set up connections to ITSM, LDAP, email, and external API services';
      case 'performance': 
        return 'Optimize caching, load balancing, resource limits, and system performance';
      default: 
        return 'Enterprise-wide system configuration and administration';
    }
  };

  const systemInfo = {
    version: '2.1.4',
    lastUpdated: 'August 13, 2025 at 3:03 PM',
    environment: 'Production',
    uptime: '47 days, 12 hours'
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getTabTitle(activeTab)}
              </h1>
              <p className="text-muted-foreground mt-1">
                {getTabDescription(activeTab)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={onDiscardAll}>
                  <Icon name="X" size={16} className="mr-2" />
                  Discard Changes
                </Button>
                <Button variant="default" onClick={onSaveAll}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Save All Changes
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="icon">
              <Icon name="RefreshCw" size={18} />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Icon name="HelpCircle" size={18} />
            </Button>
          </div>
        </div>
      </div>
      {/* System Status Bar */}
      <div className="px-6 py-3 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Icon name="Server" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium text-foreground">{systemInfo?.version}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium text-foreground">{systemInfo?.uptime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">Environment:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/20 text-success">
                {systemInfo?.environment}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>Last updated: {systemInfo?.lastUpdated}</span>
          </div>
        </div>
      </div>
      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <div className="px-6 py-3 bg-warning/10 border-t border-warning/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning font-medium">
              You have unsaved configuration changes. Remember to save your changes before navigating away.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationHeader;