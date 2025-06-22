#!/bin/bash
# Fix Maven wrapper permissions 
# henlo

echo "Making mvnw files executable..."

chmod +x /home/seed/deployment/GradPilot/mvnw
chmod +x /home/seed/deployment/GradPilot/services/chatbot/mvnw
chmod +x /home/seed/deployment/GradPilot/services/login-reg/mvnw
chmod +x /home/seed/deployment/GradPilot/services/recommendation/mvnw

echo "Checking permissions..."
ls -la /home/seed/deployment/GradPilot/mvnw
ls -la /home/seed/deployment/GradPilot/services/chatbot/mvnw
ls -la /home/seed/deployment/GradPilot/services/login-reg/mvnw
ls -la /home/seed/deployment/GradPilot/services/recommendation/mvnw

echo "Done!"
