# Multi-stage build
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Use a base image with both Java and Python
FROM openjdk:17-slim

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the Java application
COPY --from=builder /app/target/recommendation-service-0.0.1-SNAPSHOT.jar app.jar

# Create ML directory and copy Python files
RUN mkdir -p /app/ml
COPY ml/ml_predict.py /app/ml/
COPY ml/requirements.txt /app/ml/

# Install Python dependencies
WORKDIR /app/ml
RUN pip3 install -r requirements.txt

# Create models directory and copy ML files
RUN mkdir -p /app/ml/models
COPY ml/models/improved_university_recommender.pkl /app/ml/models/
COPY ml/models/gradPilot_train.csv /app/ml/models/
COPY ml/models/Synthetic_Admission_Dataset.csv /app/ml/models/

WORKDIR /app

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"] 