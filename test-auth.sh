#!/bin/bash

echo "Testing GradPilot User Authentication"
echo "===================================="

# Test Registration
echo -e "\n1. Testing User Registration..."
curl -X POST http://localhost:8082/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n\n2. Testing User Login..."
curl -X POST http://localhost:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n\nTesting complete!"
