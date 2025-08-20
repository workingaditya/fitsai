import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Plus, Monitor, Shield, FileText, HelpCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import KnowledgeBasePanel from './components/KnowledgeBasePanel';
import RequestTrackingPanel from './components/RequestTrackingPanel';
import QuickActionModal from './components/QuickActionModal';
import NewRequestModal from './components/NewRequestModal';

const EmployeeKnowledgeBaseRequestTracking = () => {
  const { user, userProfile, isEmployee } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  // Knowledge base categories for employees
  const knowledgeCategories = [
    {
      id: 'account-access',
      name: 'Account Access',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100',
      articles: [
        { id: 1, title: 'Password Reset Guide', views: 1250, helpful: 95 },
        { id: 2, title: 'Two-Factor Authentication Setup', views: 890, helpful: 88 },
        { id: 3, title: 'Account Locked - What to Do', views: 675, helpful: 92 }
      ]
    },
    {
      id: 'software-help',
      name: 'Software Help',
      icon: Monitor,
      color: 'text-green-600 bg-green-100',
      articles: [
        { id: 4, title: 'Microsoft Office Installation', views: 2100, helpful: 94 },
        { id: 5, title: 'VPN Connection Setup', views: 1540, helpful: 89 },
        { id: 6, title: 'Email Client Configuration', views: 980, helpful: 91 }
      ]
    },
    {
      id: 'hardware-issues',
      name: 'Hardware Issues',
      icon: Smartphone,
      color: 'text-purple-600 bg-purple-100',
      articles: [
        { id: 7, title: 'Printer Connection Problems', views: 850, helpful: 87 },
        { id: 8, title: 'Laptop Not Starting - Troubleshooting', views: 720, helpful: 90 },
        { id: 9, title: 'Monitor Display Issues', views: 640, helpful: 85 }
      ]
    },
    {
      id: 'company-policies',
      name: 'Company Policies',
      icon: FileText,
      color: 'text-orange-600 bg-orange-100',
      articles: [
        { id: 10, title: 'Remote Work IT Guidelines', views: 1890, helpful: 93 },
        { id: 11, title: 'Software Installation Policy', views: 760, helpful: 88 },
        { id: 12, title: 'Data Security Best Practices', views: 1120, helpful: 96 }
      ]
    }
  ];

  // Mock user requests
  const [userRequests, setUserRequests] = useState([
    {
      id: 1,
      title: 'VPN Connection Not Working',
      description: 'Unable to connect to company VPN from home',
      status: 'in-progress',
      priority: 'medium',
      category: 'Network',
      created: new Date(Date.now() - 86400000), // 1 day ago
      updated: new Date(Date.now() - 3600000), // 1 hour ago
      estimatedCompletion: new Date(Date.now() + 7200000), // 2 hours from now
      assignedTo: 'Sarah Johnson',
      messages: 3,
      lastMessage: 'Please try connecting using the backup server settings I sent you.'
    },
    {
      id: 2,
      title: 'Software Installation Request',
      description: 'Need Adobe Creative Suite for design work',
      status: 'waiting-for-approval',
      priority: 'low',
      category: 'Software',
      created: new Date(Date.now() - 172800000), // 2 days ago
      updated: new Date(Date.now() - 43200000), // 12 hours ago
      estimatedCompletion: new Date(Date.now() + 86400000), // 1 day from now
      assignedTo: 'Mike Chen',
      messages: 1,
      lastMessage: 'Your request is being reviewed by your manager.'
    },
    {
      id: 3,
      title: 'Printer Setup Help',
      description: 'New desk printer not appearing in print options',
      status: 'resolved',
      priority: 'low',
      category: 'Hardware',
      created: new Date(Date.now() - 259200000), // 3 days ago
      updated: new Date(Date.now() - 86400000), // 1 day ago
      completedAt: new Date(Date.now() - 86400000),
      assignedTo: 'Alex Rivera',
      messages: 5,
      lastMessage: 'Glad we could get this working! Please rate your experience.'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'waiting-for-approval':
        return <HelpCircle className="w-4 h-4 text-orange-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting-for-approval':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookmarkArticle = (articleId) => {
    setBookmarkedArticles(prev => 
      prev?.includes(articleId) 
        ? prev?.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Simple Header for Employees */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">IT Support Portal</h1>
            <p className="text-text-secondary">Get help with your IT needs</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNewRequest(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              All systems operational
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Knowledge Base Panel (60%) */}
        <div className="w-3/5 bg-card border-r border-border">
          <KnowledgeBasePanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            knowledgeCategories={knowledgeCategories}
            bookmarkedArticles={bookmarkedArticles}
            onBookmarkArticle={handleBookmarkArticle}
            onQuickAction={() => setShowQuickAction(true)}
          />
        </div>

        {/* Request Tracking Panel (40%) */}
        <div className="w-2/5 bg-muted">
          <RequestTrackingPanel
            userRequests={userRequests}
            setUserRequests={setUserRequests}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            onNewRequest={() => setShowNewRequest(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showQuickAction && (
        <QuickActionModal
          onClose={() => setShowQuickAction(false)}
          knowledgeCategories={knowledgeCategories}
        />
      )}

      {showNewRequest && (
        <NewRequestModal
          onClose={() => setShowNewRequest(false)}
          onSubmit={(requestData) => {
            const newRequest = {
              id: Date.now(),
              ...requestData,
              status: 'submitted',
              created: new Date(),
              updated: new Date(),
              messages: 0,
              lastMessage: 'Your request has been submitted and will be reviewed shortly.'
            };
            setUserRequests(prev => [newRequest, ...prev]);
            setShowNewRequest(false);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeKnowledgeBaseRequestTracking;