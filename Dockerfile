# --- Stage: Builder ---
FROM node:18.20-alpine3.21 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY tsconfig.json ./

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Install dependencies and build the project, redirecting all output
RUN npm install -f --omit=dev && npm run build

# Check if dist folder exists and list its contents
RUN ls -al /app/

# Copy source code
COPY . .
COPY .env .env

# --- Stage: Runner ---
FROM node:18.20-alpine3.21 AS runner

# Set working directory
WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./

RUN npm install -f --omit=dev

# Expose the port your NestJS app runs on
EXPOSE 3002

# Command to run your NestJS app
CMD ["node", "dist/main"]