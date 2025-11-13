const prisma = require('../../../prisma.config');

const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

const addConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        messages,
      },
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Add conversation error:', error);
    res.status(500).json({ error: 'Failed to add conversation' });
  }
};

module.exports = {
  getConversations,
  addConversation,
};