import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { fetchAndParseTrainingData } from './src/parser';

// Resolve directory paths for both ESM and CJS bundling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON parsing
  app.use(express.json());

  // API Routes
  app.get('/api/training-data', async (req, res) => {
    console.log('[API] Fetching and parsing training data from Google Sheets...');
    try {
      const data = await fetchAndParseTrainingData();
      // Set header to prevent caching, satisfying the user's "refresh load always" instruction
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.json(data);
    } catch (err: any) {
      console.error('[API] Error retrieving training data:', err.message);
      res.status(500).json({
        error: 'Failed to retrieve training data from Google Sheets.',
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Server] Running in DEVELOPMENT mode. Mounting Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Server] Running in PRODUCTION mode. Serving static assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Technical Training Dashboard server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal error on startup:', err);
  process.exit(1);
});
