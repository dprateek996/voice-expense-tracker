const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const {
  getExpenses,
  addExpense,
  deleteExpense,
} = require('../controllers/expense.controller');

const router = express.Router();

router.get('/', authenticate, getExpenses);
router.post('/', authenticate, addExpense);
router.delete('/:id', authenticate, deleteExpense);

module.exports = router;