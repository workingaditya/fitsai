import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAccessPanel = () => {
  const navigate = useNavigate();

  const pinnedConversations = [
    {
      id: 1,
      title: "Exchange Server Migration Issues",
      lastMessage: "The migration script is failing at step 3...",
      timestamp: "2 hours ago",
      priority: "high",
      participants: 3
    },
    {
      id: 2,
      title: "Network Latency Troubleshooting",
      lastMessage: "Ping tests show 200ms+ latency to DC2",
      timestamp: "4 hours ago",
      priority: "medium",
      participants: 2
    },
    {
      id: 3,
      title: "Security Policy Updates",
      lastMessage: "New compliance requirements for Q4",
      timestamp: "1 day ago",
      priority: "low",
      participants: 5
    }
  ];

  const recentArticles = [
    {
      id: 1,
      title: "Windows Server 2022 Backup Procedures",
      category: "System Administration",
      views: 156,
      lastUpdated: "3 days ago",
      author: "IT Admin"
    },
    {
      id: 2,
      title: "Firewall Configuration Best Practices",
      category: "Security Procedures",
      views: 89,
      lastUpdated: "1 week ago",
      author: "Security Team"
    },
    {
      id: 3,
      title: "Active Directory Group Policy Management",
      category: "Network Troubleshooting",
      views: 234,
      lastUpdated: "2 weeks ago",
      author: "Network Admin"
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: "Review security incident response",
      dueDate: "Today",
      priority: "high",
      assignee: "Security Team"
    },
    {
      id: 2,
      title: "Update knowledge base articles",
      dueDate: "Tomorrow",
      priority: "medium",
      assignee: "Documentation Team"
    },
    {
      id: 3,
      title: "Schedule server maintenance",
      dueDate: "This week",
      priority: "low",
      assignee: "System Admin"
    }
  ];

  const handleConversationClick = (conversationId) => {
    navigate('/ai-chat-interface-conversation-management', { state: { conversationId } });
  };

  const handleArticleClick = (articleId) => {
    navigate('/knowledge-base-management-content-administration', { state: { articleId } });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pinned Conversations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="Pin" size={20} />
            <span>Pinned Conversations</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/conversation-history-search-analytics')}
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {pinnedConversations?.map((conversation) => (
            <div
              key={conversation?.id}
              className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleConversationClick(conversation?.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-card-foreground text-sm line-clamp-1">
                  {conversation?.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  conversation?.priority === 'high' ? 'bg-error/10 text-error' :
                  conversation?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                }`}>
                  {conversation?.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {conversation?.lastMessage}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{conversation?.timestamp}</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={12} />
                  <span>{conversation?.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Articles */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="BookOpen" size={20} />
            <span>Recent Articles</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/knowledge-base-management-content-administration')}
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentArticles?.map((article) => (
            <div
              key={article?.id}
              className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => handleArticleClick(article?.id)}
            >
              <h4 className="font-medium text-card-foreground text-sm line-clamp-1 mb-1">
                {article?.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="bg-muted px-2 py-1 rounded">{article?.category}</span>
                <span>{article?.author}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={12} />
                    <span>{article?.views}</span>
                  </div>
                  <span>{article?.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pending Tasks */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} />
            <span>Pending Tasks</span>
          </h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {pendingTasks?.map((task) => (
            <div
              key={task?.id}
              className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-card-foreground text-sm line-clamp-1">
                  {task?.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task?.priority === 'high' ? 'bg-error/10 text-error' :
                  task?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                }`}>
                  {task?.priority}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Due: {task?.dueDate}</span>
                <span>{task?.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAccessPanel;