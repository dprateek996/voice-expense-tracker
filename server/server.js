require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();

const authRoutes = require('./src/api/routes/auth.routes');
const expenseRoutes = require('./src/api/routes/expense.routes');
const refineRoutes = require('./src/api/routes/refine.routes');
const conversationRoutes = require('./src/api/routes/conversation.routes');
const prisma = require('./prisma.config');

let isDbConnected = false;
let dbLastError = null;
let isConnecting = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureDbConnection = async () => {
  if (isConnecting || isDbConnected) return;
  isConnecting = true;

  const retryMs = Number(process.env.DB_RETRY_MS || 5000);
  while (!isDbConnected) {
    try {
      await prisma.$connect();
      isDbConnected = true;
      dbLastError = null;
      console.log('Prisma connected to DB');
      break;
    } catch (err) {
      dbLastError = err;
      console.error('Prisma connection failed:', err?.message || err);
      console.error(`Retrying DB connection in ${retryMs}ms...`);
      await wait(retryMs);
    }
  }

  isConnecting = false;
};

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

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  if (req.path === '/api/db-check') return next();

  if (!isDbConnected) {
    return res.status(503).json({
      error: 'Database unavailable. Retrying connection in background.',
      error_code: 'DB_UNAVAILABLE',
      details: dbLastError?.message || 'Connection not established yet.',
    });
  }
  return next();
});

// Rate limit auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Mount routers with stable API namespaces
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth', authRoutes);      // <-- was '/api' before — matches frontend /api/auth/login
app.use('/api/expense', expenseRoutes); // keep expense route
app.use('/api/refine', refineRoutes);
app.use('/api/conversation', conversationRoutes);

// DB-check endpoint useful during startup/debug
app.get('/api/db-check', async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({
      status: 'error',
      db: 'unavailable',
      details: dbLastError?.message || 'Connection not established yet.',
    });
  }
  try {
    // quick lightweight query
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB check failed:', err?.message || err);
    isDbConnected = false;
    ensureDbConnection().catch((error) => {
      console.error('DB reconnect loop failed to start:', error?.message || error);
    });
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
const HOST = process.env.HOST || '127.0.0.1';

async function start() {
  const server = app.listen(PORT, HOST, () => console.log(`Server listening on http://${HOST}:${PORT}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} already in use. Kill the process using it or set PORT env var.`);
      process.exit(1);
    }
    if (err.code === 'EPERM') {
      console.error(`Permission denied while binding ${HOST}:${PORT}. Try HOST=127.0.0.1 and a free PORT.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });

  ensureDbConnection().catch((err) => {
    console.error('Failed to initialize DB retry loop:', err?.message || err);
  });
}

start();
