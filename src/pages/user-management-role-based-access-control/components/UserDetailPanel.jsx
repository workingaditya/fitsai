import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserDetailPanel = ({ selectedUser, onUserUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [userForm, setUserForm] = useState(selectedUser || {});

  if (!selectedUser) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No User Selected</h3>
          <p className="text-muted-foreground">Select a user from the table to view details</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'permissions', label: 'Permissions', icon: 'Shield' },
    { id: 'sessions', label: 'Sessions', icon: 'Monitor' },
    { id: 'audit', label: 'Audit Log', icon: 'FileText' }
  ];

  const permissionCategories = [
    {
      name: 'System Administration',
      permissions: [
        { id: 'user-management', name: 'User Management', granted: true },
        { id: 'system-config', name: 'System Configuration', granted: true },
        { id: 'audit-access', name: 'Audit Trail Access', granted: true },
        { id: 'backup-restore', name: 'Backup & Restore', granted: false }
      ]
    },
    {
      name: 'Knowledge Base',
      permissions: [
        { id: 'kb-read', name: 'Read Access', granted: true },
        { id: 'kb-write', name: 'Write Access', granted: true },
        { id: 'kb-admin', name: 'Administrative Access', granted: false },
        { id: 'kb-export', name: 'Export Data', granted: true }
      ]
    },
    {
      name: 'AI Assistant',
      permissions: [
        { id: 'ai-chat', name: 'Chat Access', granted: true },
        { id: 'ai-history', name: 'Conversation History', granted: true },
        { id: 'ai-config', name: 'Model Configuration', granted: false },
        { id: 'ai-analytics', name: 'Usage Analytics', granted: true }
      ]
    }
  ];

  const activeSessions = [
    {
      id: 1,
      device: 'Windows Desktop',
      location: 'New York, NY',
      ip: '192.168.1.45',
      loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 15 * 60 * 1000),
      status: 'active'
    },
    {
      id: 2,
      device: 'iPhone 14',
      location: 'New York, NY',
      ip: '192.168.1.67',
      loginTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 45 * 60 * 1000),
      status: 'idle'
    }
  ];

  const auditLogs = [
    {
      id: 1,
      action: 'User Login',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      details: 'Successful login from 192.168.1.45',
      severity: 'info'
    },
    {
      id: 2,
      action: 'Permission Modified',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      details: 'AI Configuration access granted by admin@company.com',
      severity: 'warning'
    },
    {
      id: 3,
      action: 'Knowledge Base Access',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      details: 'Accessed Network Troubleshooting documentation',
      severity: 'info'
    },
    {
      id: 4,
      action: 'Failed Login Attempt',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      details: 'Failed login attempt from 203.0.113.45',
      severity: 'error'
    }
  ];

  const handleSave = () => {
    onUserUpdate(userForm);
    setEditMode(false);
  };

  const handleCancel = () => {
    setUserForm(selectedUser);
    setEditMode(false);
  };

  const formatDateTime = (date) => {
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'text-accent',
      warning: 'text-warning',
      error: 'text-error',
      success: 'text-success'
    };
    return colors?.[severity] || colors?.info;
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* User Avatar and Basic Info */}
      <div className="text-center pb-6 border-b border-border">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="User" size={32} color="white" />
        </div>
        <h2 className="text-xl font-semibold text-card-foreground">{selectedUser?.name}</h2>
        <p className="text-muted-foreground">{selectedUser?.email}</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            selectedUser?.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name={selectedUser?.status === 'active' ? 'CheckCircle' : 'Circle'} size={12} className="mr-1" />
            {selectedUser?.status?.charAt(0)?.toUpperCase() + selectedUser?.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* User Details Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-card-foreground">User Information</h3>
          {!editMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(true)}
            >
              <Icon name="Edit" size={14} className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {editMode ? (
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={userForm?.name || ''}
              onChange={(e) => setUserForm({...userForm, name: e?.target?.value})}
            />
            <Input
              label="Email Address"
              type="email"
              value={userForm?.email || ''}
              onChange={(e) => setUserForm({...userForm, email: e?.target?.value})}
            />
            <Input
              label="Department"
              value={userForm?.department || ''}
              onChange={(e) => setUserForm({...userForm, department: e?.target?.value})}
            />
            <Input
              label="Job Title"
              value={userForm?.jobTitle || selectedUser?.role}
              onChange={(e) => setUserForm({...userForm, jobTitle: e?.target?.value})}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span className="text-card-foreground">{selectedUser?.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="text-card-foreground">{selectedUser?.role?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employee ID:</span>
              <span className="text-card-foreground">{selectedUser?.employeeId || 'EMP-' + selectedUser?.id?.toString()?.padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Login:</span>
              <span className="text-card-foreground">{formatDateTime(new Date(selectedUser.lastLogin))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Created:</span>
              <span className="text-card-foreground">{formatDateTime(new Date(selectedUser.createdAt || Date.now() - 90 * 24 * 60 * 60 * 1000))}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPermissionsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-card-foreground">Permission Matrix</h3>
        <Button variant="outline" size="sm">
          <Icon name="Copy" size={14} className="mr-2" />
          Copy from Template
        </Button>
      </div>

      {permissionCategories?.map((category) => (
        <div key={category?.name} className="space-y-3">
          <h4 className="text-sm font-medium text-card-foreground border-b border-border pb-2">
            {category?.name}
          </h4>
          <div className="space-y-2">
            {category?.permissions?.map((permission) => (
              <div key={permission?.id} className="flex items-center justify-between">
                <Checkbox
                  label={permission?.name}
                  checked={permission?.granted}
                  onChange={() => {}}
                  size="sm"
                />
                <Icon 
                  name={permission?.granted ? "Check" : "X"} 
                  size={14} 
                  className={permission?.granted ? "text-success" : "text-muted-foreground"} 
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-border">
        <Button variant="default" className="w-full">
          <Icon name="Save" size={14} className="mr-2" />
          Update Permissions
        </Button>
      </div>
    </div>
  );

  const renderSessionsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-card-foreground">Active Sessions</h3>
        <Button variant="outline" size="sm" className="text-error hover:text-error">
          <Icon name="LogOut" size={14} className="mr-2" />
          End All Sessions
        </Button>
      </div>

      <div className="space-y-4">
        {activeSessions?.map((session) => (
          <div key={session?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon name="Monitor" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-card-foreground">{session?.device}</p>
                  <p className="text-sm text-muted-foreground">{session?.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  session?.status === 'active' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
                }`}>
                  {session?.status}
                </span>
                <Button variant="ghost" size="sm" className="text-error hover:text-error">
                  <Icon name="X" size={14} />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">IP Address:</span>
                <p className="text-card-foreground">{session?.ip}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Login Time:</span>
                <p className="text-card-foreground">{formatDateTime(session?.loginTime)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Activity:</span>
                <p className="text-card-foreground">{formatDateTime(session?.lastActivity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-card-foreground">Recent Activity</h3>
        <Button variant="outline" size="sm">
          <Icon name="Download" size={14} className="mr-2" />
          Export Log
        </Button>
      </div>

      <div className="space-y-3">
        {auditLogs?.map((log) => (
          <div key={log?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon 
                    name={log?.severity === 'error' ? 'AlertCircle' : log?.severity === 'warning' ? 'AlertTriangle' : 'Info'} 
                    size={16} 
                    className={getSeverityColor(log?.severity)} 
                  />
                  <span className="font-medium text-card-foreground">{log?.action}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{log?.details}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(log?.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        <Icon name="MoreHorizontal" size={14} className="mr-2" />
        Load More Activities
      </Button>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-card-foreground">User Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-1 p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'permissions' && renderPermissionsTab()}
        {activeTab === 'sessions' && renderSessionsTab()}
        {activeTab === 'audit' && renderAuditTab()}
      </div>
    </div>
  );
};

export default UserDetailPanel;