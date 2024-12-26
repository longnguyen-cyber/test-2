# --- Stage: Builder ---
FROM node:20.18-alpine3.21 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -f --omit=dev

# Copy source code
COPY . .
COPY .env .env


# Build the NestJS application
RUN npm run build

# --- Stage: Runner ---
FROM node:20.18-alpine3.21 AS runner

# Set working directory
WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./


RUN npm install -f --omit=dev


# Expose the port your NestJS app runs on
EXPOSE 3001

# Command to run your NestJS app
CMD ["node", "dist/main"]