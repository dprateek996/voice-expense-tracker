// src/services/gemini.service.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseExpenseWithGemini = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Parse the following expense entry and return a JSON object with "amount", "category", and "description".
      The category must be one of the following: "Food", "Transport", "Shopping", "Bills", "Entertainment", "Others".
      If the category is ambiguous or cannot be determined, default it to "Others" and set an "is_unclear" flag to true.
      If the amount is not found, set it to 0.
      
      Text: "${text}"
      
      JSON Response:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const cleanedJsonString = responseText.replace(/```json|```/g, '').trim();

    const parsedData = JSON.parse(cleanedJsonString);
    return parsedData;
  } catch (error) {
    console.error('Error parsing with Gemini:', error);
    throw new Error('Failed to parse expense with AI.');
  }
};

module.exports = { parseExpenseWithGemini };