import React, { useState } from 'react';
import { Settings, Database, Globe, Shield, Activity, GitBranch, X, Plus, CheckCircle } from 'lucide-react';
import ServiceStatusGrid from './ServiceStatusGrid';

const ConfigurationPanel = ({ 
  activeTab, 
  services = [], 
  endpoints = [], 
  selectedService, 
  onServiceStatusUpdate, 
  onHealthCheck, 
  getStatusIcon, 
  getEnvironmentBadge 
}) => {
  const [editingService, setEditingService] = useState(null);
  const [editingEndpoint, setEditingEndpoint] = useState(null);
  const [showAddService, setShowAddService] = useState(false);

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Backend Services</h2>
          <p className="text-gray-600 mt-1">Monitor and manage your backend infrastructure</p>
        </div>
        <button
          onClick={() => setShowAddService(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      <ServiceStatusGrid
        services={services}
        onServiceSelect={() => {}}
        selectedService={selectedService}
        onHealthCheck={onHealthCheck}
        getStatusIcon={getStatusIcon}
        getEnvironmentBadge={getEnvironmentBadge}
      />
    </div>
  );

  const renderDatabaseTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
          <p className="text-gray-600">PostgreSQL with pgvector extension</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Connection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Host:</span>
              <span className="text-gray-900 font-mono">postgres://fits-ai-db</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Version:</span>
              <span className="text-gray-900">PostgreSQL 16.1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Extensions:</span>
              <span className="text-gray-900">vector, pgcrypto, uuid-ossp</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Active Connections:</span>
              <span className="text-gray-900">24/100</span>
            </div>
          </div>
        </div>

        {/* pgVector Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vector Database</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Dimensions:</span>
              <span className="text-gray-900">1536</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Index Type:</span>
              <span className="text-gray-900">ivfflat</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stored Vectors:</span>
              <span className="text-gray-900">45,234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avg Query Time:</span>
              <span className="text-gray-900">125ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Migration Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Status</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-900">20250815101745_backend_architecture_management.sql</span>
            <span className="text-xs text-gray-500">Applied 2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-900">20250814094521_knowledge_base_schema.sql</span>
            <span className="text-xs text-gray-500">Applied 1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVectorStoresTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <GitBranch className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vector Store Adapters</h2>
          <p className="text-gray-600">Vector database provider configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* pgVector (Active) */}
        <div className="bg-white rounded-lg border-2 border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">pgVector</h3>
                <p className="text-sm text-gray-500">PostgreSQL Native</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Provider:</span>
              <span className="text-gray-900">pgvector</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Embedding Model:</span>
              <span className="text-gray-900">text-embedding-3-small</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vector Dimensions:</span>
              <span className="text-gray-900">1536</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Storage:</span>
              <span className="text-gray-900">120.5 GB</span>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100">
            Configure Settings
          </button>
        </div>

        {/* Pinecone (Available) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <GitBranch className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pinecone</h3>
                <p className="text-sm text-gray-500">Managed Vector DB</p>
              </div>
            </div>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              Available
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Provider:</span>
              <span className="text-gray-900">pinecone</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Environment:</span>
              <span className="text-gray-900">us-east-1-aws</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Index:</span>
              <span className="text-gray-900">fits-embeddings</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Namespace:</span>
              <span className="text-gray-900">prod_</span>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100">
            Switch to Pinecone
          </button>
        </div>
      </div>
    </div>
  );

  const renderAPIsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="h-8 w-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Endpoints</h2>
          <p className="text-gray-600">REST API monitoring and rate limit management</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Endpoints</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {endpoints?.map((endpoint) => (
            <div key={endpoint?.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    endpoint?.method === 'GET' ? 'bg-green-100 text-green-800' :
                    endpoint?.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                    endpoint?.method === 'PUT'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {endpoint?.method}
                  </span>
                  <code className="text-sm font-mono text-gray-900">{endpoint?.path}</code>
                  {endpoint?.description && (
                    <span className="text-sm text-gray-500">— {endpoint?.description}</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {endpoint?.response_time_ms}ms • {endpoint?.success_rate}%
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Rate: {endpoint?.rate_limit}/min</span>
                    {endpoint?.is_enabled ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAuthTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-8 w-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Authentication & Security</h2>
          <p className="text-gray-600">JWT configuration and RLS policies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JWT Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">JWT Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Secret Status:</span>
              <span className="text-green-600 font-medium">✓ Configured</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Algorithm:</span>
              <span className="text-gray-900">HS256</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Token Expiry:</span>
              <span className="text-gray-900">24 hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Refresh Token:</span>
              <span className="text-green-600 font-medium">Enabled</span>
            </div>
          </div>
        </div>

        {/* CORS Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CORS Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Allowed Origins:</span>
              <span className="text-gray-900">https://fits-ai.com</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Methods:</span>
              <span className="text-gray-900">GET, POST, PUT, DELETE</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Credentials:</span>
              <span className="text-green-600 font-medium">Allowed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Max Age:</span>
              <span className="text-gray-900">86400 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* RLS Policies Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Row Level Security Policies</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-900">backend_services</span>
            <span className="text-green-600 text-sm">✓ Admin access only</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-900">tenants</span>
            <span className="text-green-600 text-sm">✓ Owner + admin access</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-900">provider_configs</span>
            <span className="text-green-600 text-sm">✓ Admin access only</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-900">profiles</span>
            <span className="text-green-600 text-sm">✓ User own profile access</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Activity className="h-8 w-8 text-orange-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Monitoring</h2>
          <p className="text-gray-600">Real-time performance metrics and alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">CPU Usage</h3>
            <Activity className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">45.2%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45.2%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Memory Usage</h3>
            <Database className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">78.5%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78.5%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Requests/min</h3>
            <Globe className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">1,250</div>
          <div className="text-sm text-green-600">↑ 12% from last hour</div>
        </div>
      </div>
    </div>
  );

  const renderConfigTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-8 w-8 text-gray-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
          <p className="text-gray-600">Environment settings and Docker configuration</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Environment Variables */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Variables</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <code className="text-sm text-gray-900">APP_URL</code>
              <span className="text-sm text-gray-500">https://fits-ai.com</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <code className="text-sm text-gray-900">PORT</code>
              <span className="text-sm text-gray-500">8787</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <code className="text-sm text-gray-900">JWT_SECRET</code>
              <span className="text-sm text-green-600">✓ Configured</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <code className="text-sm text-gray-900">Y_SERVER_PORT</code>
              <span className="text-sm text-gray-500">1234</span>
            </div>
          </div>
        </div>

        {/* Docker Services */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Docker Services</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900">fits-api</span>
              </div>
              <span className="text-sm text-gray-500">Running (Port 8787)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900">y-server</span>
              </div>
              <span className="text-sm text-gray-500">Running (Port 1234)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900">postgres</span>
              </div>
              <span className="text-sm text-gray-500">Running (Port 5432)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab content mapping
  const tabContent = {
    services: renderServicesTab,
    database: renderDatabaseTab,
    vectors: renderVectorStoresTab,
    apis: renderAPIsTab,
    auth: renderAuthTab,
    monitoring: renderMonitoringTab,
    config: renderConfigTab
  };

  const currentTabRenderer = tabContent?.[activeTab] || tabContent?.services;

  return (
    <div className="h-full overflow-y-auto">
      {currentTabRenderer()}
    </div>
  );
};

export default ConfigurationPanel;