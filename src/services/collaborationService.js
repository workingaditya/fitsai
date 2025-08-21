// Demo collaboration service - no database integration

class CollaborationService {
  // Session Management
  async getCollaborationSessions(filters = {}) {
    try {
      // Return mock collaboration sessions for demo
      const mockSessions = [
        {
          id: '1',
          document_id: 'doc-1',
          status: 'active',
          created_by: 'admin@company.com',
          created_at: new Date().toISOString(),
          session_name: 'FITS Architecture Review',
          max_participants: 10,
          websocket_room_id: 'room_demo_123',
          document: {
            id: 'doc-1',
            title_en: 'FITS AI Architecture Document',
            title_ar: 'وثيقة هندسة ذكاء FITS الاصطناعي',
            status: 'draft'
          },
          created_by_profile: {
            id: 'admin@company.com',
            display_name: 'Admin User',
            department: 'Engineering'
          }
        }
      ];

      let result = mockSessions;
      
      if (filters?.document_id) {
        result = result.filter(session => session.document_id === filters.document_id);
      }
      if (filters?.status) {
        result = result.filter(session => session.status === filters.status);
      }
      if (filters?.created_by) {
        result = result.filter(session => session.created_by === filters.created_by);
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch collaboration sessions: ${error?.message}`);
    }
  }

  async createCollaborationSession(sessionData) {
    throw new Error('Session creation not available in demo mode');
  }

  async updateSessionStatus(sessionId, status) {
    throw new Error('Session updates not available in demo mode');
  }

  // Participant Management  
  async getSessionParticipants(sessionId) {
    try {
      // Return mock participants
      return [
        {
          id: '1',
          session_id: sessionId,
          user_id: 'admin@company.com',
          role: 'moderator',
          joined_at: new Date().toISOString(),
          user_profile: {
            id: 'admin@company.com',
            display_name: 'Admin User',
            department: 'Engineering',
            role: 'admin'
          }
        }
      ];
    } catch (error) {
      throw new Error(`Failed to fetch session participants: ${error?.message}`);
    }
  }

  async addParticipant(sessionId, userId, role = 'participant') {
    throw new Error('Adding participants not available in demo mode');
  }

  async updateParticipantRole(sessionId, userId, newRole) {
    throw new Error('Role updates not available in demo mode');
  }

  async removeParticipant(sessionId, userId) {
    throw new Error('Removing participants not available in demo mode');
  }

  // Conflict Management
  async getSyncConflicts(sessionId, filters = {}) {
    try {
      // Return empty conflicts for demo
      return [];
    } catch (error) {
      throw new Error(`Failed to fetch sync conflicts: ${error?.message}`);
    }
  }

  async createSyncConflict(conflictData) {
    throw new Error('Conflict creation not available in demo mode');
  }

  async resolveSyncConflict(conflictId, resolution) {
    throw new Error('Conflict resolution not available in demo mode');
  }

  // Real-time subscriptions (demo implementations)
  subscribeToSessionUpdates(sessionId, callback) {
    return {
      unsubscribe: () => console.log(`Unsubscribed from session ${sessionId} updates`)
    };
  }

  subscribeToParticipantUpdates(sessionId, callback) {
    return {
      unsubscribe: () => console.log(`Unsubscribed from participant updates for session ${sessionId}`)
    };
  }

  unsubscribe(channel) {
    if (channel?.unsubscribe) {
      channel.unsubscribe();
    }
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;