const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const {
  getConversations,
  addConversation,
} = require('../controllers/conversation.controller');

const router = express.Router();

router.get('/', authenticate, getConversations);
router.post('/', authenticate, addConversation);

module.exports = router;