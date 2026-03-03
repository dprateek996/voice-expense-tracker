const {
  sendMessageToAIWithSarvam,
  extractExpenseFromConversationWithSarvam,
} = require('./sarvam.service');

const sendMessageToAI = async (userMessage, conversationHistory) => (
  sendMessageToAIWithSarvam(userMessage, conversationHistory)
);

const extractExpenseFromConversation = async (conversationHistory) => (
  extractExpenseFromConversationWithSarvam(conversationHistory)
);

const shouldCreateExpense = (conversationHistory = []) => {
  const lastMessages = conversationHistory.slice(-5);
  const userMessages = lastMessages
    .filter((msg) => msg.role === 'user')
    .map((msg) => String(msg.content || '').toLowerCase());

  const hasAmount = userMessages.some((msg) => (
    /\d+\s*(rupees?|rs?|₹)/i.test(msg)
    || /₹?\s*\d+/.test(msg)
    || /[०-९]+\s*(रुपये|rs|₹)/i.test(msg)
  ));

  const hasItem = userMessages.some((msg) => (
    msg.length > 8 && !/(how much|what|where|when|kitna|kya|kahaan)/i.test(msg)
  ));

  return hasAmount && hasItem;
};

module.exports = {
  sendMessageToAI,
  extractExpenseFromConversation,
  shouldCreateExpense,
};
