import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserFilters = ({ onFilterChange, savedFilters, onSaveFilter, onLoadFilter }) => {
  const [activeFilters, setActiveFilters] = useState({
    departments: [],
    roles: [],
    status: [],
    lastLogin: '',
    searchTerm: ''
  });

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const departments = [
    { id: 'it-infrastructure', name: 'IT Infrastructure', count: 45 },
    { id: 'security', name: 'Security', count: 23 },
    { id: 'network', name: 'Network Operations', count: 31 },
    { id: 'helpdesk', name: 'Help Desk', count: 67 },
    { id: 'database', name: 'Database Administration', count: 18 },
    { id: 'devops', name: 'DevOps', count: 29 },
    { id: 'compliance', name: 'Compliance', count: 12 }
  ];

  const roles = [
    { id: 'admin', name: 'System Administrator', count: 15 },
    { id: 'senior-tech', name: 'Senior Technician', count: 34 },
    { id: 'technician', name: 'IT Technician', count: 89 },
    { id: 'specialist', name: 'IT Specialist', count: 56 },
    { id: 'manager', name: 'IT Manager', count: 23 },
    { id: 'analyst', name: 'Security Analyst', count: 18 },
    { id: 'engineer', name: 'Network Engineer', count: 27 }
  ];

  const statusOptions = [
    { id: 'active', name: 'Active', count: 234, color: 'text-success' },
    { id: 'inactive', name: 'Inactive', count: 23, color: 'text-muted-foreground' },
    { id: 'locked', name: 'Locked', count: 8, color: 'text-error' },
    { id: 'pending', name: 'Pending Activation', count: 12, color: 'text-warning' }
  ];

  const handleDepartmentChange = (deptId, checked) => {
    const newDepartments = checked 
      ? [...activeFilters?.departments, deptId]
      : activeFilters?.departments?.filter(id => id !== deptId);
    
    const newFilters = { ...activeFilters, departments: newDepartments };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRoleChange = (roleId, checked) => {
    const newRoles = checked 
      ? [...activeFilters?.roles, roleId]
      : activeFilters?.roles?.filter(id => id !== roleId);
    
    const newFilters = { ...activeFilters, roles: newRoles };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (statusId, checked) => {
    const newStatus = checked 
      ? [...activeFilters?.status, statusId]
      : activeFilters?.status?.filter(id => id !== statusId);
    
    const newFilters = { ...activeFilters, status: newStatus };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const newFilters = { ...activeFilters, searchTerm: e?.target?.value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      departments: [],
      roles: [],
      status: [],
      lastLogin: '',
      searchTerm: ''
    };
    setActiveFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const saveCurrentFilter = () => {
    if (filterName?.trim()) {
      onSaveFilter(filterName, activeFilters);
      setFilterName('');
      setShowSaveDialog(false);
    }
  };

  const getActiveFilterCount = () => {
    return activeFilters?.departments?.length + 
           activeFilters?.roles?.length + 
           activeFilters?.status?.length + 
           (activeFilters?.searchTerm ? 1 : 0);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-card-foreground">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-muted-foreground"
        >
          Clear All
        </Button>
      </div>
      {/* Search */}
      <div>
        <Input
          type="search"
          placeholder="Search users, emails, or LDAP attributes..."
          value={activeFilters?.searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>
      {/* Saved Filters */}
      {savedFilters?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-3">Saved Filters</h4>
          <div className="space-y-2">
            {savedFilters?.map((filter) => (
              <Button
                key={filter?.id}
                variant="outline"
                size="sm"
                onClick={() => onLoadFilter(filter)}
                className="w-full justify-start"
              >
                <Icon name="Bookmark" size={14} className="mr-2" />
                {filter?.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Save Current Filter */}
      <div>
        {!showSaveDialog ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="w-full"
            disabled={getActiveFilterCount() === 0}
          >
            <Icon name="Plus" size={14} className="mr-2" />
            Save Current Filter
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e?.target?.value)}
            />
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={saveCurrentFilter}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Department Filter */}
      <div>
        <h4 className="text-sm font-medium text-card-foreground mb-3">Departments</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {departments?.map((dept) => (
            <div key={dept?.id} className="flex items-center justify-between">
              <Checkbox
                label={dept?.name}
                checked={activeFilters?.departments?.includes(dept?.id)}
                onChange={(e) => handleDepartmentChange(dept?.id, e?.target?.checked)}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">{dept?.count}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Role Filter */}
      <div>
        <h4 className="text-sm font-medium text-card-foreground mb-3">Roles</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {roles?.map((role) => (
            <div key={role?.id} className="flex items-center justify-between">
              <Checkbox
                label={role?.name}
                checked={activeFilters?.roles?.includes(role?.id)}
                onChange={(e) => handleRoleChange(role?.id, e?.target?.checked)}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">{role?.count}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Status Filter */}
      <div>
        <h4 className="text-sm font-medium text-card-foreground mb-3">Status</h4>
        <div className="space-y-2">
          {statusOptions?.map((status) => (
            <div key={status?.id} className="flex items-center justify-between">
              <Checkbox
                label={
                  <span className={status?.color}>
                    {status?.name}
                  </span>
                }
                checked={activeFilters?.status?.includes(status?.id)}
                onChange={(e) => handleStatusChange(status?.id, e?.target?.checked)}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">{status?.count}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="UserPlus" size={14} className="mr-2" />
            Add New User
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="Upload" size={14} className="mr-2" />
            Bulk Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Sync LDAP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;