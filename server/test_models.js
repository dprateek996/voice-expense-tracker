require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Dummy model to get client
        // Actually, there isn't a direct listModels method on the instance easily accessible without using the raw API or looking at docs.
        // But let's try to just use 'gemini-pro' and see if it works, as that was the original one (but maybe it was deprecated?).
        // The original error was [404 Not Found] models/gemini-1.5-pro is not found.

        // Let's try to run a simple generation with 'gemini-pro'
        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Hello");
        console.log("gemini-pro success:", resultPro.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        console.log("Testing gemini-1.5-flash-latest...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const resultFlash = await modelFlash.generateContent("Hello");
        console.log("gemini-1.5-flash-latest success:", resultFlash.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash-latest failed:", error.message);
    }
}

listModels();
