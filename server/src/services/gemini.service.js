// src/services/gemini.service.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseExpenseWithGemini = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      Parse the following expense entry and return ONLY a valid JSON object with these fields:
      - "amount" (number): The expense amount in rupees (₹). If not found, use 0.
      - "category" (string): Must be one of: "Food", "Transport", "Shopping", "Bills", "Entertainment", "Others"
      - "description" (string): A brief description of the expense
      - "location" (string or null): The place/store name if mentioned (e.g., "Burger King", "Starbucks"), otherwise null
      - "is_unclear" (boolean): true if the category or amount is ambiguous, false otherwise
      
      Text: "${text}"
      
      Return ONLY the JSON object, no markdown formatting, no explanations.
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