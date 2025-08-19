import { supabase } from '../lib/supabase';

class CollaborationService {
  // Session Management
  async getCollaborationSessions(filters = {}) {
    try {
      let query = supabase?.from('collaboration_sessions')?.select(`
          *,
          document:documents(id, title_en, title_ar, status),
          created_by_profile:profiles!collaboration_sessions_created_by_fkey(id, display_name, department)
        `)?.order('created_at', { ascending: false });

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      if (filters?.document_id) {
        query = query?.eq('document_id', filters?.document_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch collaboration sessions: ${error.message}`);
    }
  }

  async createCollaborationSession(sessionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User not authenticated');

      const sessionPayload = {
        document_id: sessionData?.document_id,
        session_name: sessionData?.session_name,
        created_by: user?.id,
        max_participants: sessionData?.max_participants || 10,
        websocket_room_id: `room_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`,
        session_config: sessionData?.session_config || {}
      };

      const { data, error } = await supabase?.from('collaboration_sessions')?.insert([sessionPayload])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create collaboration session: ${error.message}`);
    }
  }

  async updateSessionStatus(sessionId, status) {
    try {
      const updateData = { 
        status,
        updated_at: new Date()?.toISOString()
      };
      
      if (status === 'completed') {
        updateData.ended_at = new Date()?.toISOString();
      }

      const { data, error } = await supabase?.from('collaboration_sessions')?.update(updateData)?.eq('id', sessionId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update session status: ${error.message}`);
    }
  }

  // Participant Management  
  async getSessionParticipants(sessionId) {
    try {
      const { data, error } = await supabase?.from('session_participants')?.select(`
          *,
          user_profile:profiles!session_participants_user_id_fkey(id, display_name, department, role)
        `)?.eq('session_id', sessionId)?.order('joined_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch session participants: ${error.message}`);
    }
  }

  async addParticipant(sessionId, userId, role = 'viewer') {
    try {
      const participantData = {
        session_id: sessionId,
        user_id: userId,
        role,
        joined_at: new Date()?.toISOString(),
        last_activity_at: new Date()?.toISOString()
      };

      const { data, error } = await supabase?.from('session_participants')?.insert([participantData])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to add participant: ${error.message}`);
    }
  }

  async updateParticipantActivity(sessionId, userId, activityData = {}) {
    try {
      const updateData = {
        last_activity_at: new Date()?.toISOString(),
        is_active: true,
        ...activityData
      };

      if (activityData?.cursor_position) {
        updateData.cursor_position = activityData?.cursor_position;
      }

      const { data, error } = await supabase?.from('session_participants')?.update(updateData)?.eq('session_id', sessionId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update participant activity: ${error.message}`);
    }
  }

  async removeParticipant(sessionId, userId) {
    try {
      const { data, error } = await supabase?.from('session_participants')?.update({ 
          is_active: false, 
          left_at: new Date()?.toISOString() 
        })?.eq('session_id', sessionId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to remove participant: ${error.message}`);
    }
  }

  // Conflict Management
  async getSyncConflicts(sessionId, options = {}) {
    try {
      let query = supabase?.from('sync_conflicts')?.select(`
          *,
          user1_profile:profiles!sync_conflicts_user1_id_fkey(id, display_name),
          user2_profile:profiles!sync_conflicts_user2_id_fkey(id, display_name),
          resolved_by_profile:profiles!sync_conflicts_resolved_by_fkey(id, display_name)
        `)?.eq('session_id', sessionId)?.order('created_at', { ascending: false });

      if (options?.is_resolved !== undefined) {
        query = query?.eq('is_resolved', options?.is_resolved);
      }
      if (options?.conflict_type) {
        query = query?.eq('conflict_type', options?.conflict_type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch sync conflicts: ${error.message}`);
    }
  }

  async createSyncConflict(conflictData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User not authenticated');

      const conflictPayload = {
        session_id: conflictData?.session_id,
        document_id: conflictData?.document_id,
        conflict_type: conflictData?.conflict_type,
        user1_id: user?.id,
        user2_id: conflictData?.user2_id,
        conflict_data: conflictData?.conflict_data || {},
        priority: conflictData?.priority || 1
      };

      const { data, error } = await supabase?.from('sync_conflicts')?.insert([conflictPayload])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create sync conflict: ${error.message}`);
    }
  }

  async resolveConflict(conflictId, resolution) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase?.from('sync_conflicts')?.update({
          is_resolved: true,
          resolved_by: user?.id,
          resolved_at: new Date()?.toISOString(),
          resolution_strategy: resolution?.strategy,
          updated_at: new Date()?.toISOString()
        })?.eq('id', conflictId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to resolve conflict: ${error.message}`);
    }
  }

  // Analytics and Performance
  async getSessionAnalytics(sessionId, metricName = null) {
    try {
      let query = supabase?.from('session_analytics')?.select('*')?.eq('session_id', sessionId)?.order('recorded_at', { ascending: false });

      if (metricName) {
        query = query?.eq('metric_name', metricName);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch session analytics: ${error.message}`);
    }
  }

  async recordAnalytic(sessionId, metricName, metricValue, metricData = {}) {
    try {
      const analyticsPayload = {
        session_id: sessionId,
        metric_name: metricName,
        metric_value: metricValue,
        metric_data: metricData,
        recorded_at: new Date()?.toISOString()
      };

      const { data, error } = await supabase?.from('session_analytics')?.insert([analyticsPayload])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to record analytic: ${error.message}`);
    }
  }

  // Real-time Subscriptions
  subscribeToSessionChanges(sessionId, callbacks = {}) {
    const channels = [];

    // Session updates
    if (callbacks?.onSessionUpdate) {
      const sessionChannel = supabase?.channel(`session_${sessionId}`)?.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'collaboration_sessions',
            filter: `id=eq.${sessionId}`
          },
          callbacks?.onSessionUpdate
        )?.subscribe();
      channels?.push(sessionChannel);
    }

    // Participant changes
    if (callbacks?.onParticipantChange) {
      const participantChannel = supabase?.channel(`participants_${sessionId}`)?.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public', 
            table: 'session_participants',
            filter: `session_id=eq.${sessionId}`
          },
          callbacks?.onParticipantChange
        )?.subscribe();
      channels?.push(participantChannel);
    }

    // Conflict changes
    if (callbacks?.onConflictChange) {
      const conflictChannel = supabase?.channel(`conflicts_${sessionId}`)?.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sync_conflicts',
            filter: `session_id=eq.${sessionId}`
          },
          callbacks?.onConflictChange
        )?.subscribe();
      channels?.push(conflictChannel);
    }

    // Return cleanup function
    return () => {
      channels?.forEach(channel => {
        supabase?.removeChannel(channel);
      });
    };
  }

  // Utility methods
  async getDocuments() {
    try {
      const { data, error } = await supabase?.from('documents')?.select('id, title_en, title_ar, status, created_at')?.eq('status', 'published')?.order('title_en');

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  async getUserProfiles() {
    try {
      const { data, error } = await supabase?.from('profiles')?.select('id, display_name, department, role')?.order('display_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch user profiles: ${error.message}`);
    }
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;