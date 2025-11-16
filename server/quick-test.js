// quick-test.js - Quick manual test
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function quickTest() {
  let cookies = '';
  
  try {
    // 1. Try to Register (in case user doesn't exist)
    console.log('1. Registering test user...');
    try {
      const registerRes = await axios.post(`${API_URL}/auth/register`, {
        email: 'test@example.com',
        password: 'Test1234',
        name: 'Test User',
      }, { withCredentials: true });
      
      cookies = registerRes.headers['set-cookie']?.join('; ') || '';
      console.log('✓ User registered successfully');
    } catch (registerError) {
      if (registerError.response?.status === 409) {
        console.log('✓ User already exists, proceeding to login...');
      } else {
        throw registerError;
      }
    }
    
    // 2. Login
    console.log('\n2. Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'Test1234',
    }, { withCredentials: true });
    
    cookies = loginRes.headers['set-cookie'].join('; ');
    console.log('✓ Logged in successfully');
    
    // 2. Create Expense
    console.log('\n2. Creating expense...');
    try {
      const expenseRes = await axios.post(
        `${API_URL}/expense/voice`,
        { transcript: 'Spent 50 rupees on coffee' },
        {
          withCredentials: true,
          headers: { Cookie: cookies }
        }
      );
      console.log('✓ Expense created:', expenseRes.data);
    } catch (error) {
      console.error('✗ Expense creation failed:');
      console.error('  Status:', error.response?.status);
      console.error('  Error:', error.response?.data);
      console.error('  Message:', error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Check if server is running first
axios.get('http://localhost:5001')
  .then(() => {
    console.log('✓ Server is running\n');
    quickTest();
  })
  .catch(() => {
    console.error('✗ Server is not running. Start it first with: node server.js');
  });
