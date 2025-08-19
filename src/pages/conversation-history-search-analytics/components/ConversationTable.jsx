import React, { useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationTable = ({ 
  conversations, 
  selectedConversations, 
  onSelectConversation, 
  onSelectAll, 
  onViewConversation, 
  onExportConversation,
  userRole 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const sortedConversations = useMemo(() => {
    const sortableConversations = [...conversations];
    if (sortConfig?.key) {
      sortableConversations?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableConversations;
  }, [conversations, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      resolved: { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
      escalated: { color: 'bg-red-100 text-red-800', icon: 'AlertTriangle' },
      archived: { color: 'bg-gray-100 text-gray-800', icon: 'Archive' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date?.toLocaleDateString('en-US', { 
        weekday: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const Row = ({ index, style }) => {
    const conversation = sortedConversations?.[index];
    const isSelected = selectedConversations?.includes(conversation?.id);
    
    return (
      <div style={style} className={`flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
        <div className="w-8 flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectConversation(conversation?.id)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2 text-sm text-gray-900">
            {formatTimestamp(conversation?.timestamp)}
          </div>
          
          <div className="col-span-2 text-sm text-gray-900">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={12} color="white" />
              </div>
              <span className="truncate">{conversation?.user}</span>
            </div>
          </div>
          
          <div className="col-span-3 text-sm text-gray-900">
            <div className="truncate font-medium">{conversation?.topic}</div>
            <div className="text-xs text-gray-500 truncate">{conversation?.summary}</div>
          </div>
          
          <div className="col-span-1 text-sm">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {conversation?.llmModel}
            </span>
          </div>
          
          <div className="col-span-1">
            {getStatusBadge(conversation?.status)}
          </div>
          
          <div className="col-span-2 text-sm">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
              <Icon name="Tag" size={10} className="mr-1" />
              {conversation?.category}
            </span>
          </div>
          
          <div className="col-span-1 flex items-center justify-end space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewConversation(conversation)}
              className="h-8 w-8"
            >
              <Icon name="Eye" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onExportConversation(conversation)}
              className="h-8 w-8"
            >
              <Icon name="Download" size={14} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const allSelected = selectedConversations?.length === conversations?.length;
  const someSelected = selectedConversations?.length > 0 && selectedConversations?.length < conversations?.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              ref={input => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={onSelectAll}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          
          <div className="flex-1 grid grid-cols-12 gap-4 items-center">
            <button
              onClick={() => handleSort('timestamp')}
              className="col-span-2 flex items-center space-x-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700"
            >
              <span>Timestamp</span>
              <Icon 
                name={sortConfig?.key === 'timestamp' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={12} 
              />
            </button>
            
            <button
              onClick={() => handleSort('user')}
              className="col-span-2 flex items-center space-x-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700"
            >
              <span>User</span>
              <Icon 
                name={sortConfig?.key === 'user' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={12} 
              />
            </button>
            
            <button
              onClick={() => handleSort('topic')}
              className="col-span-3 flex items-center space-x-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700"
            >
              <span>Topic & Summary</span>
              <Icon 
                name={sortConfig?.key === 'topic' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={12} 
              />
            </button>
            
            <div className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              LLM Model
            </div>
            
            <button
              onClick={() => handleSort('status')}
              className="col-span-1 flex items-center space-x-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700"
            >
              <span>Status</span>
              <Icon 
                name={sortConfig?.key === 'status' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={12} 
              />
            </button>
            
            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Category
            </div>
            
            <div className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">
              Actions
            </div>
          </div>
        </div>
      </div>
      {/* Virtual List */}
      <div className="h-96">
        <List
          height={384}
          itemCount={sortedConversations?.length}
          itemSize={72}
          itemData={sortedConversations}
        >
          {Row}
        </List>
      </div>
      {/* Table Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {sortedConversations?.length} of {conversations?.length} conversations
            {selectedConversations?.length > 0 && (
              <span className="ml-2 text-primary font-medium">
                ({selectedConversations?.length} selected)
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="ChevronLeft" size={16} className="mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <Icon name="ChevronRight" size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationTable;