require('dotenv').config(); // Loads environment variables from .env file

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/api/routes/auth.routes');
const expenseRoutes = require('./src/api/routes/expense.routes');
const conversationRoutes = require('./src/api/routes/conversation.routes');
const refineRoutes = require('./src/api/routes/refine.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/refine', refineRoutes);

app.get('/', (req, res) => {
  res.send('Voice Expense Tracker API is running!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});