import { supabase } from '../lib/supabase';

class TenantManagementService {
  // Tenant Management
  async getTenants(filters = {}) {
    try {
      let query = supabase?.from('tenants')?.select(`
          *,
          created_by:profiles(id, display_name, role),
          provider_configs(id, provider_type, provider_name, is_enabled, config_data)
        `)?.order('created_at', { ascending: false });

      if (filters?.is_active !== undefined) {
        query = query?.eq('is_active', filters?.is_active);
      }
      if (filters?.plan) {
        query = query?.eq('plan', filters?.plan);
      }
      if (filters?.region) {
        query = query?.eq('region', filters?.region);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch tenants: ${error?.message}`);
    }
  }

  async getTenantById(tenantId) {
    try {
      const { data, error } = await supabase?.from('tenants')?.select(`
          *,
          created_by:profiles(id, display_name, role),
          provider_configs(
            id, provider_type, provider_name, 
            config_data, is_default, is_enabled, 
            created_at, updated_at
          )
        `)?.eq('id', tenantId)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch tenant: ${error?.message}`);
    }
  }

  async createTenant(tenantData) {
    try {
      const currentUser = (await supabase?.auth?.getUser())?.data?.user;
      
      const { data, error } = await supabase?.from('tenants')?.insert([{
          ...tenantData,
          slug: tenantData?.name?.toLowerCase()?.replace(/[^a-z0-9]/g, '-') || 'tenant-' + Date.now(),
          created_by: currentUser?.id
        }])?.select(`
          *,
          created_by:profiles(id, display_name, role)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create tenant: ${error?.message}`);
    }
  }

  async updateTenant(tenantId, updateData) {
    try {
      const { data, error } = await supabase?.from('tenants')?.update(updateData)?.eq('id', tenantId)?.select(`
          *,
          created_by:profiles(id, display_name, role)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update tenant: ${error?.message}`);
    }
  }

  async deleteTenant(tenantId) {
    try {
      const { error } = await supabase?.from('tenants')?.delete()?.eq('id', tenantId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete tenant: ${error?.message}`);
    }
  }

  // Provider Configuration Management
  async getProviderConfigs(tenantId = null, filters = {}) {
    try {
      let query = supabase?.from('provider_configs')?.select(`
          *,
          tenant:tenants(id, name, slug),
          created_by:profiles(id, display_name, role)
        `)?.order('created_at', { ascending: false });

      if (tenantId) {
        query = query?.eq('tenant_id', tenantId);
      }
      if (filters?.provider_type) {
        query = query?.eq('provider_type', filters?.provider_type);
      }
      if (filters?.is_enabled !== undefined) {
        query = query?.eq('is_enabled', filters?.is_enabled);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch provider configs: ${error?.message}`);
    }
  }

  async createProviderConfig(configData) {
    try {
      const currentUser = (await supabase?.auth?.getUser())?.data?.user;

      const { data, error } = await supabase?.from('provider_configs')?.insert([{
          ...configData,
          created_by: currentUser?.id
        }])?.select(`
          *,
          tenant:tenants(id, name, slug),
          created_by:profiles(id, display_name, role)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to create provider config: ${error?.message}`);
    }
  }

  async updateProviderConfig(configId, updateData) {
    try {
      const { data, error } = await supabase?.from('provider_configs')?.update(updateData)?.eq('id', configId)?.select(`
          *,
          tenant:tenants(id, name, slug),
          created_by:profiles(id, display_name, role)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update provider config: ${error?.message}`);
    }
  }

  async deleteProviderConfig(configId) {
    try {
      const { error } = await supabase?.from('provider_configs')?.delete()?.eq('id', configId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete provider config: ${error?.message}`);
    }
  }

  // Tenant Configuration Management
  async updateTenantConfig(tenantId, newConfig) {
    try {
      const { data, error } = await supabase?.from('tenants')?.update({ provider_config: newConfig })?.eq('id', tenantId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update tenant configuration: ${error?.message}`);
    }
  }

