import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Users, 
  FileText, 
  AlertTriangle, 
  Settings,
  ExternalLink,
  Activity
} from 'lucide-react';

const SessionDetailsPanel = ({ session, participants, onStatusChange, onRefresh }) => {
  if (!session) return null;

  const activeParticipants = participants?.filter(p => p?.is_active) || [];
  const sessionDuration = session?.started_at ? 
    Math.floor((new Date() - new Date(session.started_at)) / 1000 / 60) : 0;

  const getStatusActions = (status) => {
    const baseClasses = "px-3 py-1 rounded text-sm font-medium transition-colors";
    
    switch (status) {
      case 'active':
        return [
          {
            label: 'Pause',
            action: () => onStatusChange?.(session?.id, 'paused'),
            icon: Pause,
            className: `${baseClasses} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`
          },
          {
            label: 'Stop',
            action: () => onStatusChange?.(session?.id, 'completed'),
            icon: Square,
            className: `${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`
          }
        ];
      case 'paused':
        return [
          {
            label: 'Resume',
            action: () => onStatusChange?.(session?.id, 'active'),
            icon: Play,
            className: `${baseClasses} bg-green-100 text-green-700 hover:bg-green-200`
          },
          {
            label: 'Stop',
            action: () => onStatusChange?.(session?.id, 'completed'),
            icon: Square,
            className: `${baseClasses} bg-red-100 text-red-700 hover:bg-red-200`
          }
        ];
      case 'error':
        return [
          {
            label: 'Restart',
            action: () => onStatusChange?.(session?.id, 'active'),
            icon: Play,
            className: `${baseClasses} bg-blue-100 text-blue-700 hover:bg-blue-200`
          }
        ];
      default:
        return [];
    }
  };

  const statusActions = getStatusActions(session?.status);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {session?.session_name || 'Unnamed Session'}
              </h2>
              <p className="text-sm text-gray-600">
                Session ID: {session?.id?.slice(0, 8)}...
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {statusActions?.map((action, index) => {
              const IconComponent = action?.icon;
              return (
                <button
                  key={index}
                  onClick={action?.action}
                  className={action?.className}
                  title={action?.label}
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  {action?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Session Overview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Duration</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {sessionDuration} min
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Active Users</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {activeParticipants?.length} / {session?.max_participants || 10}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Response Time</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {session?.performance_metrics?.avg_response_time || 0}ms
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total Edits</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {session?.performance_metrics?.total_edits || 0}
            </p>
          </div>
        </div>

        {/* Document Information */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Document Details
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {session?.document?.title_en || 'Unknown Document'}
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="capitalize">{session?.document?.status || 'unknown'}</span>
                </p>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Session Configuration */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Session Configuration
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Auto Save:</span>
                <span className="ml-2 text-gray-900">
                  {session?.session_config?.auto_save ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Conflict Resolution:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {session?.session_config?.conflict_resolution || 'Manual'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Max Idle Time:</span>
                <span className="ml-2 text-gray-900">
                  {Math.floor((session?.session_config?.max_idle_time || 3600) / 60)} min
                </span>
              </div>
              <div>
                <span className="text-gray-600">WebSocket Room:</span>
                <span className="ml-2 text-gray-900 font-mono text-xs">
                  {session?.websocket_room_id?.slice(0, 12)}...
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Timeline */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Session Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Session started</p>
                <p className="text-xs text-gray-500">
                  {new Date(session?.started_at)?.toLocaleString()}
                </p>
              </div>
            </div>
            
            {session?.ended_at && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Session ended</p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.ended_at)?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Current status: <span className="capitalize font-medium">{session?.status}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(session?.updated_at)?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPanel;