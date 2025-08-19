import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ModelFilterSidebar = ({ 
  selectedCategories, 
  onCategoryChange, 
  selectedStatuses, 
  onStatusChange,
  onClearFilters,
  modelCounts 
}) => {
  const categories = [
    { id: 'language', label: 'Language Models', icon: 'MessageSquare', count: modelCounts?.language || 0 },
    { id: 'code', label: 'Code Generation', icon: 'Code', count: modelCounts?.code || 0 },
    { id: 'chat', label: 'Chat Models', icon: 'MessageCircle', count: modelCounts?.chat || 0 },
    { id: 'instruct', label: 'Instruction Following', icon: 'BookOpen', count: modelCounts?.instruct || 0 },
    { id: 'embedding', label: 'Embedding Models', icon: 'Layers', count: modelCounts?.embedding || 0 }
  ];

  const statuses = [
    { id: 'active', label: 'Active', color: 'text-success', count: modelCounts?.active || 0 },
    { id: 'inactive', label: 'Inactive', color: 'text-muted-foreground', count: modelCounts?.inactive || 0 },
    { id: 'maintenance', label: 'Maintenance', color: 'text-warning', count: modelCounts?.maintenance || 0 },
    { id: 'error', label: 'Error', color: 'text-error', count: modelCounts?.error || 0 }
  ];

  const handleCategoryToggle = (categoryId) => {
    const newCategories = selectedCategories?.includes(categoryId)
      ? selectedCategories?.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newCategories);
  };

  const handleStatusToggle = (statusId) => {
    const newStatuses = selectedStatuses?.includes(statusId)
      ? selectedStatuses?.filter(id => id !== statusId)
      : [...selectedStatuses, statusId];
    onStatusChange(newStatuses);
  };

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-card-foreground"
        >
          Clear All
        </Button>
      </div>
      {/* Model Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
          <Icon name="Layers" size={16} className="mr-2" />
          Model Categories
        </h3>
        <div className="space-y-2">
          {categories?.map((category) => (
            <div key={category?.id} className="flex items-center justify-between">
              <Checkbox
                checked={selectedCategories?.includes(category?.id)}
                onChange={() => handleCategoryToggle(category?.id)}
                label={
                  <div className="flex items-center space-x-2">
                    <Icon name={category?.icon} size={16} className="text-muted-foreground" />
                    <span className="text-sm">{category?.label}</span>
                  </div>
                }
              />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {category?.count}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Status Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
          <Icon name="Activity" size={16} className="mr-2" />
          Status
        </h3>
        <div className="space-y-2">
          {statuses?.map((status) => (
            <div key={status?.id} className="flex items-center justify-between">
              <Checkbox
                checked={selectedStatuses?.includes(status?.id)}
                onChange={() => handleStatusToggle(status?.id)}
                label={
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status?.id === 'active' ? 'bg-success' :
                      status?.id === 'maintenance' ? 'bg-warning' :
                      status?.id === 'error' ? 'bg-error' : 'bg-muted-foreground'
                    }`} />
                    <span className="text-sm">{status?.label}</span>
                  </div>
                }
              />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {status?.count}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center">
          <Icon name="Zap" size={16} className="mr-2" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            iconName="Plus"
            iconPosition="left"
          >
            Deploy New Model
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            iconName="Download"
            iconPosition="left"
          >
            Import Configuration
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            iconName="Upload"
            iconPosition="left"
          >
            Export Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelFilterSidebar;