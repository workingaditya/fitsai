import { supabase } from '../lib/supabase';

class BackendArchitectureService {
  // Backend Services Management
  async getBackendServices(filters = {}) {
    try {
      let query = supabase?.from('backend_services')?.select(`
          *,
          created_by:profiles(id, display_name, role)
        `)?.order('created_at', { ascending: false });

      if (filters?.environment) {
        query = query?.eq('environment', filters?.environment);
      }
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch backend services: ${error?.message}`);
    }
  }

  async createBackendService(serviceData) {
    try {
      const { data, error } = await supabase?.from('backend_services')?.insert([{
          ...serviceData,
          created_by: (await supabase?.auth?.getUser())?.data?.user?.id
        }])?.select(`
          *,
          created_by:profiles(id, display_name, role)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create backend service: ${error?.message}`);
    }
  }

  async updateBackendService(serviceId, updateData) {
    try {
      const { data, error } = await supabase?.from('backend_services')?.update(updateData)?.eq('id', serviceId)?.select(`
          *,
          created_by:profiles(id, display_name, role)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update backend service: ${error?.message}`);
    }
  }

  async deleteBackendService(serviceId) {
    try {
      const { error } = await supabase?.from('backend_services')?.delete()?.eq('id', serviceId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete backend service: ${error?.message}`);
    }
  }

  // API Endpoints Management
  async getApiEndpoints(serviceId = null, filters = {}) {
    try {
      let query = supabase?.from('api_endpoints')?.select(`
          *,
          service:backend_services(id, name, service_type, status)
        `)?.order('path', { ascending: true });

      if (serviceId) {
        query = query?.eq('service_id', serviceId);
      }
      if (filters?.method) {
        query = query?.eq('method', filters?.method);
      }
      if (filters?.is_enabled !== undefined) {
        query = query?.eq('is_enabled', filters?.is_enabled);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch API endpoints: ${error?.message}`);
    }
  }

  async updateApiEndpoint(endpointId, updateData) {
    try {
      const { data, error } = await supabase?.from('api_endpoints')?.update(updateData)?.eq('id', endpointId)?.select(`
          *,
          service:backend_services(id, name, service_type)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update API endpoint: ${error?.message}`);
    }
  }

  // System Metrics
  async getSystemMetrics(serviceId = null, timeRange = '1h') {
    try {
      let query = supabase?.from('system_metrics')?.select(`
          *,
          service:backend_services(id, name, service_type)
        `)?.order('timestamp', { ascending: false });

      if (serviceId) {
        query = query?.eq('service_id', serviceId);
      }

      // Time range filter
      const timeRanges = {
        '1h': new Date(Date.now() - 60 * 60 * 1000),
        '24h': new Date(Date.now() - 24 * 60 * 60 * 1000),
        '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      };

      if (timeRanges?.[timeRange]) {
        query = query?.gte('timestamp', timeRanges?.[timeRange]?.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch system metrics: ${error?.message}`);
    }
  }

  async recordSystemMetric(serviceId, metricName, metricValue, metricUnit = null, metadata = {}) {
    try {
      const { data, error } = await supabase?.from('system_metrics')?.insert([{
          service_id: serviceId,
          metric_name: metricName,
          metric_value: metricValue,
          metric_unit: metricUnit,
          metadata
        }])?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to record system metric: ${error?.message}`);
    }
  }

  // Health Check and Status Updates
  async updateServiceStatus(serviceId, status) {
    try {
      const { data, error } = await supabase?.from('backend_services')?.update({
          status,
          last_health_check: new Date()?.toISOString()
        })?.eq('id', serviceId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update service status: ${error?.message}`);
    }
  }

  async performHealthCheck(serviceId) {
    try {
      // Get service details
      const { data: service, error: serviceError } = await supabase?.from('backend_services')?.select('*')?.eq('id', serviceId)?.single();

      if (serviceError) throw serviceError;

      let status = 'healthy';
      let responseTime = null;

      // Perform actual health check if endpoint_url exists
      if (service?.endpoint_url) {
        const startTime = Date.now();
        try {
          const response = await fetch(`${service?.endpoint_url}/health`, {
            method: 'GET',
            timeout: 5000
          });
          responseTime = Date.now() - startTime;
          status = response?.ok ? 'healthy' : 'degraded';
        } catch (fetchError) {
          status = 'down';
          responseTime = null;
        }
      }

      // Update service status
      await this.updateServiceStatus(serviceId, status);

      // Record metrics if we have response time
      if (responseTime !== null) {
        await this.recordSystemMetric(
          serviceId,
          'health_check_response_time',
          responseTime,
          'milliseconds',
          { status, timestamp: new Date()?.toISOString() }
        );
      }

      return { serviceId, status, responseTime };
    } catch (error) {
      throw new Error(`Health check failed: ${error?.message}`);
    }
  }

  // Real-time subscriptions
  subscribeToServiceUpdates(callback) {
    const channel = supabase?.channel('backend_services_updates')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'backend_services'
        },
        (payload) => {
          callback?.({ type: 'service_update', payload });
        }
      )?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'api_endpoints'
        },
        (payload) => {
          callback?.({ type: 'endpoint_update', payload });
        }
      )?.subscribe();

    return channel;
  }

  subscribeToMetrics(callback) {
    const channel = supabase?.channel('system_metrics_updates')?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_metrics'
        },
        (payload) => {
          callback?.(payload?.new);
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

export const backendArchitectureService = new BackendArchitectureService();
export default backendArchitectureService;