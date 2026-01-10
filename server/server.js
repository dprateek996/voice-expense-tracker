require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();

const authRoutes = require('./src/api/routes/auth.routes');
const expenseRoutes = require('./src/api/routes/expense.routes');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// ... require other routes if needed

app.use(express.json());
app.use(cookieParser());

// Allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://voex.prateekdwivedi.me',
  'https://voice-expense-tracker-lilac.vercel.app',
  process.env.CLIENT_ORIGIN
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Check if origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel preview URLs (pattern: *.vercel.app)
    if (origin.match(/^https:\/\/.*\.vercel\.app$/)) {
      return callback(null, true);
    }

    // Reject all other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Mount routers with stable API namespaces
app.use('/api/auth', authRoutes);      // <-- was '/api' before — matches frontend /api/auth/login
app.use('/api/expense', expenseRoutes); // keep expense route

// If you have a general API prefix, keep any other API mounts here...
// Example: app.use('/api/conversation', conversationRoutes);

// DB-check endpoint useful during startup/debug
app.get('/api/db-check', async (req, res) => {
  try {
    // quick lightweight query
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB check failed:', err?.message || err);
    return res.status(503).json({ status: 'error', db: 'unavailable' });
  }
});

// 404 for unknown API paths
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Serve client build (if present) to support deep routes like /login in production
const clientDist = path.resolve(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    // non-api requests should return client index.html
    if (req.path.startsWith('/api')) return res.status(404).send('Not Found');
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // In dev we let Vite handle SPA routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.status(404).send('Not Found');
  });
}

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await prisma.$connect();
    console.log('Prisma connected to DB');
  } catch (err) {
    console.error('Prisma connection failed at startup:', err?.message || err);
    console.error('Make sure your database is running and DATABASE_URL is set in server/.env');
    process.exit(1);
  }

  const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} already in use. Kill the process using it or set PORT env var.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
}

start();