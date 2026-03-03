const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversationMessages,
  createConversation,
  postMessageToConversation,
} = require('../controllers/conversation.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/', protect, getConversations);
router.post('/', protect, createConversation);
router.get('/:id', protect, getConversationMessages);
router.post('/:id', protect, postMessageToConversation);

module.exports = router;
