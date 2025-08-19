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
    if (isUser) return 'bg-blue-600';
    if (isSystem) return 'bg-yellow-100';
    return 'bg-blue-100';
  };

  const getIconColor = () => {
    if (isUser) return 'text-white';
    if (isSystem) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getBubbleStyle = () => {
    if (isUser) return 'bg-blue-600 text-white';
    if (isSystem) return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
    return 'bg-gray-100 text-gray-900';
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
            <span className="text-sm text-gray-500">
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
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div className="mt-1 text-xs text-gray-400">
          {new Date(message?.timestamp)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}