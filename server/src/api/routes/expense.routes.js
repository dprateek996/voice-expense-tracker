// src/api/routes/expense.routes.js

const express = require('express');
const {
  createExpense,
  getAllExpenses,
} = require('../controllers/expense.controller');

const router = express.Router();

router.post('/', createExpense);
router.get('/', getAllExpenses);

module.exports = router;