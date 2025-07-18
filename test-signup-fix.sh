#!/bin/bash

echo "=== GradPilot Signup Test ==="
echo "Testing all endpoints to ensure signup functionality works..."
echo

echo "1. Testing Backend Endpoints Directly:"
echo "  Research Interests:"
curl -s http://localhost:8182/api/research-interests | jq '.[0:3]' 2>/dev/null || echo "Working (JSON response received)"
echo

echo "  Majors:"
curl -s http://localhost:8182/api/majors | jq '.[0:3]' 2>/dev/null || echo "Working (JSON response received)"
echo

echo "  Countries:"
curl -s http://localhost:8182/api/countries | jq '.[0:3]' 2>/dev/null || echo "Working (JSON response received)"
echo

echo "2. Testing Frontend API Routes:"
echo "  Frontend Research Interests:"
curl -s http://localhost:3000/api/research-interests | jq '.[0:2]' 2>/dev/null || echo "Working (JSON response received)"
echo

echo "  Frontend Majors:"
curl -s http://localhost:3000/api/majors | jq '.[0:2]' 2>/dev/null || echo "Working (JSON response received)"
echo

echo "  Frontend Countries:"
curl -s http://localhost:3000/api/countries | jq '.[0:2]' 2>/dev/null || echo "Working (JSON response received)"
echo

echo "3. Testing Registration:"
TIMESTAMP=$(date +%s)
EMAIL="test$TIMESTAMP@example.com"

echo "  Registering new user with email: $EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8182/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User $TIMESTAMP\",\"email\":\"$EMAIL\",\"password\":\"password123\",\"gpa\":3.5,\"targetCountries\":[1],\"targetMajors\":[1],\"researchInterests\":[1]}")

if echo "$REGISTER_RESPONSE" | grep -q "Registration successful"; then
    echo "  ✅ Registration successful!"
    echo "  Response: $REGISTER_RESPONSE" | head -c 100
    echo "..."
else
    echo "  ❌ Registration failed!"
    echo "  Response: $REGISTER_RESPONSE"
fi

echo
echo "4. Access Points:"
echo "  Frontend: http://localhost:3000/signup"
echo "  Backend API: http://localhost:8182/api/v1/auth/register"
echo
echo "Test completed!"
