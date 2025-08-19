import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SSOProviders = ({ onSSOLogin, isLoading }) => {
  // Supabase supported providers - removed Microsoft as it's not configured
  const ssoProviders = [
    {
      id: 'google',
      name: 'Google Workspace',
      icon: 'Chrome',
      primary: true,
      status: 'connected'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      primary: false,
      status: 'connected'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> SSO providers require Supabase configuration
          </p>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          For demo purposes, please use the email/password authentication below
        </p>
      </div>

      <h3 className="text-sm font-medium text-foreground mb-3">Single Sign-On (Requires Setup)</h3>
      <div className="space-y-2">
        {ssoProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            fullWidth
            onClick={() => onSSOLogin(provider?.id)}
            loading={isLoading === provider?.id}
            disabled
            className="justify-start h-12 opacity-50"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <Icon name={provider?.icon} size={18} />
                <span className="font-medium">{provider?.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Setup Required</span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SSOProviders;