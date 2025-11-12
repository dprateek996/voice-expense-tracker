// src/api/routes/conversation.routes.js

const express = require('express');
const {
  sendMessage,
  getHistory,
  clearHistory,
  newConversation,
} = require('../controllers/conversation.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

// All conversation routes require authentication
router.post('/message', authenticate, sendMessage);
router.get('/history', authenticate, getHistory);
router.delete('/clear', authenticate, clearHistory);
router.post('/new', authenticate, newConversation);

module.exports = router;
