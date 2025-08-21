class TenantManagementService {
  constructor() {
    this.apiBaseUrl = '/api';
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Tenant Management
  async getTenants(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters?.is_active !== undefined) params.append('is_active', filters.is_active);
      if (filters?.plan) params.append('plan', filters.plan);
      if (filters?.region) params.append('region', filters.region);

      const response = await fetch(`${this.apiBaseUrl}/tenants?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      throw new Error(`Failed to fetch tenants: ${error?.message}`);
    }
  }

  async getTenantById(tenantId) {
    try {
      const tenants = await this.getTenants();
      return tenants.find(t => t.id === tenantId) || null;
    } catch (error) {
      throw new Error(`Failed to fetch tenant: ${error?.message}`);
    }
  }

  async createTenant(tenantData) {
    throw new Error('Tenant creation not available in demo mode');
  }

  async updateTenant(tenantId, updateData) {
    throw new Error('Tenant updates not available in demo mode');
  }

  async deleteTenant(tenantId) {
    throw new Error('Tenant deletion not available in demo mode');
  }

  // Provider Configuration Management
  async getProviderConfigs(tenantId = null, filters = {}) {
    try {
      // Return mock provider configs for demo
      const mockConfigs = [
        {
          id: '1',
          tenant_id: '1',
          provider_type: 'llm',
          provider_name: 'openai',
          config_data: { model: 'gpt-4o-mini', temperature: 0.7 },
          is_default: true,
          is_enabled: true,
          tenant: { id: '1', name: 'FITS AI Production', slug: 'fits-prod' }
        },
        {
          id: '2',
          tenant_id: '1',
          provider_type: 'vector',
          provider_name: 'pgvector',
          config_data: { dimensions: 1536, index_type: 'ivfflat' },
          is_default: true,
          is_enabled: true,
          tenant: { id: '1', name: 'FITS AI Production', slug: 'fits-prod' }
        }
      ];

      let result = mockConfigs;
      
      if (tenantId) {
        result = result.filter(config => config.tenant_id === tenantId);
      }
      if (filters?.provider_type) {
        result = result.filter(config => config.provider_type === filters.provider_type);
      }
      if (filters?.is_enabled !== undefined) {
        result = result.filter(config => config.is_enabled === filters.is_enabled);
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch provider configs: ${error?.message}`);
    }
  }

  async createProviderConfig(configData) {
    throw new Error('Provider config creation not available in demo mode');
  }

  async updateProviderConfig(configId, updateData) {
    throw new Error('Provider config updates not available in demo mode');
  }

  async deleteProviderConfig(configId) {
    throw new Error('Provider config deletion not available in demo mode');
  }

  // Tenant Configuration Management
  async updateTenantConfig(tenantId, newConfig) {
    throw new Error('Tenant config updates not available in demo mode');
  }

  async switchProvider(tenantId, providerType, newProviderName, newConfig = {}) {
    throw new Error('Provider switching not available in demo mode');
  }

  // Bulk Operations
  async bulkUpdateTenants(tenantIds, updateData) {
    throw new Error('Bulk tenant updates not available in demo mode');
  }

  async bulkToggleProviderConfigs(configIds, isEnabled) {
    throw new Error('Bulk provider config updates not available in demo mode');
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

  // Real-time subscriptions (demo implementations)
  subscribeToTenantUpdates(callback) {
    // Return mock subscription object
    return {
      unsubscribe: () => console.log('Unsubscribed from tenant updates')
    };
  }

  unsubscribe(channel) {
    if (channel?.unsubscribe) {
      channel.unsubscribe();
    }
  }
}

export const tenantManagementService = new TenantManagementService();
export default tenantManagementService;