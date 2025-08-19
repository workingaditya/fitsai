import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ContentList = ({ articles, selectedArticles, onArticleSelect, onArticleToggle, userRole, viewMode, onViewModeChange }) => {
  const [sortBy, setSortBy] = useState('modified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'modified', label: 'Last Modified' },
    { value: 'created', label: 'Created Date' },
    { value: 'views', label: 'View Count' },
    { value: 'version', label: 'Version' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Under Review' },
    { value: 'archived', label: 'Archived' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-success bg-success/10';
      case 'draft': return 'text-warning bg-warning/10';
      case 'review': return 'text-accent bg-accent/10';
      case 'archived': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {articles?.map((article) => (
        <div
          key={article?.id}
          className={`bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
            selectedArticles?.includes(article?.id) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onArticleSelect(article)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedArticles?.includes(article?.id)}
                onChange={(e) => {
                  e?.stopPropagation();
                  onArticleToggle(article?.id);
                }}
                className="mt-0.5"
              />
              <Icon name={article?.type === 'procedure' ? 'FileText' : article?.type === 'guide' ? 'BookOpen' : 'HelpCircle'} size={16} className="text-muted-foreground" />
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article?.status)}`}>
              {article?.status}
            </span>
          </div>
          
          <h4 className="font-semibold text-card-foreground mb-2 line-clamp-2">
            {article?.title}
          </h4>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {article?.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>By {article?.author}</span>
            <span>v{article?.version}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(article?.lastModified)}</span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Icon name="Eye" size={12} className="mr-1" />
                {article?.views}
              </span>
              <Icon name={article?.priority} size={12} className={getPriorityColor(article?.priority)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="divide-y divide-border">
      {articles?.map((article) => (
        <div
          key={article?.id}
          className={`flex items-center p-4 hover:bg-muted/30 cursor-pointer transition-colors ${
            selectedArticles?.includes(article?.id) ? 'bg-primary/5' : ''
          }`}
          onClick={() => onArticleSelect(article)}
        >
          <Checkbox
            checked={selectedArticles?.includes(article?.id)}
            onChange={(e) => {
              e?.stopPropagation();
              onArticleToggle(article?.id);
            }}
            className="mr-3"
          />
          
          <Icon name={article?.type === 'procedure' ? 'FileText' : article?.type === 'guide' ? 'BookOpen' : 'HelpCircle'} size={16} className="text-muted-foreground mr-3" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-card-foreground truncate">
                {article?.title}
              </h4>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(article?.status)}`}>
                {article?.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {article?.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span className="w-24 truncate">{article?.author}</span>
            <span className="w-20">{formatDate(article?.lastModified)}</span>
            <span className="w-16">v{article?.version}</span>
            <div className="flex items-center space-x-1 w-16">
              <Icon name="Eye" size={12} />
              <span>{article?.views}</span>
            </div>
            <Icon name={article?.priority} size={16} className={getPriorityColor(article?.priority)} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-background">
      {/* Toolbar */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Knowledge Articles
            </h2>
            <span className="text-sm text-muted-foreground">
              {articles?.length} articles
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-40"
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
          </Button>
          
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter status"
            className="w-40"
          />
          
          <div className="flex-1" />
          
          {selectedArticles?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedArticles?.length} selected
              </span>
              {userRole === 'admin' && (
                <>
                  <Button variant="outline" size="sm">
                    <Icon name="Edit" size={14} className="mr-1" />
                    Bulk Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="Archive" size={14} className="mr-1" />
                    Archive
                  </Button>
                </>
              )}
            </div>
          )}
          
          {userRole === 'admin' && (
            <Button variant="default" size="sm">
              <Icon name="Plus" size={14} className="mr-1" />
              New Article
            </Button>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="overflow-y-auto scrollbar-thin" style={{ height: 'calc(100% - 140px)' }}>
        {viewMode === 'grid' ? renderGridView() : renderListView()}
      </div>
    </div>
  );
};

export default ContentList;