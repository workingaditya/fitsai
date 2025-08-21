import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../storage.js';

const router = express.Router();

// JWT secret - in production this should be from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Demo users for authentication (matching the original login form)
const DEMO_USERS = [
  { email: 'admin@company.com', password: 'Admin123!', role: 'admin', name: 'Admin User' },
  { email: 'employee@company.com', password: 'Employee123!', role: 'viewer', name: 'Employee User' },
  { email: 'support@company.com', password: 'Support123!', role: 'sme', name: 'Support User' },
  { email: 'security@company.com', password: 'Security123!', role: 'admin', name: 'Security User' },
];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find demo user
    const demoUser = DEMO_USERS.find(u => u.email === email);
    
    if (!demoUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    if (password !== demoUser.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: demoUser.email, 
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: demoUser.email,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export { authenticateToken };
export default router;