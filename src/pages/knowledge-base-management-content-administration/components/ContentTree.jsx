import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentTree = ({ categories, selectedCategory, onCategorySelect, userRole }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root', 'network', 'security']));

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded?.has(nodeId)) {
      newExpanded?.delete(nodeId);
    } else {
      newExpanded?.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node, level = 0) => {
    const hasChildren = node?.children && node?.children?.length > 0;
    const isExpanded = expandedNodes?.has(node?.id);
    const isSelected = selectedCategory?.id === node?.id;

    return (
      <div key={node?.id} className="select-none">
        <div
          className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
            isSelected ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-foreground'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => onCategorySelect(node)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="w-4 h-4 p-0 mr-1 hover:bg-muted"
              onClick={(e) => {
                e?.stopPropagation();
                toggleNode(node?.id);
              }}
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={12} 
              />
            </Button>
          )}
          {!hasChildren && <div className="w-5 mr-1" />}
          
          <Icon 
            name={node?.icon} 
            size={14} 
            className={`mr-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
          />
          
          <span className="text-sm font-medium flex-1 truncate">
            {node?.name}
          </span>
          
          <div className="flex items-center space-x-1 ml-2">
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {node?.articleCount}
            </span>
            {node?.hasUpdates && (
              <div className="w-2 h-2 bg-warning rounded-full" title="Has pending updates" />
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node?.children?.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-card-foreground">Knowledge Categories</h3>
          {userRole === 'admin' && (
            <Button variant="ghost" size="icon" title="Add Category">
              <Icon name="Plus" size={16} />
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      <div className="p-2 overflow-y-auto scrollbar-thin" style={{ height: 'calc(100% - 120px)' }}>
        <div className="space-y-1">
          {categories?.map(category => renderTreeNode(category))}
        </div>
      </div>
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total Articles: 1,247</span>
          <span>Last Sync: 2 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default ContentTree;