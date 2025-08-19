import { supabase } from '../lib/supabase';

class LLMAnalyticsService {
  // LLM Usage Metrics
  async getLLMUsageMetrics(filters = {}) {
    try {
      let query = supabase?.from('llm_usage_metrics')?.select(`
          *,
          tenant:tenants(id, name, slug, plan),
          service:backend_services(id, name, service_type, status)
        `)?.order('updated_at', { ascending: false });

      if (filters?.tenant_id) {
        query = query?.eq('tenant_id', filters?.tenant_id);
      }
      if (filters?.provider) {
        query = query?.eq('provider', filters?.provider);
      }
      if (filters?.model_status) {
        query = query?.eq('model_status', filters?.model_status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch LLM usage metrics: ${error?.message}`);
    }
  }

  async getLLMMetricById(metricId) {
    try {
      const { data, error } = await supabase?.from('llm_usage_metrics')?.select(`
          *,
          tenant:tenants(id, name, slug, plan),
          service:backend_services(id, name, service_type, status)
        `)?.eq('id', metricId)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch LLM metric: ${error?.message}`);
    }
  }

  async updateLLMMetric(metricId, updateData) {
    try {
      const { data, error } = await supabase?.from('llm_usage_metrics')?.update(updateData)?.eq('id', metricId)?.select(`
          *,
          tenant:tenants(id, name, slug),
          service:backend_services(id, name, service_type)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update LLM metric: ${error?.message}`);
    }
  }

  // LLM Conversations
  async getLLMConversations(filters = {}) {
    try {
      let query = supabase?.from('llm_conversations')?.select(`
          *,
          tenant:tenants(id, name, slug),
          llm_metric:llm_usage_metrics(id, provider, model_name)
        `)?.order('started_at', { ascending: false });

      if (filters?.tenant_id) {
        query = query?.eq('tenant_id', filters?.tenant_id);
      }
      if (filters?.session_id) {
        query = query?.eq('session_id', filters?.session_id);
      }
      if (filters?.timeRange) {
        const timeRanges = {
          '1h': new Date(Date.now() - 60 * 60 * 1000),
          '24h': new Date(Date.now() - 24 * 60 * 60 * 1000),
          '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        };
        if (timeRanges?.[filters?.timeRange]) {
          query = query?.gte('started_at', timeRanges?.[filters?.timeRange]?.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch LLM conversations: ${error?.message}`);
    }
  }

  async createLLMConversation(conversationData) {
    try {
      const { data, error } = await supabase?.from('llm_conversations')?.insert([conversationData])?.select(`
          *,
          tenant:tenants(id, name),
          llm_metric:llm_usage_metrics(id, provider, model_name)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create LLM conversation: ${error?.message}`);
    }
  }

  async updateLLMConversation(conversationId, updateData) {
    try {
      const { data, error } = await supabase?.from('llm_conversations')?.update(updateData)?.eq('id', conversationId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update LLM conversation: ${error?.message}`);
    }
  }

  // Analytics and Performance Calculations
  async getLLMPerformanceSummary(tenantId = null, timeRange = '24h') {
    try {
      const metrics = await this.getLLMUsageMetrics(tenantId ? { tenant_id: tenantId } : {});
      const conversations = await this.getLLMConversations({ tenant_id: tenantId, timeRange });

      const performanceSummary = {
        totalModels: metrics?.length || 0,
        availableModels: metrics?.filter(m => m?.model_status === 'available')?.length || 0,
        totalRequests: metrics?.reduce((sum, m) => sum + (m?.request_count || 0), 0),
        totalTokens: metrics?.reduce((sum, m) => sum + (m?.total_tokens || 0), 0),
        avgResponseTime: metrics?.length > 0 ? 
          metrics?.reduce((sum, m) => sum + (m?.avg_response_time_ms || 0), 0) / metrics?.length : 0,
        totalCost: metrics?.reduce((sum, m) => sum + (parseFloat(m?.total_cost) || 0), 0),
        avgSuccessRate: metrics?.length > 0 ?
          metrics?.reduce((sum, m) => sum + (m?.success_rate || 0), 0) / metrics?.length : 0,
        totalConversations: conversations?.length || 0,
        avgConversationLength: conversations?.length > 0 ?
          conversations?.reduce((sum, c) => sum + (c?.message_count || 0), 0) / conversations?.length : 0,
        modelDistribution: this.groupMetricsByProvider(metrics),
        conversationSatisfaction: this.calculateSatisfactionMetrics(conversations)
      };

      return performanceSummary;
    } catch (error) {
      throw new Error(`Failed to generate LLM performance summary: ${error?.message}`);
    }
  }

  groupMetricsByProvider(metrics) {
    const grouped = {};
    metrics?.forEach(metric => {
      const provider = metric?.provider || 'unknown';
      if (!grouped?.[provider]) {
        grouped[provider] = { 
          models: 0, 
          requests: 0, 
          tokens: 0, 
          cost: 0, 
          avgResponseTime: 0 
        };
      }
      grouped[provider].models++;
      grouped[provider].requests += metric?.request_count || 0;
      grouped[provider].tokens += metric?.total_tokens || 0;
      grouped[provider].cost += parseFloat(metric?.total_cost) || 0;
      grouped[provider].avgResponseTime += metric?.avg_response_time_ms || 0;
    });

    // Calculate averages
    Object.keys(grouped)?.forEach(provider => {
      if (grouped?.[provider]?.models > 0) {
        grouped[provider].avgResponseTime = grouped?.[provider]?.avgResponseTime / grouped?.[provider]?.models;
      }
    });

    return grouped;
  }

  calculateSatisfactionMetrics(conversations) {
    const ratingsWithSatisfaction = conversations?.filter(c => c?.satisfaction_rating);
    if (!ratingsWithSatisfaction?.length) return { average: 0, distribution: {} };

    const totalRating = ratingsWithSatisfaction?.reduce((sum, c) => sum + c?.satisfaction_rating, 0);
    const averageRating = totalRating / ratingsWithSatisfaction?.length;

    const distribution = {};
    ratingsWithSatisfaction?.forEach(c => {
      const rating = c?.satisfaction_rating;
      if (!distribution?.[rating]) distribution[rating] = 0;
      distribution[rating]++;
    });

    return { average: averageRating, distribution };
  }

  // Token Usage Analysis
  async getTokenUsageAnalysis(tenantId, period = '30d') {
    try {
      const metrics = await this.getLLMUsageMetrics({ tenant_id: tenantId });

      const tokenAnalysis = {
        totalTokens: metrics?.reduce((sum, m) => sum + (m?.total_tokens || 0), 0),
        promptTokens: metrics?.reduce((sum, m) => sum + (m?.prompt_tokens || 0), 0),
        completionTokens: metrics?.reduce((sum, m) => sum + (m?.completion_tokens || 0), 0),
        tokensByProvider: this.groupTokensByProvider(metrics),
        tokensByModel: this.groupTokensByModel(metrics),
        costPerToken: this.calculateCostPerToken(metrics),
        efficiency: this.calculateTokenEfficiency(metrics)
      };

      return tokenAnalysis;
    } catch (error) {
      throw new Error(`Failed to analyze token usage: ${error?.message}`);
    }
  }

  groupTokensByProvider(metrics) {
    const grouped = {};
    metrics?.forEach(metric => {
      const provider = metric?.provider || 'unknown';
      if (!grouped?.[provider]) {
        grouped[provider] = { 
          total: 0, 
          prompt: 0, 
          completion: 0, 
          cost: 0 
        };
      }
      grouped[provider].total += metric?.total_tokens || 0;
      grouped[provider].prompt += metric?.prompt_tokens || 0;
      grouped[provider].completion += metric?.completion_tokens || 0;
      grouped[provider].cost += parseFloat(metric?.total_cost) || 0;
    });
    return grouped;
  }

  groupTokensByModel(metrics) {
    const grouped = {};
    metrics?.forEach(metric => {
      const model = metric?.model_name || 'unknown';
      if (!grouped?.[model]) {
        grouped[model] = { 
          total: 0, 
          requests: 0, 
          avgTokensPerRequest: 0, 
          cost: 0 
        };
      }
      grouped[model].total += metric?.total_tokens || 0;
      grouped[model].requests += metric?.request_count || 0;
      grouped[model].cost += parseFloat(metric?.total_cost) || 0;
      
      if (grouped?.[model]?.requests > 0) {
        grouped[model].avgTokensPerRequest = grouped?.[model]?.total / grouped?.[model]?.requests;
      }
    });
    return grouped;
  }

  calculateCostPerToken(metrics) {
    const totalCost = metrics?.reduce((sum, m) => sum + (parseFloat(m?.total_cost) || 0), 0);
    const totalTokens = metrics?.reduce((sum, m) => sum + (m?.total_tokens || 0), 0);
    return totalTokens > 0 ? totalCost / totalTokens : 0;
  }

  calculateTokenEfficiency(metrics) {
    return metrics?.map(metric => ({
      model: metric?.model_name,
      provider: metric?.provider,
      tokensPerRequest: metric?.request_count > 0 ? 
        (metric?.total_tokens || 0) / metric?.request_count : 0,
      costPerRequest: metric?.request_count > 0 ? 
        (parseFloat(metric?.total_cost) || 0) / metric?.request_count : 0,
      responseTimePerToken: metric?.total_tokens > 0 ? 
        (metric?.avg_response_time_ms || 0) / metric?.total_tokens : 0
    }));
  }

  // Cost Optimization Recommendations
  async getCostOptimizationRecommendations(tenantId) {
    try {
      const metrics = await this.getLLMUsageMetrics({ tenant_id: tenantId });
      const conversations = await this.getLLMConversations({ tenant_id: tenantId, timeRange: '30d' });
      
      const recommendations = [];

      // High cost per token models
      const costEfficiency = this.calculateTokenEfficiency(metrics);
      const highCostModels = costEfficiency?.filter(eff => eff?.costPerRequest > 0.05);
      
      if (highCostModels?.length > 0) {
        recommendations?.push({
          type: 'cost_optimization',
          priority: 'high',
          title: 'High Cost Models Detected',
          description: 'Consider switching to more cost-effective models for routine tasks',
          impact: 'Could save up to 40% on LLM costs',
          models: highCostModels?.map(m => m?.model)
        });
      }

      // Low success rate models
      const lowSuccessModels = metrics?.filter(m => (m?.success_rate || 0) < 95);
      if (lowSuccessModels?.length > 0) {
        recommendations?.push({
          type: 'reliability',
          priority: 'medium',
          title: 'Models with Low Success Rates',
          description: 'Some models are experiencing high error rates',
          impact: 'Improving reliability will reduce retry costs',
          models: lowSuccessModels?.map(m => m?.model_name)
        });
      }

      // Unused models
      const unusedModels = metrics?.filter(m => (m?.request_count || 0) === 0);
      if (unusedModels?.length > 0) {
        recommendations?.push({
          type: 'cleanup',
          priority: 'low',
          title: 'Unused Model Configurations',
          description: 'Remove unused model configurations to simplify management',
          impact: 'Cleaner dashboard and reduced configuration overhead',
          models: unusedModels?.map(m => m?.model_name)
        });
      }

      return recommendations;
    } catch (error) {
      throw new Error(`Failed to generate cost optimization recommendations: ${error?.message}`);
    }
  }

  // Real-time subscriptions
  subscribeToLLMMetrics(callback) {
    const channel = supabase?.channel('llm_metrics_updates')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'llm_usage_metrics'
        },
        (payload) => {
          callback?.({ type: 'llm_metric_update', payload });
        }
      )?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'llm_conversations'
        },
        (payload) => {
          callback?.({ type: 'conversation_update', payload });
        }
      )?.subscribe();

    return channel;
  }

  unsubscribe(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
}

export const llmAnalyticsService = new LLMAnalyticsService();
export default llmAnalyticsService;