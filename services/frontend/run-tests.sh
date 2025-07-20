#!/bin/bash

echo "🧪 Running Frontend Unit Tests for GradPilot"
echo "=============================================="

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run different test scenarios
echo ""
echo "🏃 Running all tests..."
npm test

echo ""
echo "📊 Running tests with coverage..."
npm run test:coverage

echo ""
echo "🔄 Running tests in watch mode (for development)..."
echo "Press Ctrl+C to stop watch mode"
npm run test:watch

echo ""
echo "✅ Testing complete!"
echo ""
echo "📝 Test Coverage Summary:"
echo "- Services: Auth, Chatbot, Profile, Utils"
echo "- Components: ThemeToggle, ChatbotDialog"
echo "- Utilities: Test helpers and mocks"
echo ""
echo "🎯 Mocking Examples Demonstrated:"
echo "- External API calls (fetch)"
echo "- localStorage operations"
echo "- React hooks and context"
echo "- Error scenarios and edge cases"
echo "- Authentication states"
echo "- Network failures"
echo "- Integration testing"
