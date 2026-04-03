import pkg from '@prisma/client';

const { PrismaClient } = pkg;

// Create a single instance of PrismaClient
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Middleware to check database connection
export const checkDatabaseConnection = async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({
      error: 'Database connection failed',
      message: 'Unable to connect to the database. Please check your DATABASE_URL configuration.'
    });
  }
};

export default prisma;