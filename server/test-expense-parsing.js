require('dotenv').config();
const { parseExpenseWithGemini } = require('./src/services/gemini.service');

async function testParsing() {
  console.log('🧪 Testing Gemini Expense Parsing...\n');
  
  const testCases = [
    '500 for groceries',
    '200 for cab ride',
    '150 for lunch at restaurant',
    '1000 for fuel'
  ];
  
  for (const transcript of testCases) {
    console.log(`📝 Testing: "${transcript}"`);
    try {
      const result = await parseExpenseWithGemini(transcript);
      console.log('✅ Result:', JSON.stringify(result, null, 2));
      
      if (result[0].is_unclear) {
        console.log('❌ FAILED: Marked as unclear\n');
      } else if (!result[0].amount || result[0].amount <= 0) {
        console.log('❌ FAILED: No valid amount\n');
      } else {
        console.log('✅ SUCCESS: Parsed correctly\n');
      }
    } catch (error) {
      console.log('❌ ERROR:', error.message, '\n');
    }
  }
}

testParsing().catch(console.error);
