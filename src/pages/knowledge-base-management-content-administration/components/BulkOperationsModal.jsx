import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkOperationsModal = ({ isOpen, onClose, selectedArticles, onApply }) => {
  const [operation, setOperation] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [addTags, setAddTags] = useState('');
  const [removeTags, setRemoveTags] = useState('');
  const [updatePermissions, setUpdatePermissions] = useState(false);

  if (!isOpen) return null;

  const operationOptions = [
    { value: 'status', label: 'Change Status' },
    { value: 'category', label: 'Move to Category' },
    { value: 'tags', label: 'Manage Tags' },
    { value: 'permissions', label: 'Update Permissions' },
    { value: 'archive', label: 'Archive Articles' },
    { value: 'delete', label: 'Delete Articles' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Under Review' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  const categoryOptions = [
    { value: 'network', label: 'Network Troubleshooting' },
    { value: 'security', label: 'Security Procedures' },
    { value: 'system', label: 'System Administration' },
    { value: 'compliance', label: 'Compliance & Policies' }
  ];

  const handleApply = () => {
    const changes = {
      operation,
      newStatus,
      newCategory,
      addTags: addTags?.split(',')?.map(tag => tag?.trim())?.filter(Boolean),
      removeTags: removeTags?.split(',')?.map(tag => tag?.trim())?.filter(Boolean),
      updatePermissions
    };
    onApply(changes);
    onClose();
  };

  const renderOperationFields = () => {
    switch (operation) {
      case 'status':
        return (
          <Select
            label="New Status"
            options={statusOptions}
            value={newStatus}
            onChange={setNewStatus}
            required
          />
        );
      
      case 'category':
        return (
          <Select
            label="Target Category"
            options={categoryOptions}
            value={newCategory}
            onChange={setNewCategory}
            required
          />
        );
      
      case 'tags':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Add Tags (comma-separated)
              </label>
              <input
                type="text"
                value={addTags}
                onChange={(e) => setAddTags(e?.target?.value)}
                placeholder="network, troubleshooting, guide"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Remove Tags (comma-separated)
              </label>
              <input
                type="text"
                value={removeTags}
                onChange={(e) => setRemoveTags(e?.target?.value)}
                placeholder="outdated, deprecated"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );
      
      case 'permissions':
        return (
          <div className="space-y-3">
            <Checkbox
              label="Make visible to all IT staff"
              checked={updatePermissions}
              onChange={(e) => setUpdatePermissions(e?.target?.checked)}
            />
            <Checkbox
              label="Enable comments"
             
            />
            <Checkbox
              label="Allow version tracking"
              checked
            />
          </div>
        );
      
      case 'archive':
        return (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning">Archive Articles</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Archived articles will be hidden from search results but remain accessible to administrators.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'delete':
        return (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
              <div>
                <h4 className="font-medium text-error">Delete Articles</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone. All versions and associated data will be permanently removed.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">
              Bulk Operations
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{selectedArticles?.length}</span> articles selected
              </p>
            </div>
            
            <Select
              label="Select Operation"
              options={operationOptions}
              value={operation}
              onChange={setOperation}
              placeholder="Choose an operation..."
              required
            />
            
            {operation && renderOperationFields()}
          </div>
          
          <div className="flex items-center justify-end space-x-3 mt-8">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={operation === 'delete' ? 'destructive' : 'default'}
              onClick={handleApply}
              disabled={!operation}
            >
              <Icon name="Check" size={14} className="mr-1" />
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsModal;