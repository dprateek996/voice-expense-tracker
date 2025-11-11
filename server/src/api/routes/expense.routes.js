// src/api/routes/expense.routes.js

const express = require('express');
const {
  createExpense,
  getAllExpenses,
  deleteExpense,
} = require('../controllers/expense.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

// All expense routes require authentication
router.post('/', authenticate, createExpense);
router.get('/', authenticate, getAllExpenses);
router.delete('/:id', authenticate, deleteExpense);

module.exports = router;