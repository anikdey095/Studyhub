import 'dotenv/config';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

// Create a single instance of PrismaClient
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

let isDbConnected = false;
let lastCheckTime = 0;
const CHECK_INTERVAL_MS = 15000; // Cache connection status for 15s

export const checkDatabaseStatus = async () => {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL_MS) {
    return isDbConnected;
  }
  
  if (!process.env.DATABASE_URL) {
    isDbConnected = false;
    lastCheckTime = now;
    return false;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
  } catch (error) {
    isDbConnected = false;
    console.warn('Database health check warning:', error.message);
  }
  lastCheckTime = now;
  return isDbConnected;
};

// Middleware to check database connection for routes requiring DB
export const checkDatabaseConnection = async (req, res, next) => {
  if (!process.env.DATABASE_URL) {
    // In demo / staging without DB configured yet, pass through with warning
    req.dbConnected = false;
    return next();
  }

  const connected = await checkDatabaseStatus();
  req.dbConnected = connected;
  
  if (!connected && req.method !== 'GET') {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Database connection is currently initializing or unreachable. Please check DATABASE_URL.'
    });
  }

  next();
};

export default prisma;