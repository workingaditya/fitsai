import { supabase } from '../lib/supabase';

export const integrationStatusService = {
  // Get all backend services with their status and metrics
  async getServicesOverview() {
    try {
      const { data: services, error: servicesError } = await supabase?.from('backend_services')?.select(`
          id,
          name,
          service_type,
          status,
          endpoint_url,
          environment,
          version,
          configuration,
          last_health_check,
          created_at,
          updated_at
        `)?.order('name');

      if (servicesError) throw servicesError;

      // Get latest metrics for each service
      const servicesWithMetrics = await Promise.all(
        services?.map(async (service) => {
          const { data: metrics } = await supabase?.from('system_metrics')?.select('metric_name, metric_value, metric_unit, timestamp')?.eq('service_id', service?.id)?.order('timestamp', { ascending: false })?.limit(10);

          const { data: endpoints } = await supabase?.from('api_endpoints')?.select('path, method, response_time_ms, success_rate, is_enabled, last_tested')?.eq('service_id', service?.id);

          return {
            ...service,
            metrics: metrics || [],
            endpoints: endpoints || []
          };
        }) || []
      );

      return servicesWithMetrics;
    } catch (error) {
      console.error('Error fetching services overview:', error);
      throw error;
    }
  },

  // Get provider configurations and their status
  async getProviderConfigurations() {
    try {
      const { data, error } = await supabase?.from('provider_configs')?.select(`
          id,
          provider_name,
          provider_type,
          is_enabled,
          is_default,
          config_data,
          tenant_id,
          created_at,
          updated_at,
          tenants (
            id,
            name,
            slug,
            is_active
          )
        `)?.order('provider_type', { ascending: true })?.order('provider_name', { ascending: true });

      if (error) throw error;

      // Group by provider type
      const groupedProviders = data?.reduce((acc, provider) => {
        const type = provider?.provider_type;
        if (!acc?.[type]) {
          acc[type] = [];
        }
        acc?.[type]?.push(provider);
        return acc;
      }, {});

      return groupedProviders || {};
    } catch (error) {
      console.error('Error fetching provider configurations:', error);
      throw error;
    }
  },

  // Get system metrics for health dashboard
  async getSystemHealth() {
    try {
      const { data, error } = await supabase?.from('system_metrics')?.select(`
          id,
          service_id,
          metric_name,
          metric_value,
          metric_unit,
          timestamp,
          metadata,
          backend_services (
            name,
            service_type,
            status
          )
        `)?.order('timestamp', { ascending: false })?.limit(100);

      if (error) throw error;

      // Process metrics for dashboard display
      const healthSummary = {
        overall_status: 'healthy',
        services_count: 0,
        healthy_services: 0,
        warnings: 0,
        errors: 0,
        latest_metrics: data || []
      };

      // Get unique services
      const uniqueServices = new Set();
      data?.forEach(metric => {
        if (metric?.backend_services) {
          uniqueServices?.add(metric?.service_id);
          const status = metric?.backend_services?.status;
          if (status === 'healthy') healthSummary.healthy_services++;
          else if (status === 'degraded') healthSummary.warnings++;
          else if (status === 'down') healthSummary.errors++;
        }
      });

      healthSummary.services_count = uniqueServices?.size;

      // Determine overall status
      if (healthSummary?.errors > 0) {
        healthSummary.overall_status = 'error';
      } else if (healthSummary?.warnings > 0) {
        healthSummary.overall_status = 'warning';
      }

      return healthSummary;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  },

  // Get API endpoints performance data
  async getAPIEndpointsStatus() {
    try {
      const { data, error } = await supabase?.from('api_endpoints')?.select(`
          id,
          path,
          method,
          response_time_ms,
          success_rate,
          is_enabled,
          last_tested,
          rate_limit,
          requires_auth,
          service_id,
          backend_services (
            name,
            status
          )
        `)?.order('success_rate', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching API endpoints status:', error);
      throw error;
    }
  },

  // Test service connectivity
  async testServiceHealth(serviceId) {
    try {
      // This would typically make a real health check request
      // For now, we'll simulate by updating the last_health_check timestamp
      const { data, error } = await supabase?.from('backend_services')?.update({ 
          last_health_check: new Date()?.toISOString(),
          status: 'healthy' // In real implementation, this would be based on actual health check
        })?.eq('id', serviceId)?.select()?.single();

      if (error) throw error;

      return {
        success: true,
        timestamp: new Date()?.toISOString(),
        service: data
      };
    } catch (error) {
      console.error('Error testing service health:', error);
      return {
        success: false,
        error: error?.message,
        timestamp: new Date()?.toISOString()
      };
    }
  },

  // Get real-time system metrics subscription
  subscribeToSystemMetrics(callback) {
    const subscription = supabase?.channel('system_metrics_channel')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_metrics'
        },
        callback
      )?.subscribe();

    return () => {
      supabase?.removeChannel(subscription);
    };
  },

  // Get service status history
  async getServiceStatusHistory(serviceId, hours = 24) {
    try {
      const hoursAgo = new Date();
      hoursAgo?.setHours(hoursAgo?.getHours() - hours);

      const { data, error } = await supabase?.from('system_metrics')?.select('metric_name, metric_value, metric_unit, timestamp')?.eq('service_id', serviceId)?.gte('timestamp', hoursAgo?.toISOString())?.order('timestamp', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching service status history:', error);
      throw error;
    }
  }
};