// src/services/conversation.service.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Send message to AI with conversation context
 */
const sendMessageToAI = async (userMessage, conversationHistory) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Build conversation context
    const contextMessages = conversationHistory
      .slice(-10) // Last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a helpful expense tracking assistant. Your job is to help users track their expenses through natural conversation.

RULES:
1. When a user mentions spending money, extract: amount, item/description, and location (if mentioned)
2. If amount is mentioned but not what it's for, ask: "What did you spend ₹X on?"
3. If item is mentioned but not amount, ask: "How much did it cost?"
4. When you have both amount and item, confirm and create the expense
5. Be conversational, friendly, and concise
6. Use Indian Rupees (₹) as the default currency
7. Auto-categorize expenses: Food, Transport, Shopping, Bills, Entertainment, Others
8. If user asks about their expenses, provide helpful summaries
9. Ignore social context (friends' names, etc.) - focus only on expense details

Current conversation:
${contextMessages}

User's latest message: ${userMessage}

Respond naturally and helpfully. If you have enough information to create an expense (amount + description), end your response with: [CREATE_EXPENSE]`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Check if AI wants to create an expense
    const shouldCreateExpense = text.includes('[CREATE_EXPENSE]');
    const cleanText = text.replace('[CREATE_EXPENSE]', '').trim();

    return {
      text: cleanText,
      shouldCreateExpense,
    };
  } catch (error) {
    console.error('AI conversation error:', error);
    
    // Fallback response
    return {
      text: "I'm having trouble processing that right now. Could you try again?",
      shouldCreateExpense: false,
    };
  }
};

/**
 * Extract expense data from conversation history
 */
const extractExpenseFromConversation = async (conversationHistory) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Get last few messages for context
    const recentMessages = conversationHistory
      .slice(-8)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const extractionPrompt = `Based on this conversation, extract expense information and return ONLY a JSON object:

Conversation:
${recentMessages}

Extract:
- amount (number): The expense amount in rupees. REQUIRED.
- category (string): One of: "Food", "Transport", "Shopping", "Bills", "Entertainment", "Others"
- description (string): What was purchased/paid for
- location (string or null): Store/place name if mentioned
- is_unclear (boolean): true if information is ambiguous
- date (ISO string or null): Use today's date unless specified

Return ONLY the JSON object, no markdown, no explanations.`;

    const result = await model.generateContent(extractionPrompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean and parse JSON
    const cleanedJson = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const expenseData = JSON.parse(cleanedJson);

    // Validate and set defaults
    if (!expenseData.amount || expenseData.amount <= 0) {
      return null; // Can't create expense without valid amount
    }

    expenseData.category = expenseData.category || 'Others';
    expenseData.description = expenseData.description || 'Expense';
    expenseData.is_unclear = expenseData.is_unclear || false;
    
    if (expenseData.date) {
      expenseData.date = new Date(expenseData.date);
    }

    return expenseData;
  } catch (error) {
    console.error('Expense extraction error:', error);
    return null;
  }
};

/**
 * Check if conversation has enough info to create expense
 */
const shouldCreateExpense = (conversationHistory) => {
  // Look for patterns indicating complete expense info
  const lastMessages = conversationHistory.slice(-5);
  const userMessages = lastMessages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content.toLowerCase());

  const hasAmount = userMessages.some(msg => 
    /\d+\s*(rupees?|rs?|₹)/i.test(msg) || /₹?\s*\d+/.test(msg)
  );

  const hasItem = userMessages.some(msg => 
    msg.length > 10 && !/(how much|what|where|when)/i.test(msg)
  );

  return hasAmount && hasItem;
};

module.exports = {
  sendMessageToAI,
  extractExpenseFromConversation,
  shouldCreateExpense,
};
