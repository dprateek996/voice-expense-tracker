const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.2,
    maxOutputTokens: 256,
  },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function validateResult(obj) {
  if (!obj || typeof obj !== "object") return false;
  const requiredKeys = ["amount", "category", "description", "location", "date", "is_unclear"];
  for (const key of requiredKeys) { if (!(key in obj)) return false; }
  return typeof obj.is_unclear === "boolean";
}

async function parseExpenseWithGemini(transcript) {
  try {
    if (!transcript || typeof transcript !== "string") {
      return { is_unclear: true };
    }
    const cleanTranscript = transcript.replace(/[{}$`]/g, "");
    const prompt = `
      You are a robust, production-grade expense extraction engine. Your task is to extract correct expense details from natural, and sometimes error-prone, voice transcripts.
      - **Primary Goal**: Understand the user's intent. Correct obvious speech-to-text errors (e.g., "2004 burger" means "200 for burger").
      - **Currency**: INR (₹).
      - **Categories**: ["Groceries","Dining","Transport","Shopping","Utilities","Health","Entertainment","Travel","Education","Work","Personal Care","Fuel","Other"].
      - **Output**: Strict JSON only. If no amount can be logically found, you MUST set "is_unclear" to true.
      - **Parse this transcript**: "${cleanTranscript}"
    `;

    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const result = await model.generateContent(
          { contents: [{ role: "user", parts: [{ text: prompt }] }] },
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        const text = result?.response?.text?.() || "{}";
        const parsed = JSON.parse(text);
        if (validateResult(parsed)) {
          return parsed;
        }
        throw new Error("Invalid schema from AI");
      } catch (err) {
        attempt++;
        if (attempt >= maxRetries) throw err;
        await wait(200 * attempt);
      }
    }
  } catch (error) {
    console.error("Gemini parsing failed after retries:", error);
    return { is_unclear: true };
  }
}

module.exports = { parseExpenseWithGemini };