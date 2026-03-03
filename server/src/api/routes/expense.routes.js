const express = require('express');
const router = express.Router();
const {
  addExpenseFromVoice,
  getAllExpenses,
  transcribeVoiceAudio,
} = require('../controllers/expense.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validateExpense } = require('../../middleware/validation.middleware');

router.post('/voice', protect, validateExpense, addExpenseFromVoice);
router.post('/transcribe', protect, transcribeVoiceAudio);
router.get('/', protect, getAllExpenses);

module.exports = router;
