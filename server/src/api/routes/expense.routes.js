// /server/src/api/routes/expense.routes.js

const express = require('express');
const router = express.Router();
const { addExpenseFromVoice, getAllExpenses } = require('../controllers/expense.controller');
const { protect } = require('../../middleware/auth.middleware');

// @route   POST /api/expense/voice
// @desc    Add a new expense from a voice transcript
// @access  Private
router.post('/voice', protect, addExpenseFromVoice);

// @route   GET /api/expense
// @desc    Get all expenses for the logged-in user
// @access  Private
router.get('/', protect, getAllExpenses);

module.exports = router;