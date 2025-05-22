# Step 1: Use official Node.js image for building
FROM node:18.18.0 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Use a lighter image for running the app
FROM node:18.18.0-slim

WORKDIR /app

# Copy built app and necessary files from builder stage
COPY --from=builder /app ./

# Set environment variables (optional)
ENV NODE_ENV=production

# Expose port (default for Next.js)
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
