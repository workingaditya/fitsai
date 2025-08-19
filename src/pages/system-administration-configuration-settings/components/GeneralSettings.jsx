import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GeneralSettings = ({ settings, onSettingsChange, hasUnsavedChanges }) => {
  const [localSettings, setLocalSettings] = useState(settings?.general || {});

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese (Simplified)' }
  ];

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onSettingsChange('general', updatedSettings);
  };

  const handleLogoUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('logoUrl', e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* System Identity */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Building2" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">System Identity</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="System Name"
            type="text"
            value={localSettings?.systemName || 'FITS AI'}
            onChange={(e) => handleInputChange('systemName', e?.target?.value)}
            placeholder="Enter system name"
            description="Display name for the AI knowledge platform"
          />
          
          <Input
            label="Organization Name"
            type="text"
            value={localSettings?.organizationName || 'Enterprise IT'}
            onChange={(e) => handleInputChange('organizationName', e?.target?.value)}
            placeholder="Enter organization name"
            description="Your organization's display name"
          />
          
          <div className="md:col-span-2">
            <Input
              label="System Description"
              type="text"
              value={localSettings?.systemDescription || 'Enterprise AI knowledge assistant for IT support automation'}
              onChange={(e) => handleInputChange('systemDescription', e?.target?.value)}
              placeholder="Enter system description"
              description="Brief description of the system's purpose"
            />
          </div>
        </div>
      </div>
      {/* Branding & Appearance */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Palette" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Branding & Appearance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              System Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                {localSettings?.logoUrl ? (
                  <img 
                    src={localSettings?.logoUrl} 
                    alt="System Logo" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Icon name="Zap" size={24} color="white" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 2MB. Recommended: 64x64px
                </p>
              </div>
            </div>
          </div>
          
          <Input
            label="Primary Brand Color"
            type="text"
            value={localSettings?.primaryColor || '#10b981'}
            onChange={(e) => handleInputChange('primaryColor', e?.target?.value)}
            placeholder="#10b981"
            description="Hex color code for primary brand color"
          />
        </div>
      </div>
      {/* Localization */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Localization</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="System Timezone"
            options={timezoneOptions}
            value={localSettings?.timezone || 'UTC'}
            onChange={(value) => handleInputChange('timezone', value)}
            searchable
            description="Default timezone for system operations"
          />
          
          <Select
            label="Default Language"
            options={languageOptions}
            value={localSettings?.language || 'en'}
            onChange={(value) => handleInputChange('language', value)}
            description="Default interface language"
          />
          
          <Input
            label="Date Format"
            type="text"
            value={localSettings?.dateFormat || 'MM/DD/YYYY'}
            onChange={(e) => handleInputChange('dateFormat', e?.target?.value)}
            placeholder="MM/DD/YYYY"
            description="System-wide date display format"
          />
        </div>
      </div>
      {/* System Maintenance */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Wrench" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">System Maintenance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localSettings?.maintenanceMode || false}
                onChange={(e) => handleInputChange('maintenanceMode', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Maintenance Mode</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Temporarily disable system access for maintenance
            </p>
          </div>
          
          <Input
            label="Maintenance Message"
            type="text"
            value={localSettings?.maintenanceMessage || 'System is currently under maintenance. Please try again later.'}
            onChange={(e) => handleInputChange('maintenanceMessage', e?.target?.value)}
            placeholder="Enter maintenance message"
            description="Message displayed during maintenance mode"
            disabled={!localSettings?.maintenanceMode}
          />
        </div>
      </div>
      {/* Save Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning">You have unsaved changes</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Reset Changes
            </Button>
            <Button variant="default" size="sm">
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettings;