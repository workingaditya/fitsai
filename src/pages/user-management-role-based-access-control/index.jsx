import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserDetailPanel from './components/UserDetailPanel';
import SystemStatusBar from './components/SystemStatusBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const UserManagementPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [filters, setFilters] = useState({
    departments: [],
    roles: [],
    status: [],
    lastLogin: '',
    searchTerm: ''
  });

  // Mock user data
  const [users] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "admin",
      department: "IT Infrastructure",
      status: "active",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      activeSessions: 2,
      permissions: ["user-management", "system-config", "audit-access", "kb-admin"],
      employeeId: "EMP-0001",
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "senior-tech",
      department: "Network Operations",
      status: "active",
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      activeSessions: 1,
      permissions: ["kb-read", "kb-write", "ai-chat", "ai-history"],
      employeeId: "EMP-0002",
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "manager",
      department: "Security",
      status: "active",
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      activeSessions: 1,
      permissions: ["user-management", "kb-admin", "ai-analytics", "audit-access"],
      employeeId: "EMP-0003",
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      name: "David Thompson",
      email: "david.thompson@company.com",
      role: "technician",
      department: "Help Desk",
      status: "active",
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      activeSessions: 1,
      permissions: ["kb-read", "ai-chat", "ai-history"],
      employeeId: "EMP-0004",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.wang@company.com",
      role: "specialist",
      department: "Database Administration",
      status: "inactive",
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      activeSessions: 0,
      permissions: ["kb-read", "kb-write", "ai-chat"],
      employeeId: "EMP-0005",
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000)
    },
    {
      id: 6,
      name: "James Wilson",
      email: "james.wilson@company.com",
      role: "analyst",
      department: "Security",
      status: "locked",
      lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      activeSessions: 0,
      permissions: ["kb-read", "ai-chat"],
      employeeId: "EMP-0006",
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)
    },
    {
      id: 7,
      name: "Maria Garcia",
      email: "maria.garcia@company.com",
      role: "engineer",
      department: "Network Operations",
      status: "pending",
      lastLogin: null,
      activeSessions: 0,
      permissions: [],
      employeeId: "EMP-0007",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 8,
      name: "Robert Brown",
      email: "robert.brown@company.com",
      role: "technician",
      department: "Help Desk",
      status: "active",
      lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000),
      activeSessions: 1,
      permissions: ["kb-read", "ai-chat", "ai-history"],
      employeeId: "EMP-0008",
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [savedFilters] = useState([
    { id: 1, name: "Active IT Staff", filters: { status: ["active"], departments: ["IT Infrastructure", "Network Operations"] } },
    { id: 2, name: "Security Team", filters: { departments: ["Security"] } },
    { id: 3, name: "Inactive Users", filters: { status: ["inactive", "locked"] } },
    { id: 4, name: "New Users", filters: { status: ["pending"] } }
  ]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveFilter = (name, filterData) => {
    console.log('Saving filter:', name, filterData);
    // Implementation would save to backend
  };

  const handleLoadFilter = (filter) => {
    setFilters(filter?.filters);
  };

  const handleUserSelect = (userIds) => {
    setSelectedUsers(Array.isArray(userIds) ? userIds : [userIds]);
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action, 'for users:', selectedUsers);
    // Implementation would handle bulk operations
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setShowDetailPanel(true);
  };

  const handleUserUpdate = (updatedUser) => {
    console.log('Updating user:', updatedUser);
    // Implementation would update user data
  };

  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedUser(null);
  };

  // Filter users based on current filters
  const filteredUsers = users?.filter(user => {
    if (filters?.searchTerm) {
      const searchLower = filters?.searchTerm?.toLowerCase();
      if (!user?.name?.toLowerCase()?.includes(searchLower) && 
          !user?.email?.toLowerCase()?.includes(searchLower) &&
          !user?.department?.toLowerCase()?.includes(searchLower)) {
        return false;
      }
    }

    if (filters?.departments?.length > 0) {
      const deptMap = {
        'it-infrastructure': 'IT Infrastructure',
        'security': 'Security',
        'network': 'Network Operations',
        'helpdesk': 'Help Desk',
        'database': 'Database Administration',
        'devops': 'DevOps',
        'compliance': 'Compliance'
      };
      const userDept = Object.keys(deptMap)?.find(key => deptMap?.[key] === user?.department);
      if (!filters?.departments?.includes(userDept)) {
        return false;
      }
    }

    if (filters?.roles?.length > 0 && !filters?.roles?.includes(user?.role)) {
      return false;
    }

    if (filters?.status?.length > 0 && !filters?.status?.includes(user?.status)) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>User Management & Role-Based Access Control - FITS AI</title>
        <meta name="description" content="Comprehensive user administration interface for managing IT staff access permissions and role assignments across the AI knowledge system." />
      </Helmet>

      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={handleToggleSidebar}
        userRole="admin"
      />
      
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        userRole="admin"
      />

      <main className={`transition-all duration-normal ${
        sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'
      } mt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage IT staff access permissions and role assignments
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Icon name="Download" size={16} className="mr-2" />
                  Export Users
                </Button>
                <Button variant="outline">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Bulk Import
                </Button>
                <Button variant="default">
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <SystemStatusBar />

          {/* Main Content Grid */}
          <div className={`grid gap-6 ${showDetailPanel ? 'grid-cols-12' : 'grid-cols-4'}`}>
            {/* Filters Panel */}
            <div className={showDetailPanel ? 'col-span-2' : 'col-span-1'}>
              <UserFilters
                onFilterChange={handleFilterChange}
                savedFilters={savedFilters}
                onSaveFilter={handleSaveFilter}
                onLoadFilter={handleLoadFilter}
              />
            </div>

            {/* User Table */}
            <div className={showDetailPanel ? 'col-span-7' : 'col-span-3'}>
              <UserTable
                users={filteredUsers}
                onUserSelect={handleUserSelect}
                selectedUsers={selectedUsers}
                onBulkAction={handleBulkAction}
                onUserEdit={handleUserEdit}
              />
            </div>

            {/* Detail Panel */}
            {showDetailPanel && (
              <div className="col-span-3">
                <UserDetailPanel
                  selectedUser={selectedUser}
                  onUserUpdate={handleUserUpdate}
                  onClose={handleCloseDetailPanel}
                />
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-card-foreground">234</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Icon name="UserX" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-card-foreground">23</p>
                  <p className="text-sm text-muted-foreground">Inactive Users</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
                  <Icon name="Lock" size={20} className="text-error" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-card-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Locked Accounts</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-card-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Pending Activation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;