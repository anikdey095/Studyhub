import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.route.js';
import noteRoutes from './modules/notes/note.route.js';
import statsRoutes from './modules/stats/stats.route.js';
import adminRoutes from './modules/admin/admin.route.js';
import { checkDatabaseConnection, checkDatabaseStatus } from './middleware/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// 1. Enterprise Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: false, // Allows Next.js frontend embedding & static assets
}));

// 2. High Traffic Protection: Rate Limiting
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Limit each IP to 600 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests',
    message: 'High server traffic detected. Please slow down and try again in a few minutes.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per 15 minutes to prevent brute-force attacks
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts',
    message: 'Too many login or signup attempts from this IP. Please try again after 15 minutes.'
  }
});

app.use('/api/', globalApiLimiter);

// 3. CORS and Request Body Parsing
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : ['*'];

app.use(cors({
  origin: process.env.FRONTEND_URL ? allowedOrigins : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded files
const uploadsStaticPath = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsStaticPath)) {
  fs.mkdirSync(uploadsStaticPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsStaticPath));

// Root route (Always responds immediately for readiness check)
app.get('/', (req, res) => {
  res.json({
    name: 'StudyHub API',
    status: 'online',
    version: '1.0.0',
    documentation: '/health',
    security: {
      rateLimiting: 'active',
      helmet: 'active',
    }
  });
});

// Comprehensive Health check route
app.get('/health', async (req, res) => {
  const dbConnected = await checkDatabaseStatus();
  res.json({
    status: 'OK',
    server: 'healthy',
    database: dbConnected ? 'connected' : 'initializing/disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    security: 'high-traffic-protected',
  });
});

// Database check for DB-dependent routes
app.use(checkDatabaseConnection);

// API Routes with tailored rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({ 
    error: err.name || 'Server error',
    message: err.message || 'Something went wrong on the server'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;