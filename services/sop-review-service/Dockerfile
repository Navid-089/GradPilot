# # Use a base image with Java and Maven
# FROM maven:3.8.5-openjdk-17 AS build

# # Set the working directory
# WORKDIR /app

# # Copy the POM file and download dependencies
# COPY pom.xml .
# RUN mvn dependency:go-offline

# # Copy the rest of the source code
# COPY src ./src

# # Build the application
# RUN mvn clean install -DskipTests

# # Use a smaller base image for the final application
# FROM openjdk:17-jdk-slim

# # Set the working directory
# WORKDIR /app

# # Copy the JAR file from the build stage
# COPY --from=build /app/target/sop-review-service-0.0.1-SNAPSHOT.jar .

# # Expose the port the application runs on
# EXPOSE 8084

# # Run the application
# ENTRYPOINT ["java", "-jar", "sop-review-service-0.0.1-SNAPSHOT.jar"]


# Multi-stage build
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY --from=builder /app/target/sop-review-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8084
ENTRYPOINT ["java","-jar","app.jar"]
