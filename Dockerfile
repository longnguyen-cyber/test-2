# --- Stage: Builder ---
FROM node:20.18-alpine3.21 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -f --omit=dev

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Verify installation by listing contents of global path
RUN ls -al ~/.npm-global/bin

# Set PATH environment variable
ENV PATH=$PATH:~/.npm-global/bin

# Copy source code
COPY . .
COPY .env .env


# Build the NestJS application
RUN npx nest build

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