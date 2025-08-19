import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationSidebar = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation, 
  onNewConversation,
  onDeleteConversation,
  userRole = 'admin'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const periods = [
    { value: 'all', label: 'All Conversations' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Previous 7 days' },
    { value: 'month', label: 'This Month' }
  ];

  const filteredConversations = conversations?.filter(conv => {
    const matchesSearch = conv?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         conv?.preview?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const now = new Date();
    const convDate = new Date(conv.timestamp);
    
    switch (selectedPeriod) {
      case 'today':
        return convDate?.toDateString() === now?.toDateString();
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday?.setDate(yesterday?.getDate() - 1);
        return convDate?.toDateString() === yesterday?.toDateString();
      case 'week':
        const weekAgo = new Date(now);
        weekAgo?.setDate(weekAgo?.getDate() - 7);
        return convDate >= weekAgo;
      case 'month':
        return convDate?.getMonth() === now?.getMonth() && convDate?.getFullYear() === now?.getFullYear();
      default:
        return true;
    }
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Conversations</h2>
          <Button
            variant="default"
            size="sm"
            onClick={onNewConversation}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            New Chat
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Period Filter */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e?.target?.value)}
          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {periods?.map(period => (
            <option key={period?.value} value={period?.value}>
              {period?.label}
            </option>
          ))}
        </select>
      </div>
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredConversations?.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Start a new conversation to get help'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations?.map((conversation) => (
              <div
                key={conversation?.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 group ${
                  activeConversation?.id === conversation?.id
                    ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon 
                        name={conversation?.category === 'security' ? 'Shield' : 
                              conversation?.category === 'network' ? 'Wifi' :
                              conversation?.category === 'system' ? 'Server' : 'MessageSquare'} 
                        size={14} 
                        className="text-muted-foreground flex-shrink-0" 
                      />
                      <h3 className="text-sm font-medium text-card-foreground truncate">
                        {conversation?.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {conversation?.preview}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(conversation?.timestamp)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          conversation?.status === 'resolved' ? 'bg-success/20 text-success' :
                          conversation?.status === 'active'? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning'
                        }`}>
                          {conversation?.status}
                        </span>
                        {conversation?.messageCount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {conversation?.messageCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onDeleteConversation(conversation?.id);
                      }}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Icon name="Trash2" size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredConversations?.length} conversations</span>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} />
            <span>Last sync: 2m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;