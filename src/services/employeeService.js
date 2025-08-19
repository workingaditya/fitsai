import { supabase } from '../lib/supabase';

export const employeeService = {
  // Get employee's conversation history (their support requests)
  async getEmployeeConversations(userId) {
    try {
      const { data, error } = await supabase?.from('llm_conversations')?.select(`*,llm_usage_metrics:llm_metric_id (model_name,tokens_used,response_time_ms)`)?.eq('user_id', userId)?.order('started_at', { ascending: false })?.limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching employee conversations:', error);
      throw error;
    }
  },

  // Get available knowledge base articles for employees
  async getAvailableKnowledgeBase(searchTerm = '', categoryId = null) {
    try {
      let query = supabase?.from('documents')?.select(`id,title_en,summary_en,content_en,tags,view_count,updated_at,categories:category_id (id,name_en,description_en)`)?.eq('status', 'published')?.eq('access_level', 'internal');

      if (searchTerm) {
        query = query?.or(`title_en.ilike.%${searchTerm}%,content_en.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`);
      }

      if (categoryId) {
        query = query?.eq('category_id', categoryId);
      }

      const { data, error } = await query?.order('view_count', { ascending: false })?.limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      throw error;
    }
  },

  // Create a new support conversation
  async createSupportConversation(userId, initialMessage, conversationTitle = null) {
    try {
      const sessionId = `employee_session_${Date.now()}_${Math.random()?.toString(36)?.substr(2, 9)}`;
      
      // First create the conversation record
      const { data: conversation, error: conversationError } = await supabase?.from('llm_conversations')?.insert({
          session_id: sessionId,
          user_id: userId,
          conversation_title: conversationTitle || `Support Chat - ${new Date()?.toLocaleDateString()}`,
          started_at: new Date()?.toISOString(),
          message_count: 1,
          metadata: {
            source: 'employee_support_portal',initial_message: initialMessage,user_type: 'employee'
          },
          context_maintained: true
        })?.select()?.single();

      if (conversationError) throw conversationError;

      return {
        conversationId: conversation?.id,
        sessionId: sessionId,
        conversation: conversation
      };
    } catch (error) {
      console.error('Error creating support conversation:', error);
      throw error;
    }
  },

  // Update conversation with new message
  async updateConversationProgress(conversationId, messageCount, duration = null) {
    try {
      const updateData = {
        message_count: messageCount,
        updated_at: new Date()?.toISOString()
      };

      if (duration) {
        updateData.session_duration_seconds = duration;
      }

      const { data, error } = await supabase?.from('llm_conversations')?.update(updateData)?.eq('id', conversationId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  // End a conversation
  async endConversation(conversationId, satisfactionRating = null) {
    try {
      const updateData = {
        ended_at: new Date()?.toISOString()
      };

      if (satisfactionRating) {
        updateData.satisfaction_rating = satisfactionRating;
      }

      const { data, error } = await supabase?.from('llm_conversations')?.update(updateData)?.eq('id', conversationId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error ending conversation:', error);
      throw error;
    }
  },

  // Get knowledge base categories for navigation
  async getKnowledgeCategories() {
    try {
      const { data, error } = await supabase?.from('categories')?.select('id, name_en, description_en, parent_id')?.order('name_en');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Increment document view count when employee accesses it
  async incrementDocumentViews(documentId) {
    try {
      const { data, error } = await supabase?.rpc('increment_document_views', {
        doc_id: documentId
      });

      if (error) {
        // Fallback method if RPC function doesn't exist
        const { data: current } = await supabase?.from('documents')?.select('view_count')?.eq('id', documentId)?.single();

        if (current) {
          await supabase?.from('documents')?.update({ view_count: (current?.view_count || 0) + 1 })?.eq('id', documentId);
        }
      }

      return data;
    } catch (error) {
      console.error('Error incrementing document views:', error);
      // Don't throw error for view counting - it's not critical
    }
  },

  // Get employee's profile and preferences
  async getEmployeeProfile(userId) {
    try {
      const { data, error } = await supabase?.from('profiles')?.select('id, user_id, display_name, department, language_preference, role')?.eq('user_id', userId)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  },

  // Submit feedback for a conversation
  async submitConversationFeedback(conversationId, rating, feedback = null) {
    try {
      const updateData = {
        satisfaction_rating: rating,
        metadata: {
          feedback: feedback,
          feedback_timestamp: new Date()?.toISOString()
        }
      };

      const { data, error } = await supabase?.from('llm_conversations')?.update(updateData)?.eq('id', conversationId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
};