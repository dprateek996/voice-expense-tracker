const prisma = require('../../../prisma.config');

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

const postMessageToConversation = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message content is required.' });
    }

    res.status(200).json({ 
        message: "Message received. AI response functionality not yet implemented.",
        conversationId: id
    });
};

module.exports = {
  getConversations,
  getConversationMessages,
  postMessageToConversation,
};