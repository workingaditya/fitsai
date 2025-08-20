import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ConversationTable from './components/ConversationTable';
import FilterSidebar from './components/FilterSidebar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BulkOperations from './components/BulkOperations';
import ConversationModal from './components/ConversationModal';

const ConversationHistorySearchAnalytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('conversations');
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [userRole] = useState('admin'); // Mock user role

  // Mock conversations data
  const [conversations] = useState([
    {
      id: 1,
      timestamp: new Date('2025-08-13T14:30:00'),
      user: 'John Smith',
      topic: 'VPN Connection Issues After Windows Update',
      summary: 'Unable to establish secure tunnel, connection fails during authentication',
      llmModel: 'Mistral',
      status: 'resolved',
      category: 'Network Troubleshooting',
      duration: '18 minutes',
      messageCount: 6,
      rating: 5
    },
    {
      id: 2,
      timestamp: new Date('2025-08-13T13:45:00'),
      user: 'Sarah Johnson',
      topic: 'Database Performance Optimization',
      summary: 'Slow query execution times, need indexing recommendations',
      llmModel: 'Code-Llama',
      status: 'resolved',
      category: 'Database Management',
      duration: '32 minutes',
      messageCount: 12,
      rating: 4
    },
    {
      id: 3,
      timestamp: new Date('2025-08-13T12:15:00'),
      user: 'Mike Davis',
      topic: 'Active Directory User Account Lockout',
      summary: 'Multiple users experiencing account lockouts, need policy review',
      llmModel: 'Llama',
      status: 'pending',
      category: 'Security Procedures',
      duration: '25 minutes',
      messageCount: 8,
      rating: null
    },
    {
      id: 4,
      timestamp: new Date('2025-08-13T11:20:00'),
      user: 'Lisa Wilson',
      topic: 'Email Server Configuration SSL Certificate',
      summary: 'SSL certificate expired, need renewal and configuration steps',
      llmModel: 'WizardLM',
      status: 'resolved',
      category: 'System Administration',
      duration: '15 minutes',
      messageCount: 5,
      rating: 5
    },
    {
      id: 5,
      timestamp: new Date('2025-08-13T10:30:00'),
      user: 'David Brown',
      topic: 'Backup Script Automation PowerShell',
      summary: 'Creating automated backup scripts for file servers',
      llmModel: 'Code-Llama',
      status: 'resolved',
      category: 'System Administration',
      duration: '45 minutes',
      messageCount: 15,
      rating: 4
    },
    {
      id: 6,
      timestamp: new Date('2025-08-12T16:45:00'),
      user: 'Emma Taylor',
      topic: 'Network Printer Driver Installation',
      summary: 'Unable to install network printer drivers on Windows 11',
      llmModel: 'Mistral',
      status: 'escalated',
      category: 'Hardware Issues',
      duration: '28 minutes',
      messageCount: 9,
      rating: 3
    },
    {
      id: 7,
      timestamp: new Date('2025-08-12T15:30:00'),
      user: 'Robert Garcia',
      topic: 'Firewall Rule Configuration for New Application',
      summary: 'Need to configure firewall rules for new web application deployment',
      llmModel: 'Vicuna',
      status: 'resolved',
      category: 'Security Procedures',
      duration: '22 minutes',
      messageCount: 7,
      rating: 5
    },
    {
      id: 8,
      timestamp: new Date('2025-08-12T14:15:00'),
      user: 'Jennifer Lee',
      topic: 'Office 365 SharePoint Permissions',
      summary: 'Users unable to access shared documents, permission issues',
      llmModel: 'Llama',
      status: 'archived',
      category: 'Software Support',
      duration: '35 minutes',
      messageCount: 11,
      rating: 4
    }
  ]);

  // Filter state
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: 'last7days',
    startDate: '',
    endDate: '',
    user: userRole === 'admin' ? 'all' : 'me',
    status: 'all',
    category: 'all',
    llmModel: 'all'
  });

  // Read search query from URL (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setFilters(prev => ({ ...prev, searchQuery: q }));
    }
  }, [location.search]);

  // Saved filters
  const [savedFilters] = useState([
    {
      id: 1,
      name: 'Recent Network Issues',
      filters: {
        dateRange: 'last7days',
        category: 'network',
        status: 'all'
      }
    },
    {
      id: 2,
      name: 'Unresolved Security Cases',
      filters: {
        category: 'security',
        status: 'pending'
      }
    }
  ]);

  // Filter conversations based on current filters
  const filteredConversations = useMemo(() => {
    return conversations?.filter(conversation => {
      // Search query filter
      if (filters?.searchQuery) {
        const query = filters?.searchQuery?.toLowerCase();
        if (!conversation?.topic?.toLowerCase()?.includes(query) &&
            !conversation?.summary?.toLowerCase()?.includes(query) &&
            !conversation?.user?.toLowerCase()?.includes(query)) {
          return false;
        }
      }

      // Date range filter
      const now = new Date();
      const conversationDate = new Date(conversation.timestamp);
      
      switch (filters?.dateRange) {
        case 'today':
          if (conversationDate?.toDateString() !== now?.toDateString()) return false;
          break;
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday?.setDate(yesterday?.getDate() - 1);
          if (conversationDate?.toDateString() !== yesterday?.toDateString()) return false;
          break;
        case 'last7days':
          const weekAgo = new Date(now);
          weekAgo?.setDate(weekAgo?.getDate() - 7);
          if (conversationDate < weekAgo) return false;
          break;
        case 'last30days':
          const monthAgo = new Date(now);
          monthAgo?.setDate(monthAgo?.getDate() - 30);
          if (conversationDate < monthAgo) return false;
          break;
        case 'custom':
          if (filters?.startDate && conversationDate < new Date(filters.startDate)) return false;
          if (filters?.endDate && conversationDate > new Date(filters.endDate)) return false;
          break;
      }

      // User filter
      if (filters?.user !== 'all' && filters?.user !== 'me' && filters?.user !== 'team') {
        if (conversation?.user?.toLowerCase()?.replace(' ', '.') !== filters?.user) return false;
      }

      // Status filter
      if (filters?.status !== 'all' && conversation?.status !== filters?.status) {
        return false;
      }

      // Category filter
      if (filters?.category !== 'all') {
        const categoryMap = {
          network: 'Network Troubleshooting',
          security: 'Security Procedures',
          system: 'System Administration',
          compliance: 'Compliance & Policies',
          hardware: 'Hardware Issues',
          software: 'Software Support',
          database: 'Database Management'
        };
        if (conversation?.category !== categoryMap?.[filters?.category]) return false;
      }

      // LLM Model filter
      if (filters?.llmModel !== 'all' && conversation?.llmModel?.toLowerCase() !== filters?.llmModel) {
        return false;
      }

      return true;
    });
  }, [conversations, filters]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversations(prev => {
      if (prev?.includes(conversationId)) {
        return prev?.filter(id => id !== conversationId);
      } else {
        return [...prev, conversationId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedConversations?.length === filteredConversations?.length) {
      setSelectedConversations([]);
    } else {
      setSelectedConversations(filteredConversations?.map(c => c?.id));
    }
  };

  const handleViewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowConversationModal(true);
  };

  const handleExportConversation = (conversation) => {
    console.log('Exporting conversation:', conversation?.id);
    // Mock export functionality
    alert(`Exporting conversation: ${conversation?.topic}`);
  };

  const handleBulkArchive = (conversationIds) => {
    console.log('Archiving conversations:', conversationIds);
    alert(`Archived ${conversationIds?.length} conversations`);
    setSelectedConversations([]);
  };

  const handleBulkExport = (conversationIds, format) => {
    console.log('Bulk exporting conversations:', conversationIds, 'Format:', format);
    alert(`Exporting ${conversationIds?.length} conversations as ${format?.toUpperCase()}`);
    setSelectedConversations([]);
  };

  const handleBulkDelete = (conversationIds) => {
    console.log('Deleting conversations:', conversationIds);
    alert(`Deleted ${conversationIds?.length} conversations`);
    setSelectedConversations([]);
  };

  const handleCreateKnowledgeArticle = (conversation) => {
    console.log('Creating knowledge article from conversation:', conversation);
    alert(`Creating knowledge article from: ${conversation?.topic || conversation?.[0]?.topic}`);
    navigate('/knowledge-base-management-content-administration');
  };

  const handleSaveFilter = (name, filterConfig) => {
    console.log('Saving filter:', name, filterConfig);
    alert(`Filter "${name}" saved successfully`);
  };

  const handleLoadFilter = (savedFilter) => {
    setFilters(prev => ({ ...prev, ...savedFilter?.filters }));
  };

  const analyticsData = {
    totalConversations: conversations?.length,
    resolvedConversations: conversations?.filter(c => c?.status === 'resolved')?.length,
    averageRating: conversations?.filter(c => c?.rating)?.reduce((acc, c) => acc + c?.rating, 0) / conversations?.filter(c => c?.rating)?.length,
    topCategories: ['Network Troubleshooting', 'System Administration', 'Security Procedures']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
      />
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-72'
      } pt-16`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Conversation History & Analytics</h1>
                <p className="text-gray-600 mt-1">
                  Search, analyze, and manage AI conversation history with advanced filtering and insights
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setActiveView('conversations')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeView === 'conversations' ?'bg-primary text-white' :'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    Conversations
                  </button>
                  <button
                    onClick={() => setActiveView('analytics')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeView === 'analytics' ?'bg-primary text-white' :'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon name="BarChart3" size={16} className="mr-2" />
                    Analytics
                  </button>
                </div>
                
                <Button
                  variant="default"
                  onClick={() => navigate('/ai-chat-interface-conversation-management')}
                  iconName="Plus"
                  iconPosition="left"
                >
                  New Conversation
                </Button>
              </div>
            </div>
          </div>

          {activeView === 'conversations' ? (
            <div className="grid grid-cols-12 gap-6">
              {/* Filter Sidebar */}
              <div className="col-span-12 lg:col-span-3">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onSaveFilter={handleSaveFilter}
                  onLoadFilter={handleLoadFilter}
                  savedFilters={savedFilters}
                  userRole={userRole}
                />
              </div>

              {/* Main Content */}
              <div className="col-span-12 lg:col-span-9">
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Icon name="Search" size={20} className="text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Showing {filteredConversations?.length} of {conversations?.length} conversations
                          </span>
                        </div>
                        {filters?.searchQuery && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">for</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              "{filters?.searchQuery}"
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Icon name="Clock" size={16} />
                        <span>Last updated: {new Date()?.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Operations */}
                  <BulkOperations
                    selectedConversations={selectedConversations}
                    onBulkArchive={handleBulkArchive}
                    onBulkExport={handleBulkExport}
                    onBulkDelete={handleBulkDelete}
                    onCreateKnowledgeArticle={handleCreateKnowledgeArticle}
                    userRole={userRole}
                  />

                  {/* Conversation Table */}
                  <ConversationTable
                    conversations={filteredConversations}
                    selectedConversations={selectedConversations}
                    onSelectConversation={handleSelectConversation}
                    onSelectAll={handleSelectAll}
                    onViewConversation={handleViewConversation}
                    onExportConversation={handleExportConversation}
                    userRole={userRole}
                  />
                </div>
              </div>
            </div>
          ) : (
            <AnalyticsDashboard 
              analyticsData={analyticsData}
              userRole={userRole}
            />
          )}
        </div>
      </main>
      {/* Conversation Modal */}
      <ConversationModal
        conversation={selectedConversation}
        isOpen={showConversationModal}
        onClose={() => {
          setShowConversationModal(false);
          setSelectedConversation(null);
        }}
        onExport={handleExportConversation}
        onCreateArticle={handleCreateKnowledgeArticle}
      />
    </div>
  );
};

export default ConversationHistorySearchAnalytics;