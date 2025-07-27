# Project Setup Guide

This project supports both **GitHub Actions-based deployment** and **local development using `docker-compose`**, offering flexibility based on your use case.

---

##  Prerequisites

Before running the application, ensure the following tools are installed:

- **[Docker](https://docs.docker.com/get-docker/)** (tested with Docker version 24+)
- **[Docker Compose](https://docs.docker.com/compose/install/)** (v2+ recommended)
- (Optional) **Git** and a GitHub account (for contributing or deployment)

To verify:

```bash
docker --version
docker compose --version
```

---

## Deploying  to the vm

In production, the application is deployed automatically using **GitHub Actions**.

### 1. GitHub Actions-based Deployment

When you push code to the `main` branch using:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

→ The GitHub Actions pipeline is triggered, which:

- Builds Docker images for each microservice
- Pushes them to the container registry
- Connects to the VM via SSH
- Pulls the latest images
- Deploys the application behind an Nginx reverse proxy (domain configured via Namecheap)

🟢 **By default**, the `docker-compose.yml` file is configured to use this **Docker image-based deployment setup** (usually at the bottom of the file).

---

##  Running Locally (Development Mode)

If you want to run and test the project locally without triggering CI or deploying, follow these steps:

### 🔧 Step-by-step instructions

1. Open the `docker-compose.yml` file.

2. **Comment out the production services block** (usually at the bottom).

3. **Uncomment the development services block** (usually at the top), which mounts your local source code directly for live development.

4. In `services/frontend/lib`, ensure the **port configuration** matches the exposed ports in `docker-compose.yml`. Avoid conflicts with other apps (e.g., Next.js on port 3000).

### 5. (Optional) Build and Run microservices individually

To test a microservice in isolation:

```bash
docker build -t microservice-name .
docker run -p 3000:3000 microservice-name
```

### 6. Run the full application locally using Docker Compose

```bash
docker-compose up --build
```

 **Note**: Be careful of port conflicts. Adjust ports in both `docker-compose.yml` and your application files as needed.

---

## 🔐 Secrets & Environment Variables

This project uses `.env` files for local development, but no sensitive information is committed.

- Use `.env.example` as a template to create your own `.env` file.
```
# Gemini API
GEMINI_API_KEY=

# PostgreSQL DB
DB_URL=
DB_USERNAME=
DB_PASSWORD=

# JWT Secret
JWT_SECRET=

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# SSLCommerz Sandbox Configuration
STORE_ID=
STORE_PASSWORD=

# SSLCommerz Endpoints
SSLCOMMERZ_INIT_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSLCOMMERZ_VALIDATION_URL=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

# SSLCommerz Callback URLs
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_SUCCESS_URL=
SSLCOMMERZ_FAIL_URL=
SSLCOMMERZ_CANCEL_URL=
SSLCOMMERZ_IPN_URL=

# Frontend
FRONTEND_URL=

# Base URL for local/standalone SSL server (if any)
BASE_URL=
```
- **Do not commit** `.env` files with actual credentials.
- For production and CI/CD, all secrets are stored in **GitHub Secrets** and injected into workflows securely.

---

## 🚀 CI/CD with GitHub Actions

The CI/CD pipeline automates everything on `push` to the `main` branch:

- Docker images are built and pushed
- VM pulls the latest images
- Nginx serves the updated deployment
- Domain and SSL handled via Namecheap + Nginx

---

## 📄 License

This project is licensed under the **MIT License**:

```
MIT License

Copyright (c) 2025 [Souvik Mondal, Ananya Shahrin Promi, Wahid Al Azad Navid]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

---
