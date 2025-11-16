require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// === ALL ROUTE IMPORTS ===
const authRoutes = require('./src/api/routes/auth.routes');
const expenseRoutes = require('./src/api/routes/expense.routes');
const conversationRoutes = require('./src/api/routes/conversation.routes');


const app = express();

// === MIDDLEWARE SETUP ===
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// === API ROUTE REGISTRATION ===
app.use('/api/auth', authRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/conversation', conversationRoutes);

// === ROOT ENDPOINT ===
app.get('/', (req, res) => {
  res.send('Voice Expense Tracker API is running!');
});

// === SERVER START ===
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});