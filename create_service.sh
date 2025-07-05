#!/bin/bash

# Define the base directory for the new service
SERVICE_DIR="services/sop-review-service"
BASE_PACKAGE_PATH="src/main/java/com/gradpilot/sopreview"

# Create the main service directory
echo "Creating service directory: $SERVICE_DIR"
mkdir -p "$SERVICE_DIR"

# Create the nested package structure
echo "Creating package structure..."
mkdir -p "$SERVICE_DIR/$BASE_PACKAGE_PATH/controller"
mkdir -p "$SERVICE_DIR/$BASE_PACKAGE_PATH/dto"
mkdir -p "$SERVICE_DIR/$BASE_PACKAGE_PATH/service"

# Create the resources directory
mkdir -p "$SERVICE_DIR/src/main/resources"

# Create the files
echo "Creating files..."
touch "$SERVICE_DIR/pom.xml"
touch "$SERVICE_DIR/Dockerfile"
touch "$SERVICE_DIR/src/main/resources/application.properties"
touch "$SERVICE_DIR/$BASE_PACKAGE_PATH/SopReviewApplication.java"
touch "$SERVICE_DIR/$BASE_PACKAGE_PATH/controller/SopReviewController.java"
touch "$SERVICE_DIR/$BASE_PACKAGE_PATH/dto/ReviewRequest.java"
touch "$SERVICE_DIR/$BASE_PACKAGE_PATH/dto/ReviewResponse.java"
touch "$SERVICE_DIR/$BASE_PACKAGE_PATH/service/SopReviewService.java"

echo "✅ Done. The file and folder structure for '$SERVICE_DIR' has been created."