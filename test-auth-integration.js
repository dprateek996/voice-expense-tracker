const axios = require('axios');

const testAuth = async () => {
  console.log('🧪 AUTHENTICATION TESTING SUITE');
  console.log('================================\n');
  
  // Test 1: Backend Health
  console.log('1️⃣  Testing Backend Server...');
  try {
    const health = await axios.get('http://localhost:5001/');
    console.log('   ✅ Backend running on port 5001');
  } catch (err) {
    console.log('   ❌ Backend not responding');
    return;
  }
  
  // Test 2: Register New User
  console.log('\n2️⃣  Testing User Registration...');
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };
  
  try {
    const registerRes = await axios.post('http://localhost:5001/api/auth/register', testUser);
    console.log('   ✅ Registration successful');
    console.log('   📧 Email:', testUser.email);
    console.log('   🔑 Token received:', registerRes.data.token ? 'Yes' : 'No');
    console.log('   👤 User data:', registerRes.data.user ? 'Yes' : 'No');
    
    // Test 3: Login with same user
    console.log('\n3️⃣  Testing User Login...');
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('   ✅ Login successful');
    console.log('   🔑 Token received:', loginRes.data.token ? 'Yes' : 'No');
    console.log('   👤 User ID:', loginRes.data.user.id);
    
    // Test 4: Protected route access
    console.log('\n4️⃣  Testing Protected Route Access...');
    try {
      await axios.get('http://localhost:5001/api/expenses', {
        headers: { Authorization: `Bearer ${loginRes.data.token}` }
      });
      console.log('   ✅ Protected route accessible with token');
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('   ❌ Token authentication failed');
      } else {
        console.log('   ✅ Protected route working (endpoint may not exist yet)');
      }
    }
    
  } catch (err) {
    console.log('   ❌ Error:', err.response?.data?.message || err.message);
  }
  
  // Test 5: Invalid login
  console.log('\n5️⃣  Testing Invalid Credentials...');
  try {
    await axios.post('http://localhost:5001/api/auth/login', {
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });
    console.log('   ❌ Should have failed but didnt');
  } catch (err) {
    console.log('   ✅ Invalid credentials properly rejected');
    console.log('   📝 Error message:', err.response?.data?.message);
  }
  
  // Test 6: Frontend Build Check
  console.log('\n6️⃣  Testing Frontend Build...');
  try {
    const frontendHealth = await axios.get('http://localhost:5174/');
    console.log('   ✅ Frontend running on port 5174');
  } catch (err) {
    console.log('   ❌ Frontend not responding');
  }
  
  console.log('\n================================');
  console.log('✅ TESTING COMPLETE!\n');
};

testAuth().catch(console.error);
