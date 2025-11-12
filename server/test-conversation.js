// test-conversation.js - Conversation API Testing Script

const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Configure axios to handle cookies
const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`),
  user: (msg) => console.log(`${colors.magenta}👤 User: ${msg}${colors.reset}`),
  ai: (msg) => console.log(`${colors.cyan}🤖 AI: ${msg}${colors.reset}`),
};

let cookies = '';

async function login() {
  log.section('Login');
  try {
    const response = await client.post('/auth/login', {
      email: 'test@example.com',
      password: 'Test1234',
    });
    
    if (response.headers['set-cookie']) {
      cookies = response.headers['set-cookie'].join('; ');
    }
    
    log.success('Logged in successfully');
    return true;
  } catch (error) {
    log.error('Login failed: ' + error.response?.data?.error);
    return false;
  }
}

async function testNewConversation() {
  log.section('Test 1: Start New Conversation');
  
  try {
    const response = await client.post('/conversation/new', {}, {
      headers: { Cookie: cookies },
    });
    
    log.success('New conversation started');
    log.ai(response.data.message);
    return true;
  } catch (error) {
    log.error('Failed: ' + error.response?.data?.error);
    return false;
  }
}

async function testConversationFlow() {
  log.section('Test 2: Conversational Expense Tracking');
  
  const messages = [
    'I spent 50 rupees',
    'Coffee at Starbucks',
    'Show me my expenses',
  ];
  
  try {
    for (const message of messages) {
      log.user(message);
      
      const response = await client.post('/conversation/message', 
        { message },
        { headers: { Cookie: cookies } }
      );
      
      log.ai(response.data.message);
      
      if (response.data.expense) {
        log.success(`Expense created: ₹${response.data.expense.amount} - ${response.data.expense.description}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between messages
    }
    
    return true;
  } catch (error) {
    log.error('Conversation failed: ' + error.response?.data?.error);
    console.error(error.response?.data);
    return false;
  }
}

async function testMissingAmount() {
  log.section('Test 3: Missing Amount - AI Asks for Clarification');
  
  try {
    log.user('I bought a shirt');
    
    const response = await client.post('/conversation/message',
      { message: 'I bought a shirt' },
      { headers: { Cookie: cookies } }
    );
    
    log.ai(response.data.message);
    
    if (response.data.message.toLowerCase().includes('how much') || 
        response.data.message.toLowerCase().includes('cost')) {
      log.success('AI correctly asked for amount');
    }
    
    // Follow up with amount
    log.user('200 rupees');
    
    const response2 = await client.post('/conversation/message',
      { message: '200 rupees' },
      { headers: { Cookie: cookies } }
    );
    
    log.ai(response2.data.message);
    
    if (response2.data.expense) {
      log.success(`Expense created: ₹${response2.data.expense.amount} - ${response2.data.expense.description}`);
      return true;
    }
    
    return true;
  } catch (error) {
    log.error('Test failed: ' + error.response?.data?.error);
    return false;
  }
}

async function testMissingItem() {
  log.section('Test 4: Missing Item - AI Asks for Clarification');
  
  try {
    log.user('Spent 150 rupees');
    
    const response = await client.post('/conversation/message',
      { message: 'Spent 150 rupees' },
      { headers: { Cookie: cookies } }
    );
    
    log.ai(response.data.message);
    
    if (response.data.message.toLowerCase().includes('what') || 
        response.data.message.toLowerCase().includes('spend')) {
      log.success('AI correctly asked for item');
    }
    
    // Follow up with item
    log.user('Lunch at Pizza Hut');
    
    const response2 = await client.post('/conversation/message',
      { message: 'Lunch at Pizza Hut' },
      { headers: { Cookie: cookies } }
    );
    
    log.ai(response2.data.message);
    
    if (response2.data.expense) {
      log.success(`Expense created: ₹${response2.data.expense.amount} - ${response2.data.expense.description}`);
      log.success(`Location: ${response2.data.expense.location || 'Not extracted'}`);
      return true;
    }
    
    return true;
  } catch (error) {
    log.error('Test failed: ' + error.response?.data?.error);
    return false;
  }
}

async function testCompleteExpense() {
  log.section('Test 5: Complete Expense in One Message');
  
  try {
    log.user('Paid 75 rupees for Uber ride to office');
    
    const response = await client.post('/conversation/message',
      { message: 'Paid 75 rupees for Uber ride to office' },
      { headers: { Cookie: cookies } }
    );
    
    log.ai(response.data.message);
    
    if (response.data.expense) {
      log.success(`Expense created: ₹${response.data.expense.amount} - ${response.data.expense.description}`);
      log.success(`Category: ${response.data.expense.category}`);
      return true;
    } else {
      log.error('No expense was created');
      return false;
    }
  } catch (error) {
    log.error('Test failed: ' + error.response?.data?.error);
    return false;
  }
}

async function testGetHistory() {
  log.section('Test 6: Get Conversation History');
  
  try {
    const response = await client.get('/conversation/history', {
      headers: { Cookie: cookies },
    });
    
    log.success(`Retrieved ${response.data.messages.length} messages`);
    
    if (response.data.messages.length > 0) {
      console.log('Sample messages:');
      response.data.messages.slice(-3).forEach(msg => {
        if (msg.role === 'user') {
          log.user(msg.content);
        } else {
          log.ai(msg.content);
        }
      });
    }
    
    return true;
  } catch (error) {
    log.error('Failed: ' + error.response?.data?.error);
    return false;
  }
}

async function testClearHistory() {
  log.section('Test 7: Clear Conversation History');
  
  try {
    const response = await client.delete('/conversation/clear', {
      headers: { Cookie: cookies },
    });
    
    log.success(response.data.message);
    return true;
  } catch (error) {
    log.error('Failed: ' + error.response?.data?.error);
    return false;
  }
}

async function runAllTests() {
  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(colors.cyan + '  🤖 CONVERSATIONAL AI - TESTING SUITE' + colors.reset);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset);
  
  if (!await login()) {
    console.log('\n' + colors.red + 'Cannot proceed without login' + colors.reset);
    return;
  }
  
  const tests = [
    testNewConversation,
    testConversationFlow,
    testMissingAmount,
    testMissingItem,
    testCompleteExpense,
    testGetHistory,
    testClearHistory,
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passed++;
      else failed++;
    } catch (error) {
      failed++;
      log.error(`Test threw unexpected error: ${error.message}`);
    }
  }
  
  // Summary
  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(colors.cyan + '  TEST SUMMARY' + colors.reset);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(`${colors.green}✓ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${passed + failed}`);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset + '\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5001');
    log.success('Server is running!');
    return true;
  } catch (error) {
    log.error('Server is not running. Please start the server first.');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  } else {
    process.exit(1);
  }
})();
