# Multi-stage build
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app
COPY . .
# Fix line endings for Windows-created files
RUN sed -i 's/\r$//' mvnw
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Use Amazon Corretto Java 17 base image
FROM amazoncorretto:17

# Install Python and pip
RUN yum update -y && \
    yum install -y python3 python3-pip && \
    yum clean all

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
COPY ml/models/gradPilot_train.csv /app/ml/
COPY ml/models/Synthetic_Admission_Dataset.csv /app/ml/

WORKDIR /app

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"] 