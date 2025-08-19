import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import NotFound from './pages/NotFound';

// Admin-only pages
import UserManagementRoleBasedAccessControl from './pages/user-management-role-based-access-control';
import SystemAdministrationConfigurationSettings from './pages/system-administration-configuration-settings';
import AuditTrailComplianceReporting from './pages/audit-trail-compliance-reporting';
import BackendArchitectureApiManagement from './pages/backend-architecture-api-management';
import MultiTenantConfigurationProviderManagement from './pages/multi-tenant-configuration-provider-management';
import LLMModelConfigurationPerformanceMonitoring from './pages/llm-model-configuration-performance-monitoring';
import CollaborationRealTimeSyncManagement from './pages/collaboration-real-time-sync-management';
import IntegrationStatusServiceHealthMonitoring from './pages/integration-status-service-health-monitoring';
import VectorSearchEmbeddingHealthDashboard from './pages/vector-search-embedding-health-dashboard';
import LLMUsageAnalyticsPerformanceDashboard from './pages/llm-usage-analytics-performance-dashboard';
import ConversationHistorySearchAnalytics from './pages/conversation-history-search-analytics';
import KnowledgeBaseManagementContentAdministration from './pages/knowledge-base-management-content-administration';
import AiChatInterfaceConversationManagement from './pages/ai-chat-interface-conversation-management';

// Employee-only pages
import EmployeeITSupportPortal from './pages/employee-it-support-portal';
import EmployeeChatSupportInterface from './pages/employee-chat-support-interface';
import EmployeeKnowledgeBaseRequestTracking from './pages/employee-knowledge-base-request-tracking';
import ITDashboardKnowledgeOverview from './pages/it-dashboard-knowledge-overview';

// Auth pages
import AuthenticationSSOLogin from './pages/authentication-sso-login';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null, adminOnly = false, employeeOnly = false }) => {
  const { user, loading, isAdmin, isEmployee } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only routes
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  // Employee-only routes
  if (employeeOnly && !isEmployee()) {
    return <Navigate to="/admin/users" replace />;
  }

  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user, loading, isAdmin, isEmployee } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (isAdmin()) {
    return <Navigate to="/admin/users" replace />;
  } else if (isEmployee()) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  // Default fallback
  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/login" element={<AuthenticationSSOLogin />} />
      
      {/* Root redirect based on role */}
      <Route path="/" element={<RoleBasedRedirect />} />
      
      {/* Admin-only routes */}
      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly={true}>
          <UserManagementRoleBasedAccessControl />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/system" element={
        <ProtectedRoute adminOnly={true}>
          <SystemAdministrationConfigurationSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/audit" element={
        <ProtectedRoute adminOnly={true}>
          <AuditTrailComplianceReporting />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/backend" element={
        <ProtectedRoute adminOnly={true}>
          <BackendArchitectureApiManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/tenants" element={
        <ProtectedRoute adminOnly={true}>
          <MultiTenantConfigurationProviderManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/llm-models" element={
        <ProtectedRoute adminOnly={true}>
          <LLMModelConfigurationPerformanceMonitoring />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/collaboration" element={
        <ProtectedRoute adminOnly={true}>
          <CollaborationRealTimeSyncManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/integrations" element={
        <ProtectedRoute adminOnly={true}>
          <IntegrationStatusServiceHealthMonitoring />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/vector-search" element={
        <ProtectedRoute adminOnly={true}>
          <VectorSearchEmbeddingHealthDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/llm-analytics" element={
        <ProtectedRoute adminOnly={true}>
          <LLMUsageAnalyticsPerformanceDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/conversations" element={
        <ProtectedRoute adminOnly={true}>
          <ConversationHistorySearchAnalytics />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/knowledge-base" element={
        <ProtectedRoute adminOnly={true}>
          <KnowledgeBaseManagementContentAdministration />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/ai-chat" element={
        <ProtectedRoute adminOnly={true}>
          <AiChatInterfaceConversationManagement />
        </ProtectedRoute>
      } />

      {/* Employee-only routes */}
      <Route path="/employee/dashboard" element={
        <ProtectedRoute employeeOnly={true}>
          <ITDashboardKnowledgeOverview />
        </ProtectedRoute>
      } />
      
      <Route path="/employee/it-support" element={
        <ProtectedRoute employeeOnly={true}>
          <EmployeeITSupportPortal />
        </ProtectedRoute>
      } />
      
      <Route path="/employee/chat-support" element={
        <ProtectedRoute employeeOnly={true}>
          <EmployeeChatSupportInterface />
        </ProtectedRoute>
      } />
      
      <Route path="/employee/knowledge-base" element={
        <ProtectedRoute employeeOnly={true}>
          <EmployeeKnowledgeBaseRequestTracking />
        </ProtectedRoute>
      } />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
}

export default function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}