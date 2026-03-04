const express = require('express');
const router = express.Router();
const {
  addExpenseFromVoice,
  previewVoiceExpense,
  getAllExpenses,
  transcribeVoiceAudio,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');
const { protect } = require('../../middleware/auth.middleware');
const { validateExpense } = require('../../middleware/validation.middleware');

router.post('/voice', protect, validateExpense, addExpenseFromVoice);
router.post('/voice/preview', protect, validateExpense, previewVoiceExpense);
router.post('/transcribe', protect, transcribeVoiceAudio);
router.get('/', protect, getAllExpenses);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;
