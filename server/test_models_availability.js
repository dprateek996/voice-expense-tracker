require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const modelsToTest = [
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro-001",
            "gemini-1.5-pro-002",
            "gemini-1.0-pro-001"
        ];

        console.log("Testing specific model versions...");

        for (const modelName of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ Model ${modelName} is working.`);
                console.log("Response:", result.response.text());
                return; // Found a working one
            } catch (error) {
                console.log(`❌ Model ${modelName} failed: ${error.message.split('\n')[0]}`);
            }
        }

        console.log("No working models found in the list.");

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
