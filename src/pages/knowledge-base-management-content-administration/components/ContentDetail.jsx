import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ContentDetail = ({ article, onClose, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  if (!article) {
    return (
      <div className="h-full bg-card border-l border-border flex items-center justify-center">
        <div className="text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select an article to view details</p>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Under Review' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const categoryOptions = [
    { value: 'network', label: 'Network Troubleshooting' },
    { value: 'security', label: 'Security Procedures' },
    { value: 'system', label: 'System Administration' },
    { value: 'compliance', label: 'Compliance & Policies' }
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

  const tabs = [
    { id: 'preview', label: 'Preview', icon: 'Eye' },
    { id: 'metadata', label: 'Metadata', icon: 'Settings' },
    { id: 'versions', label: 'Versions', icon: 'GitBranch' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const renderPreviewTab = () => (
    <div className="p-6 space-y-6">
      <div className="prose prose-sm max-w-none">
        <h1 className="text-2xl font-bold text-card-foreground mb-4">
          {article?.title}
        </h1>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
          <span>By {article?.author}</span>
          <span>•</span>
          <span>Last updated {new Date(article.lastModified)?.toLocaleDateString()}</span>
          <span>•</span>
          <span>Version {article?.version}</span>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <p className="text-muted-foreground">{article?.description}</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Overview</h2>
          <p>This comprehensive guide covers the essential procedures for network troubleshooting in enterprise environments. Follow these step-by-step instructions to diagnose and resolve common connectivity issues.</p>
          
          <h3 className="text-md font-semibold">Prerequisites</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Administrative access to network equipment</li>
            <li>Network monitoring tools installed</li>
            <li>Basic understanding of TCP/IP protocols</li>
          </ul>
          
          <h3 className="text-md font-semibold">Step-by-Step Procedure</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Initial Assessment</strong>
              <p className="text-muted-foreground mt-1">Begin by gathering information about the network issue from the user or monitoring system.</p>
            </li>
            <li>
              <strong>Network Connectivity Test</strong>
              <p className="text-muted-foreground mt-1">Use ping and traceroute commands to test basic connectivity.</p>
            </li>
            <li>
              <strong>Hardware Verification</strong>
              <p className="text-muted-foreground mt-1">Check physical connections, cable integrity, and device status indicators.</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );

  const renderMetadataTab = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Title"
          value={article?.title}
          disabled={!isEditing}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={article?.status}
            disabled={!isEditing}
          />
          
          <Select
            label="Priority"
            options={priorityOptions}
            value={article?.priority}
            disabled={!isEditing}
          />
        </div>
        
        <Select
          label="Category"
          options={categoryOptions}
          value={article?.category}
          disabled={!isEditing}
        />
        
        <Input
          label="Description"
          value={article?.description}
          disabled={!isEditing}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Author"
            value={article?.author}
            disabled
          />
          
          <Input
            label="Version"
            value={article?.version}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">Tags</label>
          <div className="flex flex-wrap gap-2">
            {article?.tags?.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                {tag}
                {isEditing && (
                  <button className="ml-1 text-error hover:text-error/80">
                    <Icon name="X" size={12} />
                  </button>
                )}
              </span>
            ))}
            {isEditing && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Icon name="Plus" size={12} className="mr-1" />
                Add Tag
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">Permissions</label>
          <div className="space-y-2">
            <Checkbox
              label="Visible to all IT staff"
              checked
              disabled={!isEditing}
            />
            <Checkbox
              label="Allow comments"
              checked
              disabled={!isEditing}
            />
            <Checkbox
              label="Enable version tracking"
              checked
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderVersionsTab = () => (
    <div className="p-6">
      <div className="space-y-4">
        {[
          { version: '2.1', date: '2025-01-10', author: 'John Smith', changes: 'Updated security procedures', current: true },
          { version: '2.0', date: '2024-12-15', author: 'Jane Doe', changes: 'Major revision with new troubleshooting steps', current: false },
          { version: '1.5', date: '2024-11-20', author: 'Mike Johnson', changes: 'Added network monitoring section', current: false },
          { version: '1.0', date: '2024-10-01', author: 'John Smith', changes: 'Initial version', current: false }
        ]?.map((version) => (
          <div key={version?.version} className={`p-4 border border-border rounded-lg ${version?.current ? 'bg-primary/5 border-primary' : 'bg-card'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-card-foreground">v{version?.version}</span>
                {version?.current && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    Current
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Eye" size={14} className="mr-1" />
                  View
                </Button>
                {!version?.current && userRole === 'admin' && (
                  <Button variant="ghost" size="sm">
                    <Icon name="RotateCcw" size={14} className="mr-1" />
                    Restore
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{version?.changes}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>By {version?.author}</span>
              <span>•</span>
              <span>{new Date(version.date)?.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold text-card-foreground">{article?.views}</p>
            </div>
            <Icon name="Eye" size={24} className="text-muted-foreground" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-card-foreground">127</p>
            </div>
            <Icon name="TrendingUp" size={24} className="text-success" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <p className="text-2xl font-bold text-card-foreground">4.8</p>
            </div>
            <Icon name="Star" size={24} className="text-warning" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Comments</p>
              <p className="text-2xl font-bold text-card-foreground">23</p>
            </div>
            <Icon name="MessageSquare" size={24} className="text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-card-foreground mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {[
            { action: 'Viewed', user: 'Sarah Wilson', time: '2 hours ago' },
            { action: 'Commented', user: 'Mike Chen', time: '5 hours ago' },
            { action: 'Viewed', user: 'David Brown', time: '1 day ago' },
            { action: 'Rated 5 stars', user: 'Lisa Garcia', time: '2 days ago' }
          ]?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={14} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-card-foreground">{activity?.user}</p>
                  <p className="text-xs text-muted-foreground">{activity?.action}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{activity?.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={20} className="text-muted-foreground" />
            <h3 className="font-semibold text-card-foreground truncate">
              Article Details
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article?.status)}`}>
              {article?.status}
            </span>
            <span className="text-xs text-muted-foreground">
              v{article?.version}
            </span>
          </div>
          
          {userRole === 'admin' && (
            <div className="flex items-center space-x-2">
              <Button
                variant={isEditing ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Icon name={isEditing ? 'Check' : 'Edit'} size={14} className="mr-1" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  <Icon name="X" size={14} className="mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1 p-1">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              className="flex items-center space-x-2"
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'preview' && renderPreviewTab()}
        {activeTab === 'metadata' && renderMetadataTab()}
        {activeTab === 'versions' && renderVersionsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default ContentDetail;