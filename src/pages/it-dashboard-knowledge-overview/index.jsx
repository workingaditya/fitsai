import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import KnowledgeCategoryCard from './components/KnowledgeCategoryCard';
import QuickAccessPanel from './components/QuickAccessPanel';
import SystemStatusIndicator from './components/SystemStatusIndicator';
import DashboardStats from './components/DashboardStats';
import RecentActivityFeed from './components/RecentActivityFeed';

const ITDashboardKnowledgeOverview = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole] = useState('admin'); // Mock user role
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const knowledgeCategories = [
    {
      id: 1,
      title: "Network Troubleshooting",
      description: "Diagnose and resolve network connectivity issues, performance problems, and configuration errors",
      icon: "Network",
      bgColor: "bg-blue-500",
      articleCount: 156,
      lastUpdated: "2 hours ago",
      priority: "high",
      path: "/knowledge-base-management-content-administration",
      roles: ['admin', 'user', 'support'],
      quickActions: [
        { label: "Ping Test", icon: "Zap", path: "/ai-chat-interface-conversation-management" },
        { label: "DNS Check", icon: "Search", path: "/ai-chat-interface-conversation-management" }
      ]
    },
    {
      id: 2,
      title: "Security Procedures",
      description: "Access security protocols, incident response guides, and compliance documentation",
      icon: "Shield",
      bgColor: "bg-red-500",
      articleCount: 89,
      lastUpdated: "1 day ago",
      priority: "high",
      path: "/knowledge-base-management-content-administration",
      roles: ['admin', 'support'],
      quickActions: [
        { label: "Incident Response", icon: "AlertTriangle", path: "/ai-chat-interface-conversation-management" },
        { label: "Security Scan", icon: "Scan", path: "/ai-chat-interface-conversation-management" }
      ]
    },
    {
      id: 3,
      title: "System Administration",
      description: "Server management, backup procedures, and system maintenance documentation",
      icon: "Server",
      bgColor: "bg-green-500",
      articleCount: 234,
      lastUpdated: "3 hours ago",
      priority: "medium",
      path: "/knowledge-base-management-content-administration",
      roles: ['admin', 'user'],
      quickActions: [
        { label: "Server Status", icon: "Activity", path: "/system-administration-configuration-settings" },
        { label: "Backup Check", icon: "Database", path: "/system-administration-configuration-settings" }
      ]
    },
    {
      id: 4,
      title: "Compliance & Policies",
      description: "Regulatory requirements, audit documentation, and organizational IT policies",
      icon: "FileText",
      bgColor: "bg-purple-500",
      articleCount: 67,
      lastUpdated: "1 week ago",
      priority: "low",
      path: "/audit-trail-compliance-reporting",
      roles: ['admin'],
      quickActions: [
        { label: "Audit Report", icon: "FileCheck", path: "/audit-trail-compliance-reporting" },
        { label: "Policy Review", icon: "Eye", path: "/audit-trail-compliance-reporting" }
      ]
    },
    {
      id: 5,
      title: "User Management",
      description: "Account provisioning, role assignments, and access control management",
      icon: "Users",
      bgColor: "bg-orange-500",
      articleCount: 45,
      lastUpdated: "5 hours ago",
      priority: "medium",
      path: "/user-management-role-based-access-control",
      roles: ['admin'],
      isNew: true,
      quickActions: [
        { label: "Add User", icon: "UserPlus", path: "/user-management-role-based-access-control" },
        { label: "Role Check", icon: "UserCheck", path: "/user-management-role-based-access-control" }
      ]
    },
    {
      id: 6,
      title: "System Configuration",
      description: "Hardware setup, software configuration, and system optimization guides",
      icon: "Settings",
      bgColor: "bg-teal-500",
      articleCount: 123,
      lastUpdated: "6 hours ago",
      priority: "medium",
      path: "/system-administration-configuration-settings",
      roles: ['admin', 'user'],
      quickActions: [
        { label: "Config Check", icon: "CheckCircle", path: "/system-administration-configuration-settings" },
        { label: "Optimize", icon: "Zap", path: "/system-administration-configuration-settings" }
      ]
    }
  ];

  const filteredCategories = knowledgeCategories?.filter(category => 
    category?.roles?.includes(userRole) &&
    (searchQuery === '' || 
     category?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
     category?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
  );

  const handleNewChat = () => {
    navigate('/ai-chat-interface-conversation-management');
  };

  const handleKeyboardShortcut = (e) => {
    if (e?.ctrlKey || e?.metaKey) {
      switch (e?.key) {
        case 'n':
          e?.preventDefault();
          handleNewChat();
          break;
        case 'f':
          e?.preventDefault();
          document.getElementById('global-search')?.focus();
          break;
        case 'k':
          e?.preventDefault();
          document.getElementById('global-search')?.focus();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>IT Dashboard & Knowledge Overview - FITS AI</title>
        <meta name="description" content="Central command center for IT staff with AI-powered knowledge resources and conversation management" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="lg:ml-64">
          <Header onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        </div>

        <main className="transition-all duration-200 pt-16 lg:ml-64">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Welcome back, IT Administrator
                  </h1>
                  <p className="text-muted-foreground">
                    {currentTime?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} • {currentTime?.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <SystemStatusIndicator />
                  <Button
                    variant="default"
                    onClick={handleNewChat}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    New Chat
                  </Button>
                </div>
              </div>

              {/* Global Search */}
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={20} className="text-muted-foreground" />
                </div>
                <Input
                  id="global-search"
                  type="search"
                  placeholder="Search knowledge base, conversations, or ask AI assistant... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pl-10 pr-20"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium bg-muted border border-border rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats userRole={userRole} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Knowledge Categories */}
              <div className="xl:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Knowledge Categories</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Icon name="Filter" size={16} className="mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="SortAsc" size={16} className="mr-2" />
                      Sort
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredCategories?.map((category) => (
                    <KnowledgeCategoryCard
                      key={category?.id}
                      category={category}
                      userRole={userRole}
                    />
                  ))}
                </div>

                {filteredCategories?.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or check your access permissions.
                    </p>
                  </div>
                )}

                {/* Recent Activity Feed */}
                <RecentActivityFeed />
              </div>

              {/* Quick Access Panel */}
              <div className="xl:col-span-1">
                <QuickAccessPanel />
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                  onClick={() => navigate('/ai-chat-interface-conversation-management')}
                >
                  <Icon name="MessageSquare" size={24} />
                  <span className="text-sm">Start Chat</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                  onClick={() => navigate('/knowledge-base-management-content-administration')}
                >
                  <Icon name="BookOpen" size={24} />
                  <span className="text-sm">Browse KB</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                  onClick={() => navigate('/conversation-history-search-analytics')}
                >
                  <Icon name="History" size={24} />
                  <span className="text-sm">View History</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                  onClick={() => navigate('/system-administration-configuration-settings')}
                >
                  <Icon name="Settings" size={24} />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ITDashboardKnowledgeOverview;