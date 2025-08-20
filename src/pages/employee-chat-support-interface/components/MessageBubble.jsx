import React from 'react';
import { Bot, User, AlertCircle } from 'lucide-react';

export default function MessageBubble({ message, onSuggestionClick }) {
  const isUser = message?.type === 'user';
  const isSystem = message?.type === 'system';
  
  const getIcon = () => {
    if (isUser) return User;
    if (isSystem) return AlertCircle;
    return Bot;
  };

  const getIconBg = () => {
    if (isUser) return 'bg-primary';
    if (isSystem) return 'bg-warning/10';
    return 'bg-primary/10';
  };

  const getIconColor = () => {
    if (isUser) return 'text-primary-foreground';
    if (isSystem) return 'text-warning';
    return 'text-primary';
  };

  const getBubbleStyle = () => {
    if (isUser) return 'bg-primary text-primary-foreground';
    if (isSystem) return 'bg-warning/10 text-warning border border-warning/40';
    return 'bg-muted text-foreground';
  };

  const getLabel = () => {
    if (isUser) return 'You';
    if (isSystem) return 'System';
    return 'IT Assistant';
  };

  const IconComponent = getIcon();

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getIconBg()}`}>
              <IconComponent className={`w-4 h-4 ${getIconColor()}`} />
            </div>
            <span className="text-sm text-text-secondary">
              {getLabel()}
            </span>
          </div>
        )}
        
        <div className={`rounded-2xl px-4 py-3 ${getBubbleStyle()}`}>
          <div className="whitespace-pre-line text-sm">{message?.content}</div>
        </div>
        
        {message?.suggestions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message?.suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-3 py-1 bg-background border border-border rounded-full text-sm text-foreground hover:bg-muted hover:border-border transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div className="mt-1 text-xs text-muted-foreground">
          {new Date(message?.timestamp)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}