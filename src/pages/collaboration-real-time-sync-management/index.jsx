import React, { useState, useEffect } from 'react';
import { Activity, Users, AlertTriangle, BarChart3, Play, Pause, Square, Search, RefreshCw, Monitor } from 'lucide-react';
import collaborationService from '../../services/collaborationService';
import SessionDetailsPanel from './components/SessionDetailsPanel';
import ParticipantManager from './components/ParticipantManager';
import ConflictResolutionPanel from './components/ConflictResolutionPanel';
import PerformanceMetrics from './components/PerformanceMetrics';
import SessionFilters from './components/SessionFilters';

const CollaborationRealTimeSyncManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    document_id: 'all',
    date_range: '7d'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [realtimeCleanup, setRealtimeCleanup] = useState(null);

  // Load initial data
  useEffect(() => {
    loadCollaborationData();
  }, [activeFilters]);

  // Setup real-time subscriptions when session is selected
  useEffect(() => {
    if (selectedSession?.id) {
      const cleanup = collaborationService?.subscribeToSessionChanges(
        selectedSession?.id,
        {
          onSessionUpdate: (payload) => {
            setSessions(prev => 
              prev?.map(session => 
                session?.id === payload?.new?.id ? { ...session, ...payload?.new } : session
              )
            );
          },
          onParticipantChange: (payload) => {
            if (payload?.eventType === 'INSERT') {
              loadParticipants(selectedSession?.id);
            } else if (payload?.eventType === 'UPDATE') {
              setParticipants(prev => 
                prev?.map(p => p?.id === payload?.new?.id ? { ...p, ...payload?.new } : p)
              );
            }
          },
          onConflictChange: (payload) => {
            if (payload?.eventType === 'INSERT') {
              loadConflicts(selectedSession?.id);
            } else if (payload?.eventType === 'UPDATE') {
              setConflicts(prev => 
                prev?.map(c => c?.id === payload?.new?.id ? { ...c, ...payload?.new } : c)
              );
            }
          }
        }
      );
      setRealtimeCleanup(() => cleanup);
    }

    return () => {
      if (realtimeCleanup) {
        realtimeCleanup();
      }
    };
  }, [selectedSession?.id]);

  const loadCollaborationData = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = activeFilters?.status !== 'all' ? { status: activeFilters?.status } : {};
      if (activeFilters?.document_id !== 'all') {
        filters.document_id = activeFilters?.document_id;
      }

      const sessionsData = await collaborationService?.getCollaborationSessions(filters);
      setSessions(sessionsData || []);

      // Load data for selected session if exists
      if (selectedSession?.id) {
        await loadSessionDetails(selectedSession?.id);
      }
    } catch (err) {
      setError(`Failed to load collaboration data: ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetails = async (sessionId) => {
    try {
      const [participantsData, conflictsData, analyticsData] = await Promise.all([
        collaborationService?.getSessionParticipants(sessionId),
        collaborationService?.getSyncConflicts(sessionId),
        collaborationService?.getSessionAnalytics(sessionId)
      ]);

      setParticipants(participantsData || []);
      setConflicts(conflictsData || []);
      setAnalytics(analyticsData || []);
    } catch (err) {
      setError(`Failed to load session details: ${err?.message}`);
    }
  };

  const loadParticipants = async (sessionId) => {
    try {
      const data = await collaborationService?.getSessionParticipants(sessionId);
      setParticipants(data || []);
    } catch (err) {
      setError(`Failed to load participants: ${err?.message}`);
    }
  };

  const loadConflicts = async (sessionId) => {
    try {
      const data = await collaborationService?.getSyncConflicts(sessionId);
      setConflicts(data || []);
    } catch (err) {
      setError(`Failed to load conflicts: ${err?.message}`);
    }
  };

  const handleSessionSelect = async (session) => {
    setSelectedSession(session);
    if (session?.id) {
      await loadSessionDetails(session?.id);
    }
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await collaborationService?.updateSessionStatus(sessionId, newStatus);
      await loadCollaborationData();
      setError('');
    } catch (err) {
      setError(`Failed to update session status: ${err?.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-600" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'completed': return <Square className="w-4 h-4 text-gray-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Monitor className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredSessions = sessions?.filter(session => 
    session?.session_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    session?.document?.title_en?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    session?.created_by_profile?.display_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  ) || [];

  const activeSessionsCount = sessions?.filter(s => s?.status === 'active')?.length || 0;
  const totalParticipants = participants?.filter(p => p?.is_active)?.length || 0;
  const unresolvedConflicts = conflicts?.filter(c => !c?.is_resolved)?.length || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading collaboration management...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Collaboration & Real-time Sync Management</h1>
              <p className="text-gray-600">Monitor active sessions, manage participants, and resolve sync conflicts</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-green-600">
                <Activity className="w-4 h-4" />
                <span>{activeSessionsCount} Active</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <Users className="w-4 h-4" />
                <span>{totalParticipants} Online</span>
              </div>
              <div className="flex items-center space-x-1 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{unresolvedConflicts} Conflicts</span>
              </div>
            </div>
            <button
              onClick={loadCollaborationData}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Sidebar - Session Filters & List (25%) */}
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions, documents, users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <SessionFilters 
              filters={activeFilters}
              onFiltersChange={setActiveFilters}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Active Sessions ({filteredSessions?.length})</h3>
              <div className="space-y-2">
                {filteredSessions?.map((session) => (
                  <div
                    key={session?.id}
                    onClick={() => handleSessionSelect(session)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSession?.id === session?.id
                        ? 'bg-blue-50 border border-blue-200' :'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {session?.session_name || 'Unnamed Session'}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(session?.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(session?.status)}
                          <span className="capitalize">{session?.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1">
                      Doc: {session?.document?.title_en || 'Unknown Document'}
                    </p>
                    <p className="text-xs text-gray-500">
                      By: {session?.created_by_profile?.display_name || 'Unknown User'}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{new Date(session?.started_at)?.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>{session?.performance_metrics?.concurrent_users || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredSessions?.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No collaboration sessions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area (50%) */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedSession ? (
            <div className="p-6">
              <SessionDetailsPanel
                session={selectedSession}
                participants={participants}
                onStatusChange={handleStatusChange}
                onRefresh={() => loadSessionDetails(selectedSession?.id)}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ParticipantManager
                  sessionId={selectedSession?.id}
                  participants={participants}
                  onParticipantUpdate={() => loadParticipants(selectedSession?.id)}
                />
                
                <ConflictResolutionPanel
                  sessionId={selectedSession?.id}
                  conflicts={conflicts}
                  onConflictResolved={() => loadConflicts(selectedSession?.id)}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Collaboration Session</h3>
                <p className="text-gray-600 max-w-md">
                  Choose a session from the left sidebar to view detailed information, 
                  manage participants, and monitor real-time sync status.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Performance & Analytics (25%) */}
        <div className="w-1/4 bg-white border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Analytics
            </h3>
          </div>
          
          <div className="p-4">
            {selectedSession ? (
              <PerformanceMetrics
                sessionId={selectedSession?.id}
                analytics={analytics}
                session={selectedSession}
              />
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Select a session to view performance metrics and analytics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationRealTimeSyncManagement;