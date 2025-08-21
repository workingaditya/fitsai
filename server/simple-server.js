import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 5000);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.REPLIT_DEV_DOMAIN, 'https://*.replit.app', 'https://*.replit.co']
    : ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'FITS AI Server is running'
  });
});

// Demo authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo users
  const demoUsers = [
    { email: 'admin@company.com', password: 'Admin123!', role: 'admin', name: 'Admin User' },
    { email: 'employee@company.com', password: 'Employee123!', role: 'viewer', name: 'Employee User' },
    { email: 'support@company.com', password: 'Support123!', role: 'sme', name: 'Support User' },
    { email: 'security@company.com', password: 'Security123!', role: 'admin', name: 'Security User' },
  ];

  const user = demoUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      token: 'demo-token-' + Date.now(),
      user: {
        id: user.email,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Mock API endpoints
app.get('/api/backend-services', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'FITS API Server',
        serviceType: 'api',
        status: 'healthy',
        version: '1.2.3',
        environment: 'production',
        created_at: new Date().toISOString(),
        endpoint_url: 'http://localhost:5000',
        last_health_check: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/system-metrics', (req, res) => {
  const mockMetrics = [
    {
      id: '1',
      service_id: '1',
      metric_name: 'cpu_usage',
      metric_value: Math.floor(Math.random() * 30) + 30,
      metric_unit: 'percent',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      service_id: '1',
      metric_name: 'memory_usage',
      metric_value: Math.floor(Math.random() * 20) + 40,
      metric_unit: 'percent',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      service_id: '1',
      metric_name: 'response_time',
      metric_value: Math.floor(Math.random() * 200) + 100,
      metric_unit: 'milliseconds',
      timestamp: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockMetrics
  });
});

// Tenants API
app.get('/api/tenants', (req, res) => {
  const mockTenants = [
    {
      id: '1',
      name: 'FITS AI Production',
      slug: 'fits-prod',
      plan: 'enterprise',
      region: 'us-west-2',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      resource_usage: {
        api_calls: 125000,
        storage_gb: 15.2,
        users: 48
      },
      billing_data: {
        monthly_cost: 2500,
        usage_cost: 1200
      },
      provider_config: {
        llm: { provider: 'openai', model: 'gpt-4o-mini' },
        vector: { provider: 'pgvector', dimensions: 1536 }
      },
      created_by: {
        id: 'admin@company.com',
        display_name: 'Admin User',
        role: 'admin'
      }
    }
  ];

  res.json({
    success: true,
    data: mockTenants
  });
});

// Authentication endpoints
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Mock user data
  res.json({
    success: true,
    user: {
      id: 'admin@company.com',
      email: 'admin@company.com',
      role: 'admin',
      name: 'Admin User'
    }
  });
});

// Serve static files (Vite build output) - must come after API routes
app.use(express.static(path.join(__dirname, '../build')));

// Serve React app for specific routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

// Catch all other routes that aren't API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FITS AI Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});

export default app;