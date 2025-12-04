const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    console.log("🔍 Testing Gemini API...");
    console.log("API Key (first 10 chars):", API_KEY?.substring(0, 10) + "...");
    
    // Try different model names
    const modelsToTry = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "models/gemini-pro",
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash"
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`\n📝 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS with ${modelName}:`, text.substring(0, 50));
        break; // Stop on first success
      } catch (error) {
        console.log(`❌ FAILED with ${modelName}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

listModels();
