import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityNotices = () => {
  const notices = [
    {
      id: 1,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Authentication services will undergo maintenance on Aug 15, 2025 from 2:00-4:00 AM EST.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Security Update',
      message: 'New MFA requirements will be enforced starting Aug 20, 2025. Ensure your authenticator app is configured.',
      timestamp: '1 day ago'
    }
  ];

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'info': return 'Info';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      case 'success': return 'CheckCircle';
      default: return 'Info';
    }
  };

  const getNoticeColor = (type) => {
    switch (type) {
      case 'info': return 'text-accent';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'success': return 'text-success';
      default: return 'text-accent';
    }
  };

  const getNoticeBg = (type) => {
    switch (type) {
      case 'info': return 'bg-accent/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      case 'success': return 'bg-success/10';
      default: return 'bg-accent/10';
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-foreground mb-3">Security Notices</h4>
      <div className="space-y-3">
        {notices?.map((notice) => (
          <div
            key={notice?.id}
            className={`p-3 rounded-lg border border-border ${getNoticeBg(notice?.type)}`}
          >
            <div className="flex items-start space-x-3">
              <Icon 
                name={getNoticeIcon(notice?.type)} 
                size={16} 
                className={`${getNoticeColor(notice?.type)} mt-0.5`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">
                  {notice?.title}
                </p>
                <p className="text-xs text-text-secondary mb-2">
                  {notice?.message}
                </p>
                <p className="text-xs text-text-secondary">
                  {notice?.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityNotices;