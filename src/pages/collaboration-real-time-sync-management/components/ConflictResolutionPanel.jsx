import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  RefreshCw,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Zap
} from 'lucide-react';
import collaborationService from '../../../services/collaborationService';

const ConflictResolutionPanel = ({ sessionId, conflicts, onConflictResolved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedConflict, setExpandedConflict] = useState(null);
  const [resolutionStrategy, setResolutionStrategy] = useState('');

  const handleResolveConflict = async (conflictId, strategy) => {
    try {
      setLoading(true);
      setError('');
      await collaborationService?.resolveConflict(conflictId, { strategy });
      onConflictResolved?.();
    } catch (err) {
      setError(`Failed to resolve conflict: ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getConflictTypeIcon = (type) => {
    switch (type) {
      case 'concurrent_edit': return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'version_mismatch': return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'permission_denied': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'network_error': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConflictTypeColor = (type) => {
    switch (type) {
      case 'concurrent_edit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'version_mismatch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'permission_denied': return 'bg-red-100 text-red-800 border-red-200';
      case 'network_error': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 3) return 'text-red-600 font-semibold';
    if (priority === 2) return 'text-yellow-600 font-medium';
    return 'text-gray-600';
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 3) return 'High';
    if (priority === 2) return 'Medium';
    return 'Low';
  };

  const unresolvedConflicts = conflicts?.filter(c => !c?.is_resolved) || [];
  const resolvedConflicts = conflicts?.filter(c => c?.is_resolved) || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Sync Conflicts ({unresolvedConflicts?.length} unresolved)
          </h3>
          <div className="text-sm text-gray-600">
            Total: {conflicts?.length || 0}
          </div>
        </div>
      </div>
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}
      <div className="p-6">
        {/* Unresolved Conflicts */}
        {unresolvedConflicts?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
              Unresolved Conflicts
            </h4>
            <div className="space-y-3">
              {unresolvedConflicts?.map((conflict) => (
                <div key={conflict?.id} className="border border-red-200 rounded-lg">
                  <div
                    className="p-4 cursor-pointer hover:bg-red-50 transition-colors"
                    onClick={() => setExpandedConflict(
                      expandedConflict === conflict?.id ? null : conflict?.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded-full text-xs border ${getConflictTypeColor(conflict?.conflict_type)}`}>
                          <div className="flex items-center space-x-1">
                            {getConflictTypeIcon(conflict?.conflict_type)}
                            <span className="capitalize">
                              {conflict?.conflict_type?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Conflict #{conflict?.id?.slice(0, 8)}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className={getPriorityColor(conflict?.priority)}>
                              Priority: {getPriorityLabel(conflict?.priority)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(conflict?.created_at)?.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={resolutionStrategy}
                          onChange={(e) => setResolutionStrategy(e?.target?.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          onClick={(e) => e?.stopPropagation()}
                        >
                          <option value="">Select Resolution</option>
                          <option value="accept_local">Accept Local Changes</option>
                          <option value="accept_remote">Accept Remote Changes</option>
                          <option value="merge_manual">Manual Merge</option>
                          <option value="rollback">Rollback to Previous</option>
                        </select>
                        
                        <button
                          onClick={(e) => {
                            e?.stopPropagation();
                            if (resolutionStrategy) {
                              handleResolveConflict(conflict?.id, resolutionStrategy);
                            }
                          }}
                          disabled={loading || !resolutionStrategy}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? 'Resolving...' : 'Resolve'}
                        </button>

                        {expandedConflict === conflict?.id ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Conflict Details */}
                    {expandedConflict === conflict?.id && (
                      <div className="mt-4 pt-4 border-t border-red-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Conflict Details</h5>
                            <div className="space-y-1 text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="w-3 h-3" />
                                <span>User 1: {conflict?.user1_profile?.display_name || 'Unknown'}</span>
                              </div>
                              {conflict?.user2_profile && (
                                <div className="flex items-center space-x-2">
                                  <User className="w-3 h-3" />
                                  <span>User 2: {conflict?.user2_profile?.display_name}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <FileText className="w-3 h-3" />
                                <span>Document ID: {conflict?.document_id?.slice(0, 8)}...</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Conflict Data</h5>
                            <div className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(conflict?.conflict_data, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>

                        {/* Resolution Options */}
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-900 mb-2">Available Resolution Options</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {conflict?.conflict_data?.resolution_options?.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setResolutionStrategy(option);
                                  handleResolveConflict(conflict?.id, option);
                                }}
                                className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                {option?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                              </button>
                            )) || (
                              <p className="text-xs text-gray-500 col-span-2">
                                No specific resolution options available
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved Conflicts */}
        {resolvedConflicts?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Recently Resolved ({resolvedConflicts?.slice(0, 3)?.length} of {resolvedConflicts?.length})
            </h4>
            <div className="space-y-2">
              {resolvedConflicts?.slice(0, 3)?.map((conflict) => (
                <div key={conflict?.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {conflict?.conflict_type?.replace('_', ' ')} conflict resolved
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <span>Strategy: {conflict?.resolution_strategy?.replace('_', ' ')}</span>
                          <span>By: {conflict?.resolved_by_profile?.display_name || 'System'}</span>
                          <span>{new Date(conflict?.resolved_at)?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {conflicts?.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-500">No sync conflicts detected</p>
            <p className="text-sm text-gray-400 mt-1">
              All participants are synchronized successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConflictResolutionPanel;