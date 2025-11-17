require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// === ALL ROUTE IMPORTS ===
const authRoutes = require('./src/api/routes/auth.routes');
const expenseRoutes = require('./src/api/routes/expense.routes');
const conversationRoutes = require('./src/api/routes/conversation.routes');

// === SECURITY MIDDLEWARE IMPORTS ===
const { securityHeaders, authLimiter, apiLimiter } = require('./src/middleware/security.middleware');

const app = express();

// === SECURITY MIDDLEWARE SETUP ===
app.use(securityHeaders);

// === GENERAL MIDDLEWARE SETUP ===
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(cookieParser());

// === API ROUTE REGISTRATION WITH RATE LIMITING ===
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/expense', apiLimiter, expenseRoutes);
app.use('/api/conversation', apiLimiter, conversationRoutes);

// === ROOT ENDPOINT ===
app.get('/', (req, res) => {
  res.send('Voice Expense Tracker API is running!');
});

// === SERVER START ===
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});