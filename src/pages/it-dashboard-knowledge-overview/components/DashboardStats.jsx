import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ userRole }) => {
  const stats = [
    {
      title: "Active Conversations",
      value: "24",
      change: "+12%",
      changeType: "increase",
      icon: "MessageSquare",
      description: "Ongoing AI chat sessions",
      roles: ['admin', 'user', 'support']
    },
    {
      title: "Knowledge Articles",
      value: "1,247",
      change: "+8",
      changeType: "increase",
      icon: "BookOpen",
      description: "Total articles in knowledge base",
      roles: ['admin', 'user', 'support']
    },
    {
      title: "System Uptime",
      value: "99.8%",
      change: "0.2%",
      changeType: "increase",
      icon: "Activity",
      description: "Last 30 days availability",
      roles: ['admin', 'support']
    },
    {
      title: "Response Time",
      value: "1.2s",
      change: "-0.3s",
      changeType: "decrease",
      icon: "Zap",
      description: "Average AI response time",
      roles: ['admin', 'user', 'support']
    },
    {
      title: "Active Users",
      value: "89",
      change: "+5",
      changeType: "increase",
      icon: "Users",
      description: "Currently online IT staff",
      roles: ['admin']
    },
    {
      title: "Resolved Issues",
      value: "156",
      change: "+23",
      changeType: "increase",
      icon: "CheckCircle",
      description: "Issues resolved this week",
      roles: ['admin', 'support']
    }
  ];

  const filteredStats = stats?.filter(stat => stat?.roles?.includes(userRole));

  const getChangeColor = (changeType) => {
    return changeType === 'increase' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'increase' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {filteredStats?.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={stat?.icon} size={24} className="text-primary" />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(stat?.changeType)}`}>
              <Icon name={getChangeIcon(stat?.changeType)} size={16} />
              <span className="text-sm font-medium">{stat?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-card-foreground">{stat?.value}</h3>
            <p className="text-sm font-medium text-card-foreground">{stat?.title}</p>
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;