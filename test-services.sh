#!/bin/bash

echo "=== Testing GradPilot Services ==="
echo "Date: $(date)"
echo

# Check if Docker is running
echo "1. Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running"
    exit 1
else
    echo "✅ Docker is running"
fi

echo

# Check container status
echo "2. Checking container status..."
docker-compose -f /home/seed/deployment/GradPilot/docker-compose.yml ps

echo

# Test service endpoints
echo "3. Testing service endpoints..."

# Test Chatbot Service
echo -n "Chatbot Service (8081): "
if curl -s -f http://57.159.24.58:8081 > /dev/null 2>&1; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Test Auth Service
echo -n "Auth Service (8082): "
if curl -s -f http://57.159.24.58:8082 > /dev/null 2>&1; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Test Recommendation Service
echo -n "Recommendation Service (8083): "
if curl -s -f http://57.159.24.58:8083 > /dev/null 2>&1; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

# Test Frontend Service
echo -n "Frontend Service (3000): "
if curl -s -f http://57.159.24.58:3000 > /dev/null 2>&1; then
    echo "✅ Accessible"
else
    echo "❌ Not accessible"
fi

echo

# Test a sample API endpoint
echo "4. Testing API endpoints..."
echo -n "Auth Login Endpoint: "
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://57.159.24.58:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}' 2>/dev/null)

if [ "$response" = "200" ] || [ "$response" = "400" ] || [ "$response" = "401" ]; then
    echo "✅ Responding (HTTP $response)"
else
    echo "❌ Not responding (HTTP $response)"
fi

echo
echo "=== Test Complete ==="
