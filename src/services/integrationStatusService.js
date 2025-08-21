// Demo integration status service

class IntegrationStatusService {
  async getIntegrationStatus() {
    return [
      {
        id: 'openai',
        name: 'OpenAI',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: 125
      },
      {
        id: 'database',
        name: 'PostgreSQL',
        status: 'healthy',
        lastCheck: new Date().toISOString(),
        responseTime: 45
      }
    ];
  }

  async checkIntegrationHealth(integrationId) {
    return {
      id: integrationId,
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 200) + 50
    };
  }
}

export const integrationStatusService = new IntegrationStatusService();
export default integrationStatusService;