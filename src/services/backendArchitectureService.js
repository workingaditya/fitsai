class BackendArchitectureService {
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

  // Backend Services Management
  async getBackendServices(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters?.environment) params.append('environment', filters.environment);
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`${this.apiBaseUrl}/backend-services?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      throw new Error(`Failed to fetch backend services: ${error?.message}`);
    }
  }

  async createBackendService(serviceData) {
    throw new Error('Service creation not available in demo mode');
  }

  async updateBackendService(serviceId, updateData) {
    throw new Error('Service updates not available in demo mode');
  }

  async deleteBackendService(serviceId) {
    throw new Error('Service deletion not available in demo mode');
  }

  // API Endpoints Management
  async getApiEndpoints(serviceId = null, filters = {}) {
    try {
      // Return mock data for demo
      return [
        {
          id: '1',
          service_id: '1',
          path: '/api/ingest',
          method: 'POST',
          description: 'Document ingestion endpoint',
          is_enabled: true,
          rate_limit: 50,
          response_time_ms: 1200,
          success_rate: 98.5,
          service: {
            id: '1',
            name: 'FITS API Server',
            service_type: 'api',
            status: 'healthy'
          }
        },
        {
          id: '2',
          service_id: '1',
          path: '/api/chat',
          method: 'POST',
          description: 'AI chat conversation endpoint',
          is_enabled: true,
          rate_limit: 100,
          response_time_ms: 800,
          success_rate: 99.2,
          service: {
            id: '1',
            name: 'FITS API Server',
            service_type: 'api',
            status: 'healthy'
          }
        }
      ];
    } catch (error) {
      throw new Error(`Failed to fetch API endpoints: ${error?.message}`);
    }
  }

  async updateApiEndpoint(endpointId, updateData) {
    throw new Error('Endpoint updates not available in demo mode');
  }

  // System Metrics
  async getSystemMetrics(serviceId = null, timeRange = '1h') {
    try {
      const params = new URLSearchParams();
      if (serviceId) params.append('serviceId', serviceId);
      if (timeRange) params.append('timeRange', timeRange);

      const response = await fetch(`${this.apiBaseUrl}/system-metrics?${params}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      throw new Error(`Failed to fetch system metrics: ${error?.message}`);
    }
  }

  async recordSystemMetric(serviceId, metricName, metricValue, metricUnit = null, metadata = {}) {
    // Demo mode - no recording
    return { success: true };
  }

  // Health Check and Status Updates
  async updateServiceStatus(serviceId, status) {
    // Demo mode - return mock data
    return {
      id: serviceId,
      status,
      last_health_check: new Date().toISOString()
    };
  }

  async performHealthCheck(serviceId) {
    try {
      // Mock health check for demo
      const status = 'healthy';
      const responseTime = Math.floor(Math.random() * 200) + 50; // 50-250ms

      return { serviceId, status, responseTime };
    } catch (error) {
      throw new Error(`Health check failed: ${error?.message}`);
    }
  }

  // Real-time subscriptions (demo implementations)
  subscribeToServiceUpdates(callback) {
    // Return mock subscription object
    return {
      unsubscribe: () => console.log('Unsubscribed from service updates')
    };
  }

  subscribeToMetrics(callback) {
    // Return mock subscription object
    return {
      unsubscribe: () => console.log('Unsubscribed from metrics updates')
    };
  }

  unsubscribe(channel) {
    if (channel?.unsubscribe) {
      channel.unsubscribe();
    }
  }
}

export const backendArchitectureService = new BackendArchitectureService();
export default backendArchitectureService;