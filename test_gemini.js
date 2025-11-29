require('dotenv').config({ path: 'server/.env' });
const { parseExpenseWithGemini } = require('./server/src/services/gemini.service');

async function test() {
    const transcript = "Spent 250 on coffee";
    console.log(`Testing transcript: "${transcript}"`);
    try {
        const result = await parseExpenseWithGemini(transcript);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