  async switchProvider(tenantId, providerType, newProviderName, newConfig = {}) {
    try {
      // Get current tenant configuration
      const tenant = await this.getTenantById(tenantId);
      const currentConfig = tenant?.provider_config || {};

      // Update the specific provider in the configuration
      const updatedConfig = {
        ...currentConfig,
        [providerType]: {
          provider: newProviderName,
          ...newConfig
        }
      };

      // Update tenant configuration
      const updatedTenant = await this.updateTenantConfig(tenantId, updatedConfig);

      // Create or update provider config record
      const existingConfig = await supabase?.from('provider_configs')?.select('id')?.eq('tenant_id', tenantId)?.eq('provider_type', providerType)?.eq('provider_name', newProviderName)?.single();

      if (existingConfig?.data) {
        // Update existing config
        await this.updateProviderConfig(existingConfig?.data?.id, {
          config_data: newConfig,
          is_default: true,
          is_enabled: true
        });
      } else {
        // Create new config
        await this.createProviderConfig({
          tenant_id: tenantId,
          provider_type: providerType,
          provider_name: newProviderName,
          config_data: newConfig,
          is_default: true,
          is_enabled: true
        });
      }

      return updatedTenant;
    } catch (error) {
      throw new Error(`Failed to switch provider: ${error?.message}`);
    }
  }

  // Bulk Operations
  async bulkUpdateTenants(tenantIds, updateData) {
    try {
      const { data, error } = await supabase?.from('tenants')?.update(updateData)?.in('id', tenantIds)?.select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to bulk update tenants: ${error?.message}`);
    }
  }

  async bulkToggleProviderConfigs(configIds, isEnabled) {
    try {
      const { data, error } = await supabase?.from('provider_configs')?.update({ is_enabled: isEnabled })?.in('id', configIds)?.select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to bulk toggle provider configs: ${error?.message}`);
    }
  }

  // Analytics and Usage
  async getTenantUsageAnalytics(tenantId, timeRange = '30d') {
    try {
      // This would typically involve complex queries or external API calls
      // For now, we'll return the usage data stored in the tenant record
      const tenant = await this.getTenantById(tenantId);
      
      const mockAnalytics = {
        tenantId,
        timeRange,
        apiCalls: tenant?.resource_usage?.api_calls || 0,
        storageUsage: tenant?.resource_usage?.storage_gb || 0,
        activeUsers: tenant?.resource_usage?.users || 0,
        cost: tenant?.billing_data?.monthly_cost || 0,
        usageCost: tenant?.billing_data?.usage_cost || 0,
        topEndpoints: [
          { path: '/api/chat', calls: 25000, avgResponseTime: 800 },
          { path: '/api/ingest', calls: 5000, avgResponseTime: 1200 },
          { path: '/api/export', calls: 1500, avgResponseTime: 2500 }
        ]
      };

      return mockAnalytics;
    } catch (error) {
      throw new Error(`Failed to get tenant analytics: ${error?.message}`);
    }
  }

  // Configuration Templates
  getProviderTemplates() {
    return {
      vector: {
        pgvector: {
          name: 'pgVector (PostgreSQL)',
          description: 'Built-in vector database with PostgreSQL',
          defaultConfig: {
            dimensions: 1536,
            index_type: 'ivfflat'
          }
        },
        pinecone: {
          name: 'Pinecone',
          description: 'Managed vector database service',
          defaultConfig: {
            index: '',
            namespace: '',
            metric: 'cosine'
          }
        }
      },
      llm: {
        openai: {
          name: 'OpenAI',
          description: 'OpenAI GPT models',
          defaultConfig: {
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 4096
          }
        },
        anthropic: {
          name: 'Anthropic Claude',
          description: 'Anthropic Claude models',
          defaultConfig: {
            model: 'claude-3-sonnet',
            temperature: 0.7,
            max_tokens: 4096
          }
        }
      },
      search: {
        none: {
          name: 'No Web Search',
          description: 'Disable web search functionality',
          defaultConfig: {}
        },
        tavily: {
          name: 'Tavily Search',
          description: 'AI-powered web search',
          defaultConfig: {
            max_snippets: 5,
            freshness_days: 30,
            allowlist: []
          }
        }
      },
      collab: {
        yjs: {
          name: 'Y.js Collaboration',
          description: 'Real-time collaborative editing',
          defaultConfig: {
            readonly_roles: ['viewer'],
            max_connections: 100
          }
        }
      }
    };
  }

  // Real-time subscriptions
  subscribeToTenantUpdates(callback) {
    const channel = supabase?.channel('tenant_updates')?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenants'
        },
        (payload) => {
          callback?.({ type: 'tenant_update', payload });
        }
      )?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'provider_configs'
        },
        (payload) => {
          callback?.({ type: 'config_update', payload });
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

export const tenantManagementService = new TenantManagementService();
export default tenantManagementService;