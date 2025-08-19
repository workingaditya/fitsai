import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Settings, FileText, Server, Building, Brain, 
  Zap, Activity, Search, BarChart3, MessageSquare, 
  Database, Bot, Home, Headphones, HelpCircle, Book,
  X, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';


export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isEmployee, userProfile } = useAuth();

  // Admin navigation items
  const adminNavItems = [
    {
      section: 'User Management',
      items: [
        { icon: Users, label: 'User Management', path: '/admin/users' }
      ]
    },
    {
      section: 'System Administration',
      items: [
        { icon: Settings, label: 'System Settings', path: '/admin/system' },
        { icon: FileText, label: 'Audit Trail', path: '/admin/audit' }
      ]
    },
    {
      section: 'Architecture & Infrastructure',
      items: [
        { icon: Server, label: 'Backend Architecture', path: '/admin/backend' },
        { icon: Building, label: 'Multi-tenant Config', path: '/admin/tenants' },
        { icon: Activity, label: 'Integration Health', path: '/admin/integrations' }
      ]
    },
    {
      section: 'AI & Machine Learning',
      items: [
        { icon: Brain, label: 'LLM Models', path: '/admin/llm-models' },
        { icon: BarChart3, label: 'LLM Analytics', path: '/admin/llm-analytics' },
        { icon: Search, label: 'Vector Search', path: '/admin/vector-search' },
        { icon: Bot, label: 'AI Chat Management', path: '/admin/ai-chat' }
      ]
    },
    {
      section: 'Collaboration & Content',
      items: [
        { icon: Zap, label: 'Collaboration Sync', path: '/admin/collaboration' },
        { icon: MessageSquare, label: 'Conversations', path: '/admin/conversations' },
        { icon: Database, label: 'Knowledge Base Admin', path: '/admin/knowledge-base' }
      ]
    }
  ];

  // Employee navigation items
  const employeeNavItems = [
    {
      section: 'Employee Portal',
      items: [
        { icon: Home, label: 'Dashboard', path: '/employee/dashboard' },
        { icon: HelpCircle, label: 'IT Support Portal', path: '/employee/it-support' },
        { icon: Headphones, label: 'Chat Support', path: '/employee/chat-support' },
        { icon: Book, label: 'Knowledge Base & Requests', path: '/employee/knowledge-base' }
      ]
    }
  ];

  const navigationItems = isAdmin() ? adminNavItems : employeeNavItems;

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Platform</h2>
              <p className="text-xs text-gray-500 capitalize">
                {userProfile?.role || 'User'} Portal
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Role indicator */}
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isAdmin() ? 'bg-red-500' : 'bg-green-500'}`} />
            <span className="text-xs font-medium text-gray-700">
              {isAdmin() ? 'Administrator Access' : 'Employee Access'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationItems?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {section?.section}
              </h3>
              <div className="space-y-1">
                {section?.items?.map((item) => {
                  const Icon = item?.icon;
                  const isActive = location?.pathname === item?.path;
                  
                  return (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-2.5 text-left rounded-lg mx-2 transition-colors
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' :'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="font-medium">{item?.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User info at bottom */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userProfile?.role || 'User'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
}