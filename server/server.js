import 'dotenv/config';
import app from './src/app.js';
import { initializeDatabase } from './init-db.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 StudyHub server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);

  // Automatically ensure database tables and columns exist on boot
  if (process.env.DATABASE_URL) {
    initializeDatabase().catch((err) => {
      console.warn('Database initialization note:', err.message);
    });
  }
});