import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KnowledgePanel = ({ 
  conversation, 
  relatedArticles = [], 
  onArticleClick,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [activeTab, setActiveTab] = useState('related');

  const tabs = [
    { id: 'related', label: 'Related', icon: 'BookOpen' },
    { id: 'templates', label: 'Templates', icon: 'FileText' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const conversationTemplates = [
    {
      id: 1,
      title: 'Network Connectivity Issues',
      description: 'Standard troubleshooting steps for network problems',
      category: 'network',
      usage: 156
    },
    {
      id: 2,
      title: 'Security Incident Response',
      description: 'Step-by-step security incident handling procedure',
      category: 'security',
      usage: 89
    },
    {
      id: 3,
      title: 'Server Performance Analysis',
      description: 'Comprehensive server health check and optimization',
      category: 'system',
      usage: 134
    },
    {
      id: 4,
      title: 'User Account Management',
      description: 'Account creation, modification, and access control',
      category: 'admin',
      usage: 203
    }
  ];

  const recentHistory = [
    {
      id: 1,
      title: 'VPN Connection Troubleshooting',
      timestamp: new Date(Date.now() - 3600000),
      category: 'network',
      status: 'resolved'
    },
    {
      id: 2,
      title: 'Database Backup Procedure',
      timestamp: new Date(Date.now() - 7200000),
      category: 'system',
      status: 'active'
    },
    {
      id: 3,
      title: 'Email Server Configuration',
      timestamp: new Date(Date.now() - 10800000),
      category: 'system',
      status: 'resolved'
    }
  ];

  const mockRelatedArticles = [
    {
      id: 1,
      title: 'Network Troubleshooting Best Practices',
      summary: 'Comprehensive guide for diagnosing and resolving network connectivity issues in enterprise environments.',
      category: 'network',
      lastUpdated: new Date(Date.now() - 86400000),
      relevance: 95,
      readTime: '8 min'
    },
    {
      id: 2,
      title: 'Firewall Configuration Guidelines',
      summary: 'Step-by-step instructions for configuring enterprise firewalls and security policies.',
      category: 'security',
      lastUpdated: new Date(Date.now() - 172800000),
      relevance: 87,
      readTime: '12 min'
    },
    {
      id: 3,
      title: 'Server Monitoring and Alerts',
      summary: 'Setting up comprehensive monitoring systems for server health and performance tracking.',
      category: 'system',
      lastUpdated: new Date(Date.now() - 259200000),
      relevance: 82,
      readTime: '15 min'
    }
  ];

  const articles = relatedArticles?.length > 0 ? relatedArticles : mockRelatedArticles;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'network': return 'Wifi';
      case 'security': return 'Shield';
      case 'system': return 'Server';
      case 'admin': return 'Users';
      default: return 'FileText';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'network': return 'text-blue-600 bg-blue-100';
      case 'security': return 'text-red-600 bg-red-100';
      case 'system': return 'text-green-600 bg-green-100';
      case 'admin': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <Icon name="ChevronLeft" size={16} />
        </Button>
        <div className="flex flex-col space-y-3">
          {tabs?.map(tab => (
            <Button
              key={tab?.id}
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab(tab?.id)}
              className={activeTab === tab?.id ? 'bg-primary/10 text-primary' : ''}
              title={tab?.label}
            >
              <Icon name={tab?.icon} size={16} />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-card-foreground">Knowledge Assistant</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'related' && (
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">
                Related Articles
              </h4>
              <p className="text-xs text-muted-foreground">
                Knowledge base articles relevant to your current conversation
              </p>
            </div>
            
            <div className="space-y-3">
              {articles?.map(article => (
                <div
                  key={article?.id}
                  onClick={() => onArticleClick?.(article)}
                  className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-card-foreground line-clamp-2">
                      {article?.title}
                    </h5>
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      <Icon name="TrendingUp" size={12} className="text-success" />
                      <span className="text-xs text-success">{article?.relevance}%</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {article?.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(article?.category)}`}>
                        <Icon name={getCategoryIcon(article?.category)} size={10} className="mr-1" />
                        {article?.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {article?.readTime}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(article?.lastUpdated)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">
                Conversation Templates
              </h4>
              <p className="text-xs text-muted-foreground">
                Pre-built conversation starters for common IT scenarios
              </p>
            </div>
            
            <div className="space-y-3">
              {conversationTemplates?.map(template => (
                <div
                  key={template?.id}
                  className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-card-foreground">
                      {template?.title}
                    </h5>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Icon name="Users" size={10} />
                      <span>{template?.usage}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {template?.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(template?.category)}`}>
                      <Icon name={getCategoryIcon(template?.category)} size={10} className="mr-1" />
                      {template?.category}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs h-6">
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">
                Recent Conversations
              </h4>
              <p className="text-xs text-muted-foreground">
                Your recent AI assistant interactions
              </p>
            </div>
            
            <div className="space-y-3">
              {recentHistory?.map(item => (
                <div
                  key={item?.id}
                  className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-card-foreground">
                      {item?.title}
                    </h5>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item?.status === 'resolved' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {item?.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(item?.category)}`}>
                      <Icon name={getCategoryIcon(item?.category)} size={10} className="mr-1" />
                      {item?.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(item?.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Knowledge Base</span>
          <div className="flex items-center space-x-1">
            <Icon name="Database" size={12} />
            <span>2.3k articles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePanel;