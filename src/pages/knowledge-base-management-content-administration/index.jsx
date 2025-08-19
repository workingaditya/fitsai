import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import ContentTree from './components/ContentTree';
import ContentList from './components/ContentList';
import ContentDetail from './components/ContentDetail';
import BulkOperationsModal from './components/BulkOperationsModal';
import ImportExportModal from './components/ImportExportModal';

const KnowledgeBaseManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [userRole] = useState('admin');

  // Mock data for knowledge base categories
  const categories = [
    {
      id: 'root',
      name: 'All Categories',
      icon: 'FolderOpen',
      articleCount: 1247,
      hasUpdates: false,
      children: [
        {
          id: 'network',
          name: 'Network Troubleshooting',
          icon: 'Network',
          articleCount: 342,
          hasUpdates: true,
          children: [
            { id: 'connectivity', name: 'Connectivity Issues', icon: 'Wifi', articleCount: 156, hasUpdates: false },
            { id: 'performance', name: 'Performance Optimization', icon: 'Zap', articleCount: 89, hasUpdates: true },
            { id: 'monitoring', name: 'Network Monitoring', icon: 'Activity', articleCount: 97, hasUpdates: false }
          ]
        },
        {
          id: 'security',
          name: 'Security Procedures',
          icon: 'Shield',
          articleCount: 298,
          hasUpdates: false,
          children: [
            { id: 'incident-response', name: 'Incident Response', icon: 'AlertTriangle', articleCount: 67, hasUpdates: false },
            { id: 'access-control', name: 'Access Control', icon: 'Lock', articleCount: 124, hasUpdates: false },
            { id: 'compliance', name: 'Compliance Audits', icon: 'FileCheck', articleCount: 107, hasUpdates: false }
          ]
        },
        {
          id: 'system',
          name: 'System Administration',
          icon: 'Server',
          articleCount: 387,
          hasUpdates: false,
          children: [
            { id: 'backup', name: 'Backup & Recovery', icon: 'HardDrive', articleCount: 145, hasUpdates: false },
            { id: 'maintenance', name: 'System Maintenance', icon: 'Settings', articleCount: 167, hasUpdates: false },
            { id: 'deployment', name: 'Software Deployment', icon: 'Package', articleCount: 75, hasUpdates: false }
          ]
        },
        {
          id: 'policies',
          name: 'Compliance & Policies',
          icon: 'FileText',
          articleCount: 220,
          hasUpdates: false,
          children: [
            { id: 'data-governance', name: 'Data Governance', icon: 'Database', articleCount: 89, hasUpdates: false },
            { id: 'privacy', name: 'Privacy Policies', icon: 'Eye', articleCount: 67, hasUpdates: false },
            { id: 'regulatory', name: 'Regulatory Compliance', icon: 'Scale', articleCount: 64, hasUpdates: false }
          ]
        }
      ]
    }
  ];

  // Mock data for articles
  const articles = [
    {
      id: 1,
      title: "Network Connectivity Troubleshooting Guide",
      description: "Comprehensive step-by-step guide for diagnosing and resolving network connectivity issues in enterprise environments.",
      author: "John Smith",
      lastModified: "2025-01-10T14:30:00Z",
      created: "2024-12-15T09:00:00Z",
      version: "2.1",
      status: "published",
      priority: "high",
      category: "network",
      type: "guide",
      views: 1247,
      tags: ["network", "troubleshooting", "connectivity", "enterprise"],
      hasComments: true,
      commentCount: 23
    },
    {
      id: 2,
      title: "Security Incident Response Procedures",
      description: "Detailed procedures for handling security incidents, including escalation protocols and documentation requirements.",
      author: "Sarah Wilson",
      lastModified: "2025-01-08T11:15:00Z",
      created: "2024-11-20T16:45:00Z",
      version: "1.8",
      status: "published",
      priority: "high",
      category: "security",
      type: "procedure",
      views: 892,
      tags: ["security", "incident", "response", "protocol"],
      hasComments: true,
      commentCount: 15
    },
    {
      id: 3,
      title: "Database Backup and Recovery Best Practices",
      description: "Essential guidelines for implementing robust database backup strategies and recovery procedures.",
      author: "Mike Chen",
      lastModified: "2025-01-05T13:20:00Z",
      created: "2024-10-30T10:30:00Z",
      version: "3.0",
      status: "review",
      priority: "medium",
      category: "system",
      type: "guide",
      views: 634,
      tags: ["database", "backup", "recovery", "best-practices"],
      hasComments: false,
      commentCount: 0
    },
    {
      id: 4,
      title: "GDPR Compliance Checklist for IT Systems",
      description: "Complete checklist for ensuring IT systems comply with GDPR requirements and data protection regulations.",
      author: "Lisa Garcia",
      lastModified: "2025-01-03T09:45:00Z",
      created: "2024-09-15T14:20:00Z",
      version: "2.3",
      status: "published",
      priority: "high",
      category: "policies",
      type: "checklist",
      views: 1089,
      tags: ["gdpr", "compliance", "privacy", "regulations"],
      hasComments: true,
      commentCount: 31
    },
    {
      id: 5,
      title: "Active Directory User Management",
      description: "Step-by-step procedures for managing user accounts, groups, and permissions in Active Directory environments.",
      author: "David Brown",
      lastModified: "2024-12-28T16:10:00Z",
      created: "2024-08-10T11:00:00Z",
      version: "1.5",
      status: "draft",
      priority: "medium",
      category: "system",
      type: "procedure",
      views: 456,
      tags: ["active-directory", "user-management", "permissions"],
      hasComments: false,
      commentCount: 0
    },
    {
      id: 6,
      title: "Firewall Configuration Standards",
      description: "Enterprise standards for configuring and maintaining firewall rules and security policies.",
      author: "Jennifer Lee",
      lastModified: "2024-12-20T12:30:00Z",
      created: "2024-07-25T15:15:00Z",
      version: "2.0",
      status: "published",
      priority: "high",
      category: "security",
      type: "standard",
      views: 723,
      tags: ["firewall", "security", "configuration", "standards"],
      hasComments: true,
      commentCount: 18
    }
  ];

  useEffect(() => {
    // Set default selected category
    if (categories?.length > 0) {
      setSelectedCategory(categories?.[0]);
    }
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedArticle(null);
    setSelectedArticles([]);
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  const handleArticleToggle = (articleId) => {
    setSelectedArticles(prev => 
      prev?.includes(articleId) 
        ? prev?.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleBulkOperation = (operation) => {
    console.log('Bulk operation:', operation, 'on articles:', selectedArticles);
    setSelectedArticles([]);
    setBulkModalOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar}
        userRole={userRole}
      />
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        userRole={userRole}
      />
      <main 
        className={`pt-16 transition-all duration-normal ${
          sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'
        }`}
      >
        <div className="h-screen-minus-header flex">
          {/* Left Panel - Content Tree */}
          <div className="w-1/4 min-w-[300px] max-w-[400px] border-r border-border">
            <ContentTree
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              userRole={userRole}
            />
          </div>
          
          {/* Center Panel - Content List */}
          <div className="flex-1 min-w-0">
            <ContentList
              articles={articles}
              selectedArticles={selectedArticles}
              onArticleSelect={handleArticleSelect}
              onArticleToggle={handleArticleToggle}
              userRole={userRole}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
          
          {/* Right Panel - Content Detail */}
          <div className="w-1/4 min-w-[350px] max-w-[450px]">
            <ContentDetail
              article={selectedArticle}
              onClose={() => setSelectedArticle(null)}
              userRole={userRole}
            />
          </div>
        </div>
        
        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
          <Button
            variant="default"
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg"
            onClick={() => setImportModalOpen(true)}
            title="Import Knowledge Base"
          >
            <Icon name="Download" size={20} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg bg-card"
            onClick={() => setExportModalOpen(true)}
            title="Export Knowledge Base"
          >
            <Icon name="Upload" size={20} />
          </Button>
          
          {selectedArticles?.length > 0 && (
            <Button
              variant="secondary"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg"
              onClick={() => setBulkModalOpen(true)}
              title="Bulk Operations"
            >
              <Icon name="Settings" size={20} />
            </Button>
          )}
        </div>
      </main>
      {/* Modals */}
      <BulkOperationsModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        selectedArticles={selectedArticles}
        onApply={handleBulkOperation}
      />
      <ImportExportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        mode="import"
      />
      <ImportExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        mode="export"
      />
    </div>
  );
};

export default KnowledgeBaseManagement;