#  Project Setup Guide

This project supports both **Github Actions-based deployment** and **local development using `docker-compose`**, offering flexibility based on your use case. Below you'll find detailed instructions for both.

---

##  Running with Docker (Production / Deployment)

To run the entire application using Docker, follow these steps:

### 1. Ensure Docker is installed
Install Docker on your system: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

### 2. Build and Run required microsystems
```bash
docker build -t microservice-name .
docker run -p 3000:3000 microservice-name
```

Alternatively, you can use Docker Compose to run the whole application:

```bash
docker-compose up --build
```

🟢 By default, the `docker-compose.yml` file is configured to use the **Docker image-based deployment configuration** (the lower section of the file).

---

##  Running Locally (Development Mode)

If you want to run the project locally (without building full Docker images), some changes are needed:

###  Step-by-step

1. Open `docker-compose.yml`.

2. **Comment out the production configuration block** (usually located **at the bottom** of the file).

3. **Uncomment the development services block** (usually located **at the top** of the file), which directly mounts your local source code.

4. Update ports inside `services/frontend/lib` to avoid any conflict and ensure proper routing.

5. Run:
```bash
docker-compose up --build
```

 **Note**: Make sure ports in `services/frontend/lib` (e.g., `localhost:3000`) are correctly configured to match the exposed ports in the compose file. Conflicts may occur if another service (like Next.js or React) is already using the same port.

---

## 🔐 Secrets & Environment Variables

This project makes use of `.env` files for local development, but **no sensitive credentials are committed** to the repository.

- For **local development**, create your own `.env` file based on `.env.example`.
- For **CI/CD and production**, all secrets (such as API keys, tokens, database URLs) are securely stored in **GitHub Secrets**.

⚠️ Never commit `.env` files containing real credentials.

---

## ⚙️ CI/CD Integration

We use **GitHub Actions** to automate our deployment process. Upon each push to the main branch:

- Docker images are built.
- Images are pushed to the container registry.
- They are then pulled into the production VM.
- Nginx is used as the reverse proxy with domain configuration.

---

## 📄 License

This project is licensed under the **MIT License**. See below:

```
MIT License

Copyright (c) 2025 [Your Name]

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

