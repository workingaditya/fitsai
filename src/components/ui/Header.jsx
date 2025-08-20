import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Settings, Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header({ onMenuToggle = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, signOut, isAdmin, isEmployee } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Get navigation items based on role
  const getNavigationItems = () => {
    if (isAdmin()) {
      return [
        { label: 'User Management', path: '/admin/users' },
        { label: 'System Settings', path: '/admin/system' },
        { label: 'Audit Trail', path: '/admin/audit' },
        { label: 'Backend Architecture', path: '/admin/backend' },
        { label: 'Multi-tenant Config', path: '/admin/tenants' },
        { label: 'LLM Models', path: '/admin/llm-models' },
        { label: 'Collaboration', path: '/admin/collaboration' },
        { label: 'Integrations', path: '/admin/integrations' },
        { label: 'Vector Search', path: '/admin/vector-search' },
        { label: 'LLM Analytics', path: '/admin/llm-analytics' },
        { label: 'Conversations', path: '/admin/conversations' },
        { label: 'Knowledge Base Admin', path: '/admin/knowledge-base' },
        { label: 'AI Chat Management', path: '/admin/ai-chat' }
      ];
    } else if (isEmployee()) {
      return [
        { label: 'Dashboard', path: '/employee/dashboard' },
        { label: 'IT Support', path: '/employee/it-support' },
        { label: 'Chat Support', path: '/employee/chat-support' },
        { label: 'Knowledge Base', path: '/employee/knowledge-base' }
      ];
    }
    return [];
  };

  const navigationItems = getNavigationItems();
  const currentPageTitle = navigationItems?.find(item => item?.path === location?.pathname)?.label || 'Dashboard';

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5 text-text-secondary" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{currentPageTitle}</h1>
              <p className="text-xs text-text-secondary">
                {isAdmin() ? 'Administrator Portal' : 'Employee Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Center - Quick Navigation (visible on larger screens) */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <button
              key={item?.path}
              onClick={() => navigate(item?.path)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location?.pathname === item?.path
                  ? 'bg-sidebar-active text-primary' :'text-text-secondary hover:bg-muted'
              }`}
            >
              {item?.label}
            </button>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-muted">
            <Search className="h-5 w-5 text-text-secondary" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-muted relative">
            <Bell className="h-5 w-5 text-text-secondary" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-error rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-text-secondary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {userProfile?.full_name || 'User'}
                </p>
                <p className="text-xs text-text-secondary capitalize">
                  {userProfile?.role || 'User'}
                </p>
              </div>
            </button>

            {/* User dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {userProfile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                  <p className="text-xs text-primary capitalize font-medium">
                    {userProfile?.role || 'User'} Access
                  </p>
                </div>
                
                <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Profile Settings</span>
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}