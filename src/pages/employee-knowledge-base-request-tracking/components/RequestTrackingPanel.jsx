import React, { useState } from 'react';
import { MessageSquare, ChevronRight, Plus, Filter, Star } from 'lucide-react';

const RequestTrackingPanel = ({ 
  userRequests, 
  setUserRequests, 
  getStatusIcon, 
  getStatusColor, 
  onNewRequest 
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'resolved'
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = userRequests?.filter(request => {
    if (filter === 'active') {
      return request?.status !== 'resolved';
    }
    if (filter === 'resolved') {
      return request?.status === 'resolved';
    }
    return true;
  });

  const getStatusMessage = (request) => {
    switch (request?.status) {
      case 'submitted':
        return 'Your request has been submitted and is awaiting assignment.';
      case 'in-progress':
        return `Being worked on by ${request?.assignedTo}. Estimated completion: ${formatTime(request?.estimatedCompletion)}.`;
      case 'waiting-for-approval':
        return 'Waiting for manager approval before proceeding.';
      case 'resolved':
        return `Resolved by ${request?.assignedTo} on ${formatDate(request?.completedAt)}.`;
      default:
        return 'Status update coming soon.';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = date?.getTime() - now?.getTime();
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'within 1 hour';
    if (hours === 1) return '1 hour';
    if (hours < 24) return `${hours} hours`;
    
    const days = Math.ceil(hours / 24);
    return days === 1 ? '1 day' : `${days} days`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now?.getTime() - date?.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleRateExperience = (requestId, rating) => {
    setUserRequests(prev => prev?.map(req => 
      req?.id === requestId 
        ? { ...req, rating, ratedAt: new Date() }
        : req
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Requests</h2>
          <button
            onClick={onNewRequest}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 flex items-center gap-2 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1">
          {[
            { id: 'all', label: 'All', count: userRequests?.length },
            { id: 'active', label: 'Active', count: userRequests?.filter(r => r?.status !== 'resolved')?.length },
            { id: 'resolved', label: 'Resolved', count: userRequests?.filter(r => r?.status === 'resolved')?.length }
          ]?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setFilter(tab?.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab?.id
                  ? 'bg-sidebar-active text-primary' :'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab?.label} ({tab?.count})
            </button>
          ))}
        </div>
      </div>
      {/* Requests List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRequests?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {filter === 'resolved' ? 'No resolved requests' : 'No active requests'}
            </h3>
            <p className="text-text-secondary mb-4">
              {filter === 'resolved' ?'Completed requests will appear here' :'Submit a request when you need IT help'
              }
            </p>
            {filter !== 'resolved' && (
              <button
                onClick={onNewRequest}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Your First Request
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {filteredRequests?.map(request => (
              <div
                key={request?.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelectedRequest(request?.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(request?.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request?.status)}`}>
                        {request?.status?.replace('-', ' ')?.toUpperCase()}
                      </span>
                      <span className="text-xs text-text-secondary">{request?.category}</span>
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{request?.title}</h3>
                    <p className="text-sm text-text-secondary mb-2">{request?.description}</p>
                    
                    {/* Status Message */}
                    <div className="bg-muted rounded-lg p-3 mb-3">
                      <p className="text-sm text-foreground">{getStatusMessage(request)}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>Created {getTimeAgo(request?.created)}</span>
                      {request?.messages > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{request?.messages} messages</span>
                        </div>
                      )}
                    </div>

                    {/* Last Message Preview */}
                    {request?.lastMessage && (
                      <div className="mt-2 p-2 bg-primary/10 rounded text-sm text-foreground">
                        <span className="text-xs text-text-secondary">Latest update:</span><br />
                        "{request?.lastMessage}"
                      </div>
                    )}

                    {/* Rating Section for Resolved Requests */}
                    {request?.status === 'resolved' && !request?.rating && (
                      <div className="mt-3 p-3 bg-success/10 border border-success rounded-lg">
                        <p className="text-sm font-medium text-success mb-2">How was your experience?</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5]?.map(rating => (
                            <button
                              key={rating}
                              onClick={(e) => {
                                e?.stopPropagation();
                                handleRateExperience(request?.id, rating);
                              }}
                              className="text-muted-foreground hover:text-warning transition-colors"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show Rating if Given */}
                    {request?.rating && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-text-secondary">
                        <span>Rated:</span>
                        {[1, 2, 3, 4, 5]?.map(star => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= request?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestTrackingPanel;