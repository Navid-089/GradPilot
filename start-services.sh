#!/bin/bash

echo "Starting GradPilot Services..."

# Navigate to project directory
cd /home/seed/deployment/GradPilot

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down

# Build and start services
echo "Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 60

# Check status
echo "Checking service status..."
docker-compose ps

echo "Services started. You can access them at:"
echo "- Chatbot: http://57.159.24.58:8081"
echo "- Auth: http://57.159.24.58:8082"
echo "- Recommendation: http://57.159.24.58:8083"
echo "- Frontend: http://57.159.24.58:3000"
