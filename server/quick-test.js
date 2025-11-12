// quick-test.js - Quick manual test
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function quickTest() {
  try {
    // 1. Register/Login
    console.log('1. Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'Test1234',
    }, { withCredentials: true });
    
    const cookies = loginRes.headers['set-cookie'].join('; ');
    console.log('✓ Logged in successfully');
    
    // 2. Create Expense
    console.log('\n2. Creating expense...');
    try {
      const expenseRes = await axios.post(
        `${API_URL}/expenses`,
        { text: 'Spent 50 rupees on coffee' },
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
