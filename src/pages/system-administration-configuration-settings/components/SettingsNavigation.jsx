import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SettingsNavigation = ({ activeTab, onTabChange, unsavedChanges }) => {
  const settingsTabs = [
    {
      id: 'general',
      label: 'General',
      icon: 'Settings',
      description: 'System identity, branding, and basic configuration'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Authentication, encryption, and audit settings'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'Zap',
      description: 'ITSM, LDAP, and external system connections'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: 'Activity',
      description: 'Caching, load balancing, and resource limits'
    }
  ];

  return (
    <div className="w-full lg:w-64 bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">System Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure enterprise-wide system parameters
        </p>
      </div>
      <nav className="p-4 space-y-2">
        {settingsTabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "ghost"}
            onClick={() => onTabChange(tab?.id)}
            className="w-full justify-start h-auto p-4"
          >
            <div className="flex items-start space-x-3 w-full">
              <Icon name={tab?.icon} size={20} className="mt-0.5" />
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{tab?.label}</span>
                  {unsavedChanges?.[tab?.id] && (
                    <div className="w-2 h-2 bg-warning rounded-full" title="Unsaved changes" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {tab?.description}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </nav>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="Download" size={16} className="mr-2" />
            Export Configuration
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="Upload" size={16} className="mr-2" />
            Import Configuration
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsNavigation;