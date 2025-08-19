import { supabase } from '../lib/supabase';

class IntegrationHealthService {
  // Integration Health Management
  async getIntegrationHealth(filters = {}) {
    try {
      let query = supabase?.from('integration_health')?.select(`
          *,
          tenant:tenants(id, name, slug, plan)
        `)?.order('last_check_at', { ascending: false });

      if (filters?.tenant_id) {
        query = query?.eq('tenant_id', filters?.tenant_id);
      }
      if (filters?.integration_type) {
        query = query?.eq('integration_type', filters?.integration_type);
      }
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch integration health: ${error?.message}`);
    }
  }

  async getIntegrationById(integrationId) {
    try {
      const { data, error } = await supabase?.from('integration_health')?.select(`
          *,
          tenant:tenants(id, name, slug, plan)
        `)?.eq('id', integrationId)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch integration: ${error?.message}`);
    }
  }

  async updateIntegrationHealth(integrationId, updateData) {
    try {
      const { data, error } = await supabase?.from('integration_health')?.update(updateData)?.eq('id', integrationId)?.select(`
          *,
          tenant:tenants(id, name, slug)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update integration health: ${error?.message}`);
    }
  }

  // Health Check Operations
  async performHealthCheck(integrationId) {
    try {
      const integration = await this.getIntegrationById(integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      let status = 'healthy';
      let responseTime = null;
      let errorCount = integration?.error_count || 0;

      const startTime = Date.now();
      
      try {
        if (integration?.endpoint_url) {
          // Perform actual health check
          const response = await fetch(`${integration?.endpoint_url}/health`, {
            method: 'GET',
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          responseTime = Date.now() - startTime;
          
          if (!response?.ok) {
            status = response?.status >= 500 ? 'down' : 'degraded';
            errorCount++;
          } else {
            status = 'healthy';
            errorCount = Math.max(0, errorCount - 1); // Decrease error count on success
          }
        } else {
          // For integrations without direct health endpoints
          status = integration?.status || 'healthy';
          responseTime = 50; // Mock response time
        }
      } catch (fetchError) {
        status = 'down';
        errorCount++;
        responseTime = Date.now() - startTime;
      }

      // Update the integration with new health data
      const updatedIntegration = await this.updateIntegrationHealth(integrationId, {
        status,
        last_check_at: new Date()?.toISOString(),
        response_time_ms: responseTime,
        error_count: errorCount,
        next_check_at: new Date(Date.now() + 5 * 60 * 1000)?.toISOString() // Next check in 5 minutes
      });

      return {
        integrationId,
        status,
        responseTime,
        errorCount,
        integration: updatedIntegration
      };
    } catch (error) {
      throw new Error(`Health check failed: ${error?.message}`);
    }
  }

  async performBulkHealthChecks(tenantId = null) {
    try {
      const integrations = await this.getIntegrationHealth(
        tenantId ? { tenant_id: tenantId } : {}
      );

      const healthCheckPromises = integrations?.map(integration =>
        this.performHealthCheck(integration?.id)?.catch(error => ({
          integrationId: integration?.id,
          error: error?.message,
          status: 'error'
        }))
      );

      const results = await Promise.all(healthCheckPromises);
      
      return {
        totalChecked: integrations?.length,
        successful: results?.filter(r => r?.status !== 'error')?.length,
        failed: results?.filter(r => r?.status === 'error')?.length,
        results
      };
    } catch (error) {
      throw new Error(`Bulk health check failed: ${error?.message}`);
    }
  }

  // Integration Status Analytics
  async getIntegrationStatusSummary(tenantId = null) {
    try {
      const integrations = await this.getIntegrationHealth(
        tenantId ? { tenant_id: tenantId } : {}
      );

      const summary = {
        totalIntegrations: integrations?.length || 0,
        healthyIntegrations: integrations?.filter(i => i?.status === 'healthy')?.length || 0,
        degradedIntegrations: integrations?.filter(i => i?.status === 'degraded')?.length || 0,
        downIntegrations: integrations?.filter(i => i?.status === 'down')?.length || 0,
        avgResponseTime: integrations?.length > 0 ? 
          integrations?.reduce((sum, i) => sum + (i?.response_time_ms || 0), 0) / integrations?.length : 0,
        totalMonthlyCost: integrations?.reduce((sum, i) => sum + (parseFloat(i?.cost_current_month) || 0), 0),
        uptime: this.calculateOverallUptime(integrations),
        integrationsByType: this.groupIntegrationsByType(integrations),
        criticalIssues: this.identifyCriticalIssues(integrations)
      };

      return summary;
    } catch (error) {
      throw new Error(`Failed to generate integration status summary: ${error?.message}`);
    }
  }

  groupIntegrationsByType(integrations) {
    const grouped = {};
    integrations?.forEach(integration => {
      const type = integration?.integration_type || 'unknown';
      if (!grouped?.[type]) {
        grouped[type] = { 
          total: 0, 
          healthy: 0, 
          degraded: 0, 
          down: 0,
          avgResponseTime: 0,
          totalCost: 0
        };
      }
      
      grouped[type].total++;
      grouped[type].totalCost += parseFloat(integration?.cost_current_month) || 0;
      grouped[type].avgResponseTime += integration?.response_time_ms || 0;
      
      switch (integration?.status) {
        case 'healthy':
          grouped[type].healthy++;
          break;
        case 'degraded':
          grouped[type].degraded++;
          break;
        case 'down':
          grouped[type].down++;
          break;
      }
    });

    // Calculate averages
    Object.keys(grouped)?.forEach(type => {
      if (grouped?.[type]?.total > 0) {
        grouped[type].avgResponseTime = grouped?.[type]?.avgResponseTime / grouped?.[type]?.total;
      }
    });

    return grouped;
  }

  calculateOverallUptime(integrations) {
    if (!integrations?.length) return 100;
    
    const totalUptime = integrations?.reduce((sum, i) => sum + (i?.uptime_percentage || 0), 0);
    return totalUptime / integrations?.length;
  }

  identifyCriticalIssues(integrations) {
    const issues = [];

    // Down integrations
    const downIntegrations = integrations?.filter(i => i?.status === 'down');
    if (downIntegrations?.length > 0) {
      issues?.push({
        severity: 'critical',
        type: 'service_down',
        count: downIntegrations?.length,
        integrations: downIntegrations?.map(i => i?.integration_name),
        description: `${downIntegrations?.length} integration(s) are currently down`
      });
    }

    // High error rate integrations
    const highErrorIntegrations = integrations?.filter(i => (i?.error_count || 0) > 10);
    if (highErrorIntegrations?.length > 0) {
      issues?.push({
        severity: 'warning',
        type: 'high_error_rate',
        count: highErrorIntegrations?.length,
        integrations: highErrorIntegrations?.map(i => i?.integration_name),
        description: `${highErrorIntegrations?.length} integration(s) have high error rates`
      });
    }

    // Quota exceeded integrations
    const quotaExceededIntegrations = integrations?.filter(i => 
      i?.quota_limit && i?.quota_used >= i?.quota_limit * 0.9
    );
    if (quotaExceededIntegrations?.length > 0) {
      issues?.push({
        severity: 'warning',
        type: 'quota_threshold',
        count: quotaExceededIntegrations?.length,
        integrations: quotaExceededIntegrations?.map(i => i?.integration_name),
        description: `${quotaExceededIntegrations?.length} integration(s) approaching quota limits`
      });
    }

    return issues;
  }

  // Cost and Usage Monitoring
  async getIntegrationCostAnalysis(tenantId, period = '30d') {
    try {
      const integrations = await this.getIntegrationHealth(
        tenantId ? { tenant_id: tenantId } : {}
      );

      const costAnalysis = {
        totalMonthlyCost: integrations?.reduce((sum, i) => sum + (parseFloat(i?.cost_current_month) || 0), 0),
        costByType: this.groupCostsByType(integrations),
        costByIntegration: integrations?.map(i => ({
          name: i?.integration_name,
          type: i?.integration_type,
          cost: parseFloat(i?.cost_current_month) || 0,
          quotaUtilization: i?.quota_limit ? (i?.quota_used / i?.quota_limit) * 100 : 0
        }))?.sort((a, b) => b?.cost - a?.cost),
        projectedMonthlyCost: this.calculateProjectedMonthlyCost(integrations),
        costOptimizationOpportunities: this.identifyCostOptimizations(integrations)
      };

      return costAnalysis;
    } catch (error) {
      throw new Error(`Failed to analyze integration costs: ${error?.message}`);
    }
  }

  groupCostsByType(integrations) {
    const grouped = {};
    integrations?.forEach(integration => {
      const type = integration?.integration_type || 'unknown';
      if (!grouped?.[type]) grouped[type] = 0;
      grouped[type] += parseFloat(integration?.cost_current_month) || 0;
    });
    return grouped;
  }

  calculateProjectedMonthlyCost(integrations) {
    // Simple projection based on current usage patterns
    return integrations?.reduce((sum, i) => {
      const currentCost = parseFloat(i?.cost_current_month) || 0;
      const utilizationRate = i?.quota_limit ? (i?.quota_used / i?.quota_limit) : 0.5;
      return sum + (currentCost * (1 + utilizationRate * 0.2)); // Project 20% growth based on utilization
    }, 0);
  }

  identifyCostOptimizations(integrations) {
    const opportunities = [];

    // Underutilized integrations
    const underutilized = integrations?.filter(i => 
      i?.quota_limit && (i?.quota_used / i?.quota_limit) < 0.3 && 
      parseFloat(i?.cost_current_month) > 0
    );
    
    if (underutilized?.length > 0) {
      opportunities?.push({
        type: 'underutilization',
        potential_savings: underutilized?.reduce((sum, i) => sum + parseFloat(i?.cost_current_month) * 0.5, 0),
        integrations: underutilized?.map(i => i?.integration_name),
        recommendation: 'Consider downgrading plans for underutilized integrations'
      });
    }

    return opportunities;
  }

  // Real-time subscriptions
  subscribeToIntegrationHealth(callback) {
    const channel = supabase?.channel('integration_health_updates')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integration_health'
        },
        (payload) => {
          callback?.(payload);
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

export const integrationHealthService = new IntegrationHealthService();
export default integrationHealthService;