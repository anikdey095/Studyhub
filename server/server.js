import app from './src/app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 StudyHub server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});