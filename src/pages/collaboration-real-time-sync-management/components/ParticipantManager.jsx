import React, { useState } from 'react';
import { Users, UserCheck, UserX, Crown, Edit3, Eye, Clock, Monitor, Smartphone, MapPin } from 'lucide-react';
import collaborationService from '../../../services/collaborationService';

const ParticipantManager = ({ sessionId, participants, onParticipantUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const handleRemoveParticipant = async (userId) => {
    try {
      setLoading(true);
      setError('');
      await collaborationService?.removeParticipant(sessionId, userId);
      onParticipantUpdate?.();
    } catch (err) {
      setError(`Failed to remove participant: ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'editor': return <Edit3 className="w-4 h-4 text-blue-600" />;
      case 'reviewer': return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-600" />;
      default: return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'editor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewer': return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getDeviceIcon = (connectionInfo) => {
    const userAgent = connectionInfo?.browser?.toLowerCase() || '';
    if (userAgent?.includes('mobile') || userAgent?.includes('android') || userAgent?.includes('iphone')) {
      return <Smartphone className="w-4 h-4 text-gray-500" />;
    }
    return <Monitor className="w-4 h-4 text-gray-500" />;
  };

  const getActivityStatus = (lastActivity) => {
    if (!lastActivity) return { status: 'unknown', color: 'text-gray-400', label: 'Unknown' };
    
    const now = new Date();
    const activity = new Date(lastActivity);
    const diffMinutes = Math.floor((now - activity) / (1000 * 60));
    
    if (diffMinutes < 1) return { status: 'active', color: 'text-green-600', label: 'Active now' };
    if (diffMinutes < 5) return { status: 'recent', color: 'text-blue-600', label: `${diffMinutes}m ago` };
    if (diffMinutes < 30) return { status: 'idle', color: 'text-yellow-600', label: `${diffMinutes}m ago` };
    return { status: 'inactive', color: 'text-gray-500', label: `${diffMinutes}m ago` };
  };

  const activeParticipants = participants?.filter(p => p?.is_active) || [];
  const inactiveParticipants = participants?.filter(p => !p?.is_active) || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Participants ({activeParticipants?.length} active)
          </h3>
          <div className="text-sm text-gray-600">
            Total: {participants?.length || 0}
          </div>
        </div>
      </div>
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}
      <div className="p-6">
        {/* Active Participants */}
        {activeParticipants?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Active Participants</h4>
            <div className="space-y-3">
              {activeParticipants?.map((participant) => {
                const activity = getActivityStatus(participant?.last_activity_at);
                return (
                  <div key={participant?.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {participant?.user_profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">
                              {participant?.user_profile?.display_name || 'Unknown User'}
                            </p>
                            <div className={`px-2 py-1 rounded-full text-xs border ${getRoleColor(participant?.role)}`}>
                              <div className="flex items-center space-x-1">
                                {getRoleIcon(participant?.role)}
                                <span className="capitalize">{participant?.role}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span>{participant?.user_profile?.department || 'No Department'}</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span className={activity?.color}>{activity?.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {participant?.connection_info && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            {getDeviceIcon(participant?.connection_info)}
                            <span>{participant?.connection_info?.browser || 'Unknown'}</span>
                          </div>
                        )}
                        
                        {participant?.role !== 'owner' && (
                          <button
                            onClick={() => handleRemoveParticipant(participant?.user_id)}
                            disabled={loading}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remove participant"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Cursor Position Info */}
                    {participant?.cursor_position && Object.keys(participant?.cursor_position)?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>
                              Line {participant?.cursor_position?.line || 'Unknown'}, 
                              Col {participant?.cursor_position?.column || 'Unknown'}
                            </span>
                          </div>
                          {participant?.cursor_position?.selection && (
                            <span>
                              Selection: {participant?.cursor_position?.selection?.start}-{participant?.cursor_position?.selection?.end}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Inactive Participants */}
        {inactiveParticipants?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Recently Left ({inactiveParticipants?.length})
            </h4>
            <div className="space-y-2">
              {inactiveParticipants?.slice(0, 5)?.map((participant) => (
                <div key={participant?.id} className="bg-gray-50 p-3 rounded-lg opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {participant?.user_profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {participant?.user_profile?.display_name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Left: {new Date(participant?.left_at)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${getRoleColor(participant?.role)}`}>
                      <span className="capitalize">{participant?.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {participants?.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No participants in this session</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantManager;