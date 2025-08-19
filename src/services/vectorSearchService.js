import { supabase } from '../lib/supabase';

class VectorSearchService {
  // Vector Search Metrics
  async getVectorSearchMetrics(filters = {}) {
    try {
      let query = supabase?.from('vector_search_metrics')?.select(`
          *,
          tenant:tenants(id, name, slug, plan),
          service:backend_services(id, name, service_type, status)
        `)?.order('last_updated', { ascending: false });

      if (filters?.tenant_id) {
        query = query?.eq('tenant_id', filters?.tenant_id);
      }
      if (filters?.index_status) {
        query = query?.eq('index_status', filters?.index_status);
      }
      if (filters?.service_id) {
        query = query?.eq('service_id', filters?.service_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch vector search metrics: ${error?.message}`);
    }
  }

  async getVectorMetricById(metricId) {
    try {
      const { data, error } = await supabase?.from('vector_search_metrics')?.select(`
          *,
          tenant:tenants(id, name, slug, plan),
          service:backend_services(id, name, service_type, status)
        `)?.eq('id', metricId)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch vector metric: ${error?.message}`);
    }
  }

  async updateVectorMetric(metricId, updateData) {
    try {
      const { data, error } = await supabase?.from('vector_search_metrics')?.update(updateData)?.eq('id', metricId)?.select(`
          *,
          tenant:tenants(id, name, slug),
          service:backend_services(id, name, service_type)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update vector metric: ${error?.message}`);
    }
  }

  // Embedding Operations
  async getEmbeddingOperations(filters = {}) {
    try {
      let query = supabase?.from('embedding_operations')?.select(`
          *,
          tenant:tenants(id, name, slug),
          vector_metric:vector_search_metrics(id, index_name, namespace)
        `)?.order('created_at', { ascending: false });

      if (filters?.tenant_id) {
        query = query?.eq('tenant_id', filters?.tenant_id);
      }
      if (filters?.operation_type) {
        query = query?.eq('operation_type', filters?.operation_type);
      }
      if (filters?.success !== undefined) {
        query = query?.eq('success', filters?.success);
      }
      if (filters?.timeRange) {
        const timeRanges = {
          '1h': new Date(Date.now() - 60 * 60 * 1000),
          '24h': new Date(Date.now() - 24 * 60 * 60 * 1000),
          '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        };
        if (timeRanges?.[filters?.timeRange]) {
          query = query?.gte('created_at', timeRanges?.[filters?.timeRange]?.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch embedding operations: ${error?.message}`);
    }
  }

  async recordEmbeddingOperation(operationData) {
    try {
      const { data, error } = await supabase?.from('embedding_operations')?.insert([operationData])?.select(`
          *,
          tenant:tenants(id, name),
          vector_metric:vector_search_metrics(id, index_name)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to record embedding operation: ${error?.message}`);
    }
  }

  // Analytics and Health Calculations
  async getVectorHealthSummary(tenantId = null, timeRange = '24h') {
    try {
      const metrics = await this.getVectorSearchMetrics(tenantId ? { tenant_id: tenantId } : {});
      const operations = await this.getEmbeddingOperations({ tenant_id: tenantId, timeRange });

      const healthSummary = {
        totalIndexes: metrics?.length || 0,
        healthyIndexes: metrics?.filter(m => m?.index_status === 'healthy')?.length || 0,
        totalVectors: metrics?.reduce((sum, m) => sum + (m?.total_vectors || 0), 0),
        avgQueryLatency: metrics?.length > 0 ? 
          metrics?.reduce((sum, m) => sum + (m?.query_latency_ms || 0), 0) / metrics?.length : 0,
        totalOperations: operations?.length || 0,
        successfulOperations: operations?.filter(op => op?.success === true)?.length || 0,
        avgProcessingTime: operations?.length > 0 ?
          operations?.reduce((sum, op) => sum + (op?.processing_time_ms || 0), 0) / operations?.length : 0,
        totalCost: operations?.reduce((sum, op) => sum + (parseFloat(op?.cost) || 0), 0),
        operationsByType: this.groupOperationsByType(operations),
        indexStatusDistribution: this.groupIndexesByStatus(metrics)
      };

      return healthSummary;
    } catch (error) {
      throw new Error(`Failed to generate vector health summary: ${error?.message}`);
    }
  }

  groupOperationsByType(operations) {
    const grouped = {};
    operations?.forEach(op => {
      if (!grouped?.[op?.operation_type]) {
        grouped[op?.operation_type] = { count: 0, success: 0, totalTime: 0, totalCost: 0 };
      }
      grouped[op?.operation_type].count++;
      if (op?.success) grouped[op?.operation_type].success++;
      grouped[op?.operation_type].totalTime += op?.processing_time_ms || 0;
      grouped[op?.operation_type].totalCost += parseFloat(op?.cost) || 0;
    });
    return grouped;
  }

  groupIndexesByStatus(metrics) {
    const grouped = {};
    metrics?.forEach(metric => {
      const status = metric?.index_status || 'unknown';
      if (!grouped?.[status]) grouped[status] = 0;
      grouped[status]++;
    });
    return grouped;
  }

  // Real-time Performance Monitoring
  async getVectorPerformanceTrends(tenantId, timeRange = '7d') {
    try {
      // Get historical system metrics for vector services
      const { data: performanceData, error } = await supabase?.from('system_metrics')?.select(`
          *,
          service:backend_services(id, name, service_type)
        `)?.eq('service.service_type', 'vector')?.gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString())?.order('timestamp', { ascending: true });

      if (error) throw error;

      const trends = {
        queryLatency: [],
        throughput: [],
        errorRate: [],
        indexHealth: []
      };

      performanceData?.forEach(metric => {
        const timestamp = new Date(metric?.timestamp)?.toISOString();
        
        switch (metric?.metric_name) {
          case 'query_latency':
            trends?.queryLatency?.push({ timestamp, value: parseFloat(metric?.metric_value) });
            break;
          case 'query_throughput':
            trends?.throughput?.push({ timestamp, value: parseFloat(metric?.metric_value) });
            break;
          case 'error_rate':
            trends?.errorRate?.push({ timestamp, value: parseFloat(metric?.metric_value) });
            break;
        }
      });

      return trends;
    } catch (error) {
      throw new Error(`Failed to fetch vector performance trends: ${error?.message}`);
    }
  }

  // Cost Analysis
  async getVectorCostAnalysis(tenantId, period = '30d') {
    try {
      const operations = await this.getEmbeddingOperations({ 
        tenant_id: tenantId, 
        timeRange: period 
      });

      const costAnalysis = {
        totalCost: operations?.reduce((sum, op) => sum + (parseFloat(op?.cost) || 0), 0),
        costByOperation: this.groupOperationsByType(operations),
        dailyCosts: this.groupCostsByDate(operations),
        projectedMonthlyCost: this.calculateProjectedCost(operations)
      };

      return costAnalysis;
    } catch (error) {
      throw new Error(`Failed to analyze vector costs: ${error?.message}`);
    }
  }

  groupCostsByDate(operations) {
    const grouped = {};
    operations?.forEach(op => {
      const date = new Date(op?.created_at)?.toISOString()?.split('T')?.[0];
      if (!grouped?.[date]) grouped[date] = 0;
      grouped[date] += parseFloat(op?.cost) || 0;
    });
    return grouped;
  }

  calculateProjectedCost(operations) {
    if (!operations?.length) return 0;
    
    const dailyAverage = Object.values(this.groupCostsByDate(operations))?.reduce((sum, cost) => sum + cost, 0) / 
                         Object.keys(this.groupCostsByDate(operations))?.length;
    
    return dailyAverage * 30; // Project for 30 days
  }

  // Real-time subscriptions
  subscribeToVectorMetrics(callback) {
    const channel = supabase?.channel('vector_metrics_updates')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vector_search_metrics'
        },
        (payload) => {
          callback?.({ type: 'vector_metric_update', payload });
        }
      )?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'embedding_operations'
        },
        (payload) => {
          callback?.({ type: 'embedding_operation', payload });
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

export const vectorSearchService = new VectorSearchService();
export default vectorSearchService;