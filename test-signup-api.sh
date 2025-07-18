#!/bin/bash

echo "🚀 GradPilot Signup API Test Runner"
echo "====================================="
echo

# Base URL
BASE_URL="http://localhost:8182/api/v1/auth/register"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASS=0
FAIL=0

# Function to run test
run_test() {
    local test_name="$1"
    local expected_status="$2"
    local request_body="$3"
    
    echo -e "${BLUE}Testing: ${test_name}${NC}"
    
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$request_body" \
        "$BASE_URL")
    
    # Extract status code (last 3 characters)
    status_code="${response: -3}"
    response_body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "  ${GREEN}✅ PASS${NC} - Status: $status_code"
        ((PASS++))
    else
        echo -e "  ${RED}❌ FAIL${NC} - Expected: $expected_status, Got: $status_code"
        echo -e "  Response: ${response_body:0:100}..."
        ((FAIL++))
    fi
    echo
}

# Generate unique email for tests
TIMESTAMP=$(date +%s)
UNIQUE_EMAIL="testuser${TIMESTAMP}@example.com"

echo "🧪 Running test cases..."
echo

# Test 1: Valid minimal registration
run_test "1. Minimal Valid Registration" "201" \
'{
  "name": "Test User",
  "email": "'$UNIQUE_EMAIL'",
  "password": "password123"
}'

# Test 2: Invalid email format
run_test "2. Invalid Email Format" "400" \
'{
  "name": "Invalid User",
  "email": "invalid-email",
  "password": "password123"
}'

# Test 3: Password too short
run_test "3. Password Too Short" "400" \
'{
  "name": "Short Pass",
  "email": "short'$TIMESTAMP'@example.com",
  "password": "123"
}'

# Test 4: Missing required field
run_test "4. Missing Name Field" "400" \
'{
  "email": "missing'$TIMESTAMP'@example.com",
  "password": "password123"
}'

# Test 5: GPA out of range
run_test "5. GPA Out of Range" "400" \
'{
  "name": "High GPA",
  "email": "highgpa'$TIMESTAMP'@example.com",
  "password": "password123",
  "gpa": 5.0
}'

# Test 6: Valid registration with all fields
FULL_EMAIL="full${TIMESTAMP}@example.com"
run_test "6. Full Registration" "201" \
'{
  "name": "Full User",
  "email": "'$FULL_EMAIL'",
  "password": "password123",
  "gpa": 3.75,
  "targetCountries": [1, 2],
  "targetMajors": [1, 2],
  "researchInterests": [1, 2],
  "deadlineYear": 2025
}'

# Test 7: Duplicate email (using the first email again)
run_test "7. Duplicate Email" "400" \
'{
  "name": "Duplicate User",
  "email": "'$UNIQUE_EMAIL'",
  "password": "password123"
}'

# Test 8: Registration with test scores
SCORES_EMAIL="scores${TIMESTAMP}@example.com"
run_test "8. Registration with Test Scores" "201" \
'{
  "name": "Test Scores User",
  "email": "'$SCORES_EMAIL'",
  "password": "password123",
  "gpa": 3.9,
  "testScores": {
    "GRE": "325",
    "IELTS": "8.5",
    "TOEFL": "110"
  },
  "targetCountries": [1],
  "targetMajors": [1],
  "researchInterests": [1]
}'

# Summary
echo "📊 Test Results Summary"
echo "======================="
echo -e "✅ Passed: ${GREEN}$PASS${NC}"
echo -e "❌ Failed: ${RED}$FAIL${NC}"
echo -e "📝 Total:  $((PASS + FAIL))"
echo

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}💥 Some tests failed!${NC}"
    exit 1
fi
