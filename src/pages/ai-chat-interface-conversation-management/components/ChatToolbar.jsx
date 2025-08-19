import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ModelSelector from './ModelSelector';

const ChatToolbar = ({ 
  selectedModel, 
  onModelChange, 
  conversation, 
  onExportConversation,
  onShareConversation,
  onArchiveConversation,
  responseMetrics = {},
  userRole = 'admin'
}) => {
  const [showMetrics, setShowMetrics] = useState(false);

  const modelMetrics = {
    'mistral-7b': { avgResponse: 1250, load: 45, status: 'online' },
    'llama-2-13b': { avgResponse: 2100, load: 67, status: 'online' },
    'code-llama-34b': { avgResponse: 3800, load: 89, status: 'online' },
    'vicuna-13b': { avgResponse: 1900, load: 52, status: 'online' },
    'alpaca-7b': { avgResponse: 850, load: 23, status: 'online' },
    'falcon-40b': { avgResponse: 4200, load: 95, status: 'warning' },
    'wizardlm-13b': { avgResponse: 2300, load: 61, status: 'online' },
    'orca-13b': { avgResponse: 2150, load: 58, status: 'online' }
  };

  const currentMetrics = modelMetrics?.[selectedModel] || {};

  const exportOptions = [
    { id: 'pdf', label: 'Export as PDF', icon: 'FileText' },
    { id: 'markdown', label: 'Export as Markdown', icon: 'FileDown' },
    { id: 'json', label: 'Export as JSON', icon: 'Code' }
  ];

  const shareOptions = [
    { id: 'team', label: 'Share with Team', icon: 'Users' },
    { id: 'link', label: 'Copy Share Link', icon: 'Link' },
    { id: 'email', label: 'Send via Email', icon: 'Mail' }
  ];

  const handleExport = (format) => {
    onExportConversation?.(conversation, format);
  };

  const handleShare = (method) => {
    onShareConversation?.(conversation, method);
  };

  return (
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Left Section - Model & Metrics */}
      <div className="flex items-center space-x-4">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          userRole={userRole}
          modelMetrics={modelMetrics}
        />
        
        {/* Performance Metrics */}
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <Icon name="Zap" size={14} className="text-accent" />
            <span className="text-muted-foreground">Response:</span>
            <span className="font-medium text-foreground">
              {currentMetrics?.avgResponse || '--'}ms
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Icon name="Activity" size={14} className="text-warning" />
            <span className="text-muted-foreground">Load:</span>
            <span className="font-medium text-foreground">
              {currentMetrics?.load || '--'}%
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Icon 
              name="Circle" 
              size={8} 
              className={`fill-current ${
                currentMetrics?.status === 'online' ? 'text-success' :
                currentMetrics?.status === 'warning'? 'text-warning' : 'text-error'
              }`} 
            />
            <span className={`text-sm font-medium ${
              currentMetrics?.status === 'online' ? 'text-success' :
              currentMetrics?.status === 'warning'? 'text-warning' : 'text-error'
            }`}>
              {currentMetrics?.status || 'offline'}
            </span>
          </div>
        </div>

        {/* Metrics Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMetrics(!showMetrics)}
          className="text-muted-foreground"
          title="Toggle Metrics"
        >
          <Icon name={showMetrics ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        {/* Quick Actions */}
        <Button
          variant="ghost"
          size="icon"
          title="New Conversation"
          className="text-muted-foreground"
        >
          <Icon name="Plus" size={18} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title="Search Conversations"
          className="text-muted-foreground"
        >
          <Icon name="Search" size={18} />
        </Button>

        {conversation && (
          <>
            {/* Export Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                title="Export Conversation"
                className="text-muted-foreground"
              >
                <Icon name="Download" size={18} />
              </Button>
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {exportOptions?.map(option => (
                    <button
                      key={option?.id}
                      onClick={() => handleExport(option?.id)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name={option?.icon} size={16} />
                      <span>{option?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Share Dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                title="Share Conversation"
                className="text-muted-foreground"
              >
                <Icon name="Share" size={18} />
              </Button>
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {shareOptions?.map(option => (
                    <button
                      key={option?.id}
                      onClick={() => handleShare(option?.id)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name={option?.icon} size={16} />
                      <span>{option?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Archive */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArchiveConversation?.(conversation)}
              title="Archive Conversation"
              className="text-muted-foreground"
            >
              <Icon name="Archive" size={18} />
            </Button>
          </>
        )}

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          title="Chat Settings"
          className="text-muted-foreground"
        >
          <Icon name="Settings" size={18} />
        </Button>
      </div>
      {/* Extended Metrics Panel */}
      {showMetrics && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border p-4 z-40">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {responseMetrics?.totalMessages || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Messages</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {responseMetrics?.avgResponseTime || currentMetrics?.avgResponse || '--'}ms
                </div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {responseMetrics?.successRate || '98.5'}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-1">
                  {currentMetrics?.load || '--'}%
                </div>
                <div className="text-sm text-muted-foreground">Model Load</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatToolbar;