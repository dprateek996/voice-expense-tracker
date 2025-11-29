const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
  temperature: 0.2
});

const refineTranscript = async (transcript) => {
  try {
    const prompt = `
      You are an advanced speech correction and analysis AI. Your task is to analyze a raw speech-to-text transcript, correct its errors, and provide structured feedback.

      CRITICAL: The user is in India. Correct common errors like "2004 burger" to "200 for burger".

      Return ONLY a valid JSON object with the following schema:
      {
        "corrected": string, // The most likely corrected version of the transcript.
        "confidence": number, // Your confidence in the correction, from 0.0 to 1.0.
        "alternatives": string[], // Up to two other plausible interpretations of the transcript.
        "ambiguous_words": string[] // Any specific words you found difficult to interpret.
      }

      Example:
      Transcript: "i spent 404 a burger yesterday"
      Output:
      {
        "corrected": "I spent 400 for a burger yesterday",
        "confidence": 0.9,
        "alternatives": ["I spent 40 for a burger yesterday"],
        "ambiguous_words": ["404"]
      }

      ---
      Transcript to analyze: "${transcript}"
      ---
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (err) {
    console.error("Refinement AI error:", err);
    // Provide a safe fallback if the AI fails
    return {
      corrected: transcript,
      confidence: 0.5,
      alternatives: [],
      ambiguous_words: [],
    };
  }
};

module.exports = { refineTranscript };