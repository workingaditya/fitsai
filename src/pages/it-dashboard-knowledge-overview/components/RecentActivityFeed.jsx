import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'conversation',
      title: 'New conversation started',
      description: 'Exchange Server troubleshooting with AI Assistant',
      user: 'John Smith',
      timestamp: '5 minutes ago',
      icon: 'MessageSquare',
      color: 'text-primary'
    },
    {
      id: 2,
      type: 'knowledge',
      title: 'Knowledge article updated',
      description: 'Windows Server 2022 Backup Procedures',
      user: 'IT Documentation Team',
      timestamp: '15 minutes ago',
      icon: 'BookOpen',
      color: 'text-accent'
    },
    {
      id: 3,
      type: 'system',
      title: 'System maintenance completed',
      description: 'LLM model cache optimization finished',
      user: 'System Administrator',
      timestamp: '1 hour ago',
      icon: 'Settings',
      color: 'text-success'
    },
    {
      id: 4,
      type: 'user',
      title: 'New user registered',
      description: 'Sarah Johnson joined IT Support team',
      user: 'HR System',
      timestamp: '2 hours ago',
      icon: 'UserPlus',
      color: 'text-warning'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Performance alert resolved',
      description: 'High CPU usage on server cluster normalized',
      user: 'Monitoring System',
      timestamp: '3 hours ago',
      icon: 'AlertTriangle',
      color: 'text-error'
    },
    {
      id: 6,
      type: 'backup',
      title: 'Backup completed successfully',
      description: 'Daily knowledge base backup to cloud storage',
      user: 'Backup Service',
      timestamp: '4 hours ago',
      icon: 'Database',
      color: 'text-muted-foreground'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'conversation': return 'MessageSquare';
      case 'knowledge': return 'BookOpen';
      case 'system': return 'Settings';
      case 'user': return 'UserPlus';
      case 'alert': return 'AlertTriangle';
      case 'backup': return 'Database';
      default: return 'Activity';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
          <Icon name="Activity" size={20} />
          <span>Recent Activity</span>
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} className={activity?.color} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-card-foreground line-clamp-1">
                  {activity?.title}
                </h4>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                  {activity?.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                {activity?.description}
              </p>
              
              <div className="flex items-center space-x-2">
                <Icon name="User" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{activity?.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center">
          <button className="text-sm text-muted-foreground hover:text-card-foreground transition-colors flex items-center space-x-1">
            <Icon name="RefreshCw" size={14} />
            <span>Refresh Activity Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityFeed;