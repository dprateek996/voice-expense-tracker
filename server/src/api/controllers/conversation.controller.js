const prisma = require('../../../prisma.config');
const {
  sendMessageToAI,
  extractExpenseFromConversation,
  shouldCreateExpense,
} = require('../../services/conversation.service');

const getConversations = async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conversations.' });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: id,
        userId: req.user.userId,
      },
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conversation messages.' });
  }
};

const createConversation = async (req, res) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId: req.user.userId,
        messages: [],
      },
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Failed to create conversation:', error.message);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
};

const postMessageToConversation = async (req, res) => {
  const { id } = req.params;
  const { message, source = 'chat' } = req.body;
  const userId = req.user.userId;

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

    const existingMessages = Array.isArray(conversation.messages) ? conversation.messages : [];
    const userMessage = {
      role: 'user',
      content: String(message).trim(),
      source,
      timestamp: new Date().toISOString(),
    };

    const historyWithUser = [...existingMessages, userMessage];
    const aiResult = await sendMessageToAI(userMessage.content, historyWithUser);

    const assistantMessage = {
      role: 'assistant',
      content: aiResult.text,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...historyWithUser, assistantMessage];
    let createdExpense = null;

    if (aiResult.shouldCreateExpense || shouldCreateExpense(updatedHistory)) {
      const extractedExpense = await extractExpenseFromConversation(updatedHistory);
      if (extractedExpense?.amount && extractedExpense.amount > 0) {
        createdExpense = await prisma.expense.create({
          data: {
            userId,
            amount: extractedExpense.amount,
            category: extractedExpense.category || 'Other',
            description: extractedExpense.description || 'Expense',
            location: extractedExpense.location || null,
            ...(extractedExpense.date ? { date: new Date(extractedExpense.date) } : {}),
            source: source === 'voice' ? 'voice' : 'chat',
            parsed_by: aiResult?.meta?.model || process.env.SARVAM_CHAT_MODEL || 'sarvam-m',
            is_unclear: Boolean(extractedExpense.is_unclear),
          },
        });
      }
    }

    const persistedConversation = await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        messages: updatedHistory,
      },
    });

    res.status(200).json({
      conversation: persistedConversation,
      assistantMessage,
      expenseCreated: Boolean(createdExpense),
      expense: createdExpense,
      meta: aiResult.meta,
    });
  } catch (error) {
    console.error('Failed to post conversation message:', error.message);
    res.status(500).json({ error: 'Failed to process conversation message.' });
  }
};

module.exports = {
  getConversations,
  getConversationMessages,
  createConversation,
  postMessageToConversation,
};
