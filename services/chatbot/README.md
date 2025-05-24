docker build -t gradpilot-chatbot .
docker run -p 8081:8081 --env-file ../../.env gradpilot-chatbot

./mvnw clean install -DskipTests
