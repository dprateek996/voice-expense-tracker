// src/services/gemini.service.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseExpenseWithGemini = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      Parse the following expense entry and return ONLY a valid JSON object with these fields:
      - "amount" (number): The expense amount in rupees (₹). If not found, use 0.
      - "category" (string): Must be one of: "Food", "Transport", "Shopping", "Bills", "Entertainment", "Fuel", "Healthcare", "Education", "Others"
      - "description" (string): A brief description of the expense
      - "location" (string or null): The place/store name if mentioned (e.g., "Burger King", "Starbucks"), otherwise null
      - "is_unclear" (boolean): true if the category or amount is ambiguous, false otherwise

      The input may be in Hindi or English. If Hindi, translate and extract the same fields. Examples:
      - "कल मैंने 200 रुपये खाने पर खर्च किए" → amount: 200, category: Food, description: "खाने पर खर्च किए", location: null
      - "Paid 500 for shopping at Zara" → amount: 500, category: Shopping, description: "shopping at Zara", location: "Zara"
      - "आज 100 रुपये ट्रांसपोर्ट में दिए" → amount: 100, category: Transport, description: "ट्रांसपोर्ट में दिए", location: null
      - "200 ka petrol" → amount: 200, category: Fuel, description: "petrol", location: null
      - "Diesel ke liye 500 diye" → amount: 500, category: Fuel, description: "Diesel ke liye", location: null

      Text: "${text}"

      Return ONLY the JSON object, no markdown formatting, no explanations. If Hindi, keep description in Hindi but translate category to English.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean response - remove markdown code blocks and whitespace
    const cleanedJsonString = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsedData = JSON.parse(cleanedJsonString);
    
    // Validate required fields
    if (typeof parsedData.amount === 'undefined') {
      parsedData.amount = 0;
    }
    if (!parsedData.category) {
      parsedData.category = 'Others';
      parsedData.is_unclear = true;
    }
    if (!parsedData.description) {
      parsedData.description = text;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing with Gemini:', error);
    console.error('Raw response text:', error.message);
    throw new Error('Failed to parse expense with AI: ' + error.message);
  }
};

module.exports = { parseExpenseWithGemini };