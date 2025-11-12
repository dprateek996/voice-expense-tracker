// test-auth.js - Authentication API Testing Script

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

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'Test1234',
  name: 'Test User',
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`),
};

// Store cookies from responses
let cookies = '';

// Test functions
async function testRegister() {
  log.section('Test 1: User Registration');
  
  try {
    log.info('Attempting to register new user...');
    const response = await client.post('/auth/register', testUser);
    
    // Store cookies
    if (response.headers['set-cookie']) {
      cookies = response.headers['set-cookie'].join('; ');
    }
    
    log.success('Registration successful!');
    console.log('User:', response.data.user);
    return true;
  } catch (error) {
    if (error.response?.status === 409) {
      log.info('User already exists (expected if running multiple times)');
      return true;
    }
    log.error('Registration failed: ' + error.response?.data?.error);
    console.error(error.response?.data);
    return false;
  }
}

async function testRegisterValidation() {
  log.section('Test 2: Registration Validation');
  
  // Test 2.1: Missing email
  try {
    log.info('Testing missing email...');
    await client.post('/auth/register', { password: 'Test1234' });
    log.error('Should have failed with missing email');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Correctly rejected missing email');
    }
  }
  
  // Test 2.2: Invalid email format
  try {
    log.info('Testing invalid email format...');
    await client.post('/auth/register', {
      email: 'invalid-email',
      password: 'Test1234',
    });
    log.error('Should have failed with invalid email');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Correctly rejected invalid email format');
    }
  }
  
  // Test 2.3: Weak password (too short)
  try {
    log.info('Testing weak password (too short)...');
    await client.post('/auth/register', {
      email: 'test2@example.com',
      password: 'Test12',
    });
    log.error('Should have failed with weak password');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Correctly rejected weak password');
    }
  }
  
  // Test 2.4: Password without numbers
  try {
    log.info('Testing password without numbers...');
    await client.post('/auth/register', {
      email: 'test3@example.com',
      password: 'TestPassword',
    });
    log.error('Should have failed with password without numbers');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Correctly rejected password without numbers');
    }
  }
  
  return true;
}

async function testLogin() {
  log.section('Test 3: User Login');
  
  try {
    log.info('Attempting to login...');
    const response = await client.post('/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });
    
    // Store cookies
    if (response.headers['set-cookie']) {
      cookies = response.headers['set-cookie'].join('; ');
    }
    
    log.success('Login successful!');
    console.log('User:', response.data.user);
    return true;
  } catch (error) {
    log.error('Login failed: ' + error.response?.data?.error);
    console.error(error.response?.data);
    return false;
  }
}

async function testLoginValidation() {
  log.section('Test 4: Login Validation');
  
  // Test 4.1: Wrong password
  try {
    log.info('Testing wrong password...');
    await client.post('/auth/login', {
      email: testUser.email,
      password: 'WrongPassword123',
    });
    log.error('Should have failed with wrong password');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Correctly rejected wrong password');
    }
  }
  
  // Test 4.2: Non-existent user
  try {
    log.info('Testing non-existent user...');
    await client.post('/auth/login', {
      email: 'nonexistent@example.com',
      password: 'Test1234',
    });
    log.error('Should have failed with non-existent user');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Correctly rejected non-existent user');
    }
  }
  
  return true;
}

async function testGetMe() {
  log.section('Test 5: Get Current User Info');
  
  try {
    log.info('Attempting to get user info...');
    const response = await client.get('/auth/me', {
      headers: { Cookie: cookies },
    });
    
    log.success('Successfully retrieved user info!');
    console.log('User:', response.data.user);
    return true;
  } catch (error) {
    log.error('Get user info failed: ' + error.response?.data?.error);
    console.error(error.response?.data);
    return false;
  }
}

async function testProtectedRouteWithoutAuth() {
  log.section('Test 6: Protected Route Without Auth');
  
  try {
    log.info('Attempting to access protected route without auth...');
    await client.get('/auth/me');
    log.error('Should have failed without authentication');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Correctly rejected unauthenticated request');
      return true;
    }
  }
  return false;
}

async function testExpenseWithAuth() {
  log.section('Test 7: Create Expense (Authenticated)');
  
  try {
    log.info('Attempting to create expense with auth...');
    const response = await client.post(
      '/expenses',
      { text: 'Spent 50 rupees on coffee' },
      { headers: { Cookie: cookies } }
    );
    
    log.success('Successfully created expense!');
    console.log('Expense:', response.data);
    return true;
  } catch (error) {
    log.error('Create expense failed: ' + error.response?.data?.error);
    console.error(error.response?.data);
    return false;
  }
}

async function testExpenseWithoutAuth() {
  log.section('Test 8: Create Expense (Unauthenticated)');
  
  try {
    log.info('Attempting to create expense without auth...');
    await client.post('/expenses', { text: 'Spent 50 rupees on coffee' });
    log.error('Should have failed without authentication');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Correctly rejected unauthenticated expense creation');
      return true;
    }
  }
  return false;
}

async function testGetExpenses() {
  log.section('Test 9: Get User Expenses');
  
  try {
    log.info('Attempting to get expenses...');
    const response = await client.get('/expenses', {
      headers: { Cookie: cookies },
    });
    
    log.success('Successfully retrieved expenses!');
    console.log(`Found ${response.data.length} expense(s)`);
    if (response.data.length > 0) {
      console.log('Sample expense:', response.data[0]);
    }
    return true;
  } catch (error) {
    log.error('Get expenses failed: ' + error.response?.data?.error);
    console.error(error.response?.data);
    return false;
  }
}

async function testLogout() {
  log.section('Test 10: User Logout');
  
  try {
    log.info('Attempting to logout...');
    const response = await client.post('/auth/logout', {}, {
      headers: { Cookie: cookies },
    });
    
    log.success('Logout successful!');
    console.log('Message:', response.data.message);
    
    // Clear stored cookies
    cookies = '';
    return true;
  } catch (error) {
    log.error('Logout failed: ' + error.response?.data?.error);
    console.error(error.response?.data);
    return false;
  }
}

async function testAfterLogout() {
  log.section('Test 11: Access After Logout');
  
  try {
    log.info('Attempting to access protected route after logout...');
    await client.get('/auth/me');
    log.error('Should have failed after logout');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success('Correctly rejected request after logout');
      return true;
    }
  }
  return false;
}

// Run all tests
async function runAllTests() {
  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(colors.cyan + '  🧪 VOICE EXPENSE TRACKER - AUTH TESTING SUITE' + colors.reset);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset);
  
  const tests = [
    testRegister,
    testRegisterValidation,
    testLogin,
    testLoginValidation,
    testGetMe,
    testProtectedRouteWithoutAuth,
    testExpenseWithAuth,
    testExpenseWithoutAuth,
    testGetExpenses,
    testLogout,
    testAfterLogout,
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
    log.info('Run: cd server && npm run start');
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
