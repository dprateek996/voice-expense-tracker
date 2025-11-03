// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const expenseRoutes = require('./src/api/routes/expense.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('Voice Expense Tracker API is running!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});