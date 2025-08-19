import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserTable = ({ users, onUserSelect, selectedUsers, onBulkAction, onUserEdit }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectAll, setSelectAll] = useState(false);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      onUserSelect(users?.map(user => user?.id));
    } else {
      onUserSelect([]);
    }
  };

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      onUserSelect([...selectedUsers, userId]);
    } else {
      onUserSelect(selectedUsers?.filter(id => id !== userId));
      setSelectAll(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      inactive: { color: 'bg-muted text-muted-foreground', icon: 'Circle' },
      locked: { color: 'bg-error text-error-foreground', icon: 'Lock' },
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock' }
    };

    const config = statusConfig?.[status] || statusConfig?.inactive;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'admin': 'bg-primary text-primary-foreground',
      'manager': 'bg-accent text-accent-foreground',
      'senior-tech': 'bg-secondary text-secondary-foreground',
      'technician': 'bg-muted text-muted-foreground',
      'specialist': 'bg-surface text-surface-foreground'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${roleColors?.[role] || roleColors?.technician}`}>
        {role?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
      </span>
    );
  };

  const formatLastLogin = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedUsers?.length > 0 && (
        <div className="bg-primary/10 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-primary">
                {selectedUsers?.length} user{selectedUsers?.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('activate')}
              >
                <Icon name="UserCheck" size={14} className="mr-2" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('deactivate')}
              >
                <Icon name="UserX" size={14} className="mr-2" />
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export')}
              >
                <Icon name="Download" size={14} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  size="sm"
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>User</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Role</span>
                  {getSortIcon('role')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Department</span>
                  {getSortIcon('department')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('lastLogin')}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Last Login</span>
                  {getSortIcon('lastLogin')}
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Sessions</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-muted-foreground">Permissions</span>
              </th>
              <th className="w-24 p-4">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user?.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4">
                  <Checkbox
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={(e) => handleUserSelect(user?.id, e?.target?.checked)}
                    size="sm"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {getRoleBadge(user?.role)}
                </td>
                <td className="p-4">
                  <span className="text-sm text-card-foreground">{user?.department}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {formatLastLogin(user?.lastLogin)}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(user?.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-card-foreground">{user?.activeSessions}</span>
                    {user?.activeSessions > 0 && (
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    {user?.permissions?.slice(0, 3)?.map((permission, index) => (
                      <span
                        key={index}
                        className="inline-block w-2 h-2 bg-primary rounded-full"
                        title={permission}
                      ></span>
                    ))}
                    {user?.permissions?.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{user?.permissions?.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onUserEdit(user)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-error"
                    >
                      <Icon name="MoreVertical" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="border-t border-border p-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {users?.length} of 277 users
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="ChevronLeft" size={14} className="mr-1" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="text-muted-foreground px-2">...</span>
            <Button variant="outline" size="sm">12</Button>
          </div>
          <Button variant="outline" size="sm">
            Next
            <Icon name="ChevronRight" size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;