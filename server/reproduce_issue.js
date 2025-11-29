require('dotenv').config();
const { parseExpenseWithGemini } = require('./src/services/gemini.service');

async function test() {
    const transcript = "50";
    console.log("Testing with transcript:", transcript);
    try {
        const result = await parseExpenseWithGemini(transcript);
        console.log("Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
