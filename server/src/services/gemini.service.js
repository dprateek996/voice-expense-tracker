const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function validateResult(obj) {
  if (!obj) return false;

  // Handle array of expenses
  if (Array.isArray(obj)) {
    return obj.every(item => validateResult(item));
  }

  if (typeof obj !== "object") return false;
  const requiredKeys = ["amount", "category", "description", "location", "date", "is_unclear"];
  for (const key of requiredKeys) { if (!(key in obj)) return false; }
  return typeof obj.is_unclear === "boolean";
}

async function parseExpenseWithGemini(transcript) {
  try {
    if (!transcript || typeof transcript !== "string") {
      return [{ is_unclear: true }];
    }
    
    const cleanTranscript = transcript.replace(/[{}$`]/g, "");
    
    const prompt = `You are an expense extraction AI. Extract expense details from the following text and return ONLY valid JSON.

Rules:
- Extract the amount (number)
- Determine category from: Groceries, Dining, Transport, Shopping, Utilities, Health, Entertainment, Travel, Education, Work, Personal Care, Fuel, Other
- Create a brief description
- Extract location if mentioned, otherwise null
- Use current date if not specified, otherwise null
- Set is_unclear to false if you found an amount

Text: "${cleanTranscript}"

Return JSON in this exact format:
{
  "amount": <number>,
  "category": "<category>",
  "description": "<description>",
  "location": null,
  "date": null,
  "is_unclear": false
}`;

    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        // Get the generative model - use gemini-2.0-flash
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
          }
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("🤖 [Gemini Raw Response]:", text);

        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanText);
        
        if (validateResult(parsed)) {
          // Normalize to array
          return Array.isArray(parsed) ? parsed : [parsed];
        }
        throw new Error("Invalid schema from AI");
      } catch (err) {
        attempt++;
        console.log(`⚠️ [Gemini] Attempt ${attempt}/${maxRetries} failed:`, err.message);
        if (attempt >= maxRetries) throw err;
        await wait(500 * attempt);
      }
    }
  } catch (error) {
    console.error("❌ [Gemini] Parsing failed:", error.message);
    return [{ is_unclear: true }];
  }
}

module.exports = { parseExpenseWithGemini };