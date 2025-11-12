// src/api/controllers/conversation.controller.js

const { PrismaClient } = require('@prisma/client');
const { 
  sendMessageToAI, 
  extractExpenseFromConversation,
  shouldCreateExpense 
} = require('../../services/conversation.service');

const prisma = new PrismaClient();

const MAX_MESSAGES = 50;

/**
 * Send a message and get AI response
 */
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation for user
    let conversation = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    let messages = [];
    
    if (conversation) {
      messages = conversation.messages || [];
    }

    // Add user message to history
    messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });

    // Get AI response with conversation context
    const aiResponse = await sendMessageToAI(message, messages);

    // Add AI response to history
    messages.push({
      role: 'assistant',
      content: aiResponse.text,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 50 messages
    if (messages.length > MAX_MESSAGES) {
      messages = messages.slice(-MAX_MESSAGES);
    }

    // Check if we should create an expense
    let expense = null;
    if (aiResponse.shouldCreateExpense) {
      const expenseData = await extractExpenseFromConversation(messages);
      
      if (expenseData && expenseData.amount > 0) {
        expense = await prisma.expense.create({
          data: {
            userId,
            amount: expenseData.amount,
            category: expenseData.category,
            description: expenseData.description,
            location: expenseData.location || null,
            date: expenseData.date || new Date(),
            source: 'chat',
            parsed_by: 'gemini-1.5-flash',
            is_unclear: expenseData.is_unclear || false,
          },
        });
      }
    }

    // Save/update conversation
    if (conversation) {
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: { messages },
      });
    } else {
      conversation = await prisma.conversation.create({
        data: {
          userId,
          messages,
        },
      });
    }

    res.status(200).json({
      message: aiResponse.text,
      expense,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message 
    });
  }
};

/**
 * Get conversation history
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversation = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({
      messages: conversation.messages || [],
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
};

/**
 * Clear conversation history
 */
const clearHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.conversation.deleteMany({
      where: { userId },
    });

    res.status(200).json({ message: 'Conversation history cleared' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear conversation history' });
  }
};

/**
 * Start new conversation (clear current and start fresh)
 */
const newConversation = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete existing conversations
    await prisma.conversation.deleteMany({
      where: { userId },
    });

    // Create new conversation with welcome message
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        messages: [
          {
            role: 'assistant',
            content: 'Hi! I\'m here to help you track your expenses. You can tell me about your spending in natural language. For example: "I spent 50 rupees on coffee" or "Paid 200 for lunch at Pizza Hut".',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    });

    res.status(200).json({
      message: conversation.messages[0].content,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('New conversation error:', error);
    res.status(500).json({ error: 'Failed to start new conversation' });
  }
};

module.exports = {
  sendMessage,
  getHistory,
  clearHistory,
  newConversation,
};
