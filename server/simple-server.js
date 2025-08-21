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

// N8n webhook proxy endpoint for chat support
app.post('/api/chat/n8n-webhook', async (req, res) => {
  try {
    const { message, user, conversationId, sessionId, source } = req.body;
    
    // Try to forward to actual n8n webhook first
    const n8nWebhookUrl = 'https://fitsoman.app.n8n.cloud/webhook/4add9b15-366c-4b8d-af9e-1168410ebde9';
    
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
        timeout: 10000
      });
      
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch (n8nError) {
      console.log('N8n webhook unavailable, using fallback response');
    }
    
    // Fallback: Generate intelligent response based on message content
    const messageText = message?.toLowerCase() || '';
    let response = '';
    let suggestions = [];
    
    if (messageText.includes('password') || messageText.includes('forgot')) {
      response = "I can help you with password issues! Here are the steps:\n\n1. Go to the login page and click 'Forgot Password'\n2. Enter your email address\n3. Check your email for a reset link\n4. Follow the instructions in the email\n\nIf you don't receive the email, check your spam folder or contact IT support.";
      suggestions = [
        "I need help with 2FA",
        "My account is locked",
        "How do I change my password?"
      ];
    } else if (messageText.includes('email') || messageText.includes('outlook') || messageText.includes('mail')) {
      response = "Email issues can be frustrating! Let's troubleshoot:\n\n1. Check your internet connection\n2. Verify your email settings\n3. Clear your email app cache\n4. Try accessing email through web browser\n5. Check if your mailbox is full\n\nIf none of these work, there might be a server issue. Would you like me to check the email server status?";
      suggestions = [
        "Check email server status",
        "Help with email setup",
        "I can't send emails"
      ];
    } else if (messageText.includes('software') || messageText.includes('install') || messageText.includes('program')) {
      response = "I'll help you with software installation! Here's what you can do:\n\n1. Check if you have admin rights\n2. Download software from official sources only\n3. Run Windows Update first\n4. Temporarily disable antivirus during installation\n5. Right-click installer and 'Run as Administrator'\n\nWhat specific software are you trying to install?";
      suggestions = [
        "I need admin rights",
        "Software won't start after install",
        "Getting compatibility errors"
      ];
    } else if (messageText.includes('network') || messageText.includes('internet') || messageText.includes('wifi')) {
      response = "Network connectivity issues can be resolved by:\n\n1. Restart your router/modem\n2. Check network cables\n3. Run Windows Network Troubleshooter\n4. Flush DNS cache: Open CMD as admin and type 'ipconfig /flushdns'\n5. Update network drivers\n\nAre you using WiFi or wired connection?";
      suggestions = [
        "WiFi keeps disconnecting",
        "Slow internet speed",
        "Can't connect to company VPN"
      ];
    } else if (messageText.includes('printer') || messageText.includes('print')) {
      response = "Printer problems are common! Try these steps:\n\n1. Check printer power and connections\n2. Clear print queue\n3. Update printer drivers\n4. Run printer troubleshooter\n5. Check paper and ink/toner levels\n\nIs this a local printer or network printer?";
      suggestions = [
        "Printer offline error",
        "Poor print quality",
        "Add network printer"
      ];
    } else if (messageText.includes('slow') || messageText.includes('performance') || messageText.includes('freeze')) {
      response = "Let's speed up your computer! Try these solutions:\n\n1. Restart your computer\n2. Check for Windows updates\n3. Close unnecessary programs\n4. Run disk cleanup\n5. Check for malware\n6. Free up disk space\n\nHas this been happening recently or for a while?";
      suggestions = [
        "Computer freezes randomly",
        "Programs take forever to load",
        "Blue screen errors"
      ];
    } else if (messageText.includes('access') || messageText.includes('permission') || messageText.includes('blocked')) {
      response = "Access issues need proper authorization. Here's how to proceed:\n\n1. Check your user permissions\n2. Try running as administrator\n3. Contact your manager for access approval\n4. Verify you're in the correct user groups\n5. Clear browser cache if it's a web application\n\nWhat specific system or file are you trying to access?";
      suggestions = [
        "Need access to shared folder",
        "Can't access company portal",
        "Getting permission denied errors"
      ];
    } else {
      response = `Hi ${user?.displayName || 'there'}! I'm here to help with your IT issues. Could you provide more details about what you're experiencing?\n\nI can assist with:\n• Password and account issues\n• Email problems\n• Software installation and troubleshooting\n• Network connectivity\n• Printer setup and issues\n• Computer performance\n• Access and permission problems`;
      suggestions = [
        "I forgot my password",
        "My email isn't working", 
        "I need help installing software",
        "I'm having network issues"
      ];
    }
    
    res.json({
      reply: response,
      suggestions: suggestions,
      source: 'local_fallback',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat webhook error:', error);
    res.status(500).json({ 
      error: 'Chat service temporarily unavailable',
      fallback: true
    });
  }
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