# Multi-stage build
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY --from=builder /app/target/forum-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085
ENTRYPOINT ["java","-jar","app.jar"]
