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

// Middleware to check database connection status without blocking requests
export const checkDatabaseConnection = async (req, res, next) => {
  if (!process.env.DATABASE_URL) {
    req.dbConnected = false;
    return next();
  }

  try {
    const connected = await checkDatabaseStatus();
    req.dbConnected = connected;
  } catch {
    req.dbConnected = false;
  }

  // Always proceed so controllers can write to DB or seamlessly use their in-memory fallback stores
  next();
};

export default prisma;