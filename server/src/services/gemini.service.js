const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function validateResult(obj) {
  if (!obj) return false;
  if (Array.isArray(obj)) {
    return obj.every(item => validateResult(item));
  }
  if (typeof obj !== "object") return false;
  return typeof obj.amount === 'number' && obj.amount > 0;
}

function fallbackExtraction(transcript) {
  console.log('🔄 [Gemini] Using fallback extraction for:', transcript);
  const amountMatch = transcript.match(/[₹$]?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (amountMatch) {
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    if (amount > 0) {
      let category = 'Other';
      const lowerText = transcript.toLowerCase();
      if (lowerText.includes('food') || lowerText.includes('lunch') || lowerText.includes('dinner') || lowerText.includes('breakfast') || lowerText.includes('restaurant')) category = 'Dining';
      else if (lowerText.includes('grocer') || lowerText.includes('vegetable') || lowerText.includes('fruit')) category = 'Groceries';
      else if (lowerText.includes('uber') || lowerText.includes('cab') || lowerText.includes('taxi') || lowerText.includes('transport') || lowerText.includes('petrol') || lowerText.includes('fuel')) category = 'Transport';
      else if (lowerText.includes('shop') || lowerText.includes('mall') || lowerText.includes('amazon')) category = 'Shopping';
      else if (lowerText.includes('movie') || lowerText.includes('netflix') || lowerText.includes('spotify') || lowerText.includes('entertainment')) category = 'Entertainment';
      else if (lowerText.includes('coffee') || lowerText.includes('cafe') || lowerText.includes('starbucks')) category = 'Dining';
      else if (lowerText.includes('medicine') || lowerText.includes('hospital') || lowerText.includes('doctor') || lowerText.includes('health')) category = 'Health';

      return [{
        amount,
        category,
        description: transcript.substring(0, 100),
        location: null,
        date: null,
        is_unclear: false
      }];
    }
  }
  return [{ is_unclear: true }];
}

async function parseExpenseWithGemini(transcript) {
  try {
    if (!transcript || typeof transcript !== "string") {
      return [{ is_unclear: true }];
    }

    const cleanTranscript = transcript.replace(/[{}$`]/g, "").trim();
    console.log('🎤 [Gemini] Processing transcript:', cleanTranscript);

    const prompt = `Extract expense from this text and return ONLY valid JSON (no markdown, no code blocks):

"${cleanTranscript}"

Return: {"amount": <number>, "category": "<Groceries|Dining|Transport|Shopping|Utilities|Health|Entertainment|Travel|Education|Work|Personal Care|Fuel|Other>", "description": "<brief description>", "location": null, "date": null, "is_unclear": false}`;

    const maxRetries = 2;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 150,
          }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("🤖 [Gemini Raw Response]:", text);

        let cleanText = text
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .replace(/^\s*[\r\n]/gm, '')
          .trim();

        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanText = jsonMatch[0];
        }

        const parsed = JSON.parse(cleanText);
        console.log('✅ [Gemini] Parsed result:', parsed);

        if (validateResult(parsed)) {
          return Array.isArray(parsed) ? parsed : [parsed];
        }
        throw new Error("Invalid amount in parsed result");
      } catch (err) {
        attempt++;
        console.log(`⚠️ [Gemini] Attempt ${attempt}/${maxRetries} failed:`, err.message);
        if (attempt >= maxRetries) {
          return fallbackExtraction(cleanTranscript);
        }
        await wait(300 * attempt);
      }
    }
  } catch (error) {
    console.error("❌ [Gemini] Parsing failed:", error.message);
    return fallbackExtraction(transcript);
  }
}

module.exports = { parseExpenseWithGemini };