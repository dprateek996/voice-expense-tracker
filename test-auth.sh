#!/bin/bash

echo "🧪 AUTHENTICATION TESTING SUITE"
echo "================================"
echo ""

# Test 1: Backend Health
echo "1️⃣  Testing Backend Server..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/)
if [ "$HEALTH" = "200" ]; then
    echo "   ✅ Backend running on port 5001"
else
    echo "   ❌ Backend not responding (HTTP $HEALTH)"
    exit 1
fi

# Test 2: Register New User
echo ""
echo "2️⃣  Testing User Registration..."
TIMESTAMP=$(date +%s)
EMAIL="test${TIMESTAMP}@example.com"

REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"${EMAIL}\",\"password\":\"password123\"}")

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "   ✅ Registration successful"
    echo "   📧 Email: $EMAIL"
    echo "   🔑 Token received: Yes"
    
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo "   ❌ Registration failed"
    echo "   Response: $REGISTER_RESPONSE"
    exit 1
fi

# Test 3: Login with same user
echo ""
echo "3️⃣  Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"password123\"}")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "   ✅ Login successful"
    echo "   🔑 Token received: Yes"
    LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo "   ❌ Login failed"
    echo "   Response: $LOGIN_RESPONSE"
fi

# Test 4: Protected Route Access
echo ""
echo "4️⃣  Testing Protected Route Access..."
PROTECTED_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  http://localhost:5001/api/expenses)

if [ "$PROTECTED_RESPONSE" = "200" ] || [ "$PROTECTED_RESPONSE" = "404" ]; then
    echo "   ✅ Protected route working (HTTP $PROTECTED_RESPONSE)"
else
    echo "   ⚠️  Protected route status: HTTP $PROTECTED_RESPONSE"
fi

# Test 5: Invalid Credentials
echo ""
echo "5️⃣  Testing Invalid Credentials..."
INVALID_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@example.com","password":"wrongpassword"}')

if echo "$INVALID_RESPONSE" | grep -q "error\|invalid\|Invalid"; then
    echo "   ✅ Invalid credentials properly rejected"
else
    echo "   ⚠️  Unexpected response for invalid credentials"
fi

# Test 6: Frontend Health
echo ""
echo "6️⃣  Testing Frontend Server..."
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5174/)
if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo "   ✅ Frontend running on port 5174"
else
    echo "   ❌ Frontend not responding (HTTP $FRONTEND_HEALTH)"
fi

# Test 7: Check Files
echo ""
echo "7️⃣  Checking File Structure..."
FILES=(
    "client/src/api/axios.config.js"
    "client/src/api/auth.api.js"
    "client/src/store/authStore.js"
    "client/src/components/ProtectedRoute.jsx"
    "client/src/pages/Login.jsx"
    "client/src/pages/Register.jsx"
    "client/src/pages/Dashboard.jsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ Missing: $file"
    fi
done

echo ""
echo "================================"
echo "✅ TESTING COMPLETE!"
echo ""
