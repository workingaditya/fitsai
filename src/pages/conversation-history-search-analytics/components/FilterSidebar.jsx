import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  onSaveFilter, 
  onLoadFilter, 
  savedFilters,
  userRole 
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'pending', label: 'Pending' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'archived', label: 'Archived' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'network', label: 'Network Troubleshooting' },
    { value: 'security', label: 'Security Procedures' },
    { value: 'system', label: 'System Administration' },
    { value: 'compliance', label: 'Compliance & Policies' },
    { value: 'hardware', label: 'Hardware Issues' },
    { value: 'software', label: 'Software Support' },
    { value: 'database', label: 'Database Management' },
    { value: 'backup', label: 'Backup & Recovery' }
  ];

  const llmModelOptions = [
    { value: 'all', label: 'All Models' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'llama', label: 'Llama' },
    { value: 'code-llama', label: 'Code-Llama' },
    { value: 'vicuna', label: 'Vicuna' },
    { value: 'alpaca', label: 'Alpaca' },
    { value: 'falcon', label: 'Falcon' },
    { value: 'wizardlm', label: 'WizardLM' },
    { value: 'orca', label: 'Orca' }
  ];

  const userOptions = userRole === 'admin' ? [
    { value: 'all', label: 'All Users' },
    { value: 'john.smith', label: 'John Smith' },
    { value: 'sarah.johnson', label: 'Sarah Johnson' },
    { value: 'mike.davis', label: 'Mike Davis' },
    { value: 'lisa.wilson', label: 'Lisa Wilson' },
    { value: 'david.brown', label: 'David Brown' },
    { value: 'emma.taylor', label: 'Emma Taylor' }
  ] : [
    { value: 'me', label: 'My Conversations' },
    { value: 'team', label: 'Team Conversations' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSaveFilter = () => {
    if (filterName?.trim()) {
      onSaveFilter(filterName, filters);
      setFilterName('');
      setShowSaveDialog(false);
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      dateRange: 'last7days',
      startDate: '',
      endDate: '',
      user: userRole === 'admin' ? 'all' : 'me',
      status: 'all',
      category: 'all',
      llmModel: 'all'
    });
  };

  const activeFiltersCount = Object.values(filters)?.filter(value => 
    value && value !== 'all' && value !== 'last7days' && value !== (userRole === 'admin' ? 'all' : 'me')
  )?.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear All
        </Button>
      </div>
      {/* Search Query */}
      <div>
        <Input
          label="Search Conversations"
          type="search"
          placeholder="Search by topic, content, or keywords..."
          value={filters?.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Date Range */}
      <div>
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
        
        {filters?.dateRange === 'custom' && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={filters?.startDate}
              onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters?.endDate}
              onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
            />
          </div>
        )}
      </div>
      {/* User Filter */}
      <div>
        <Select
          label="User"
          options={userOptions}
          value={filters?.user}
          onChange={(value) => handleFilterChange('user', value)}
        />
      </div>
      {/* Status Filter */}
      <div>
        <Select
          label="Resolution Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />
      </div>
      {/* Category Filter */}
      <div>
        <Select
          label="Knowledge Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => handleFilterChange('category', value)}
          searchable
        />
      </div>
      {/* LLM Model Filter */}
      <div>
        <Select
          label="LLM Model"
          options={llmModelOptions}
          value={filters?.llmModel}
          onChange={(value) => handleFilterChange('llmModel', value)}
        />
      </div>
      {/* Saved Filters */}
      {savedFilters?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Saved Filters</h4>
          <div className="space-y-2">
            {savedFilters?.map((savedFilter) => (
              <button
                key={savedFilter?.id}
                onClick={() => onLoadFilter(savedFilter)}
                className="w-full flex items-center justify-between p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Bookmark" size={14} className="text-gray-500" />
                  <span className="text-gray-900">{savedFilter?.name}</span>
                </div>
                <Icon name="ChevronRight" size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Save Current Filter */}
      <div className="pt-4 border-t border-gray-200">
        {!showSaveDialog ? (
          <Button
            variant="outline"
            onClick={() => setShowSaveDialog(true)}
            className="w-full"
            iconName="Save"
            iconPosition="left"
          >
            Save Current Filter
          </Button>
        ) : (
          <div className="space-y-3">
            <Input
              label="Filter Name"
              type="text"
              placeholder="Enter filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e?.target?.value)}
            />
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveFilter}
                disabled={!filterName?.trim()}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSaveDialog(false);
                  setFilterName('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Quick Stats */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Conversations</span>
            <span className="font-medium text-gray-900">1,247</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Week</span>
            <span className="font-medium text-gray-900">89</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Resolution Rate</span>
            <span className="font-medium text-green-600">94.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;