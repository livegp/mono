# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Backend API Service with Turbo Prune

# Build arguments
ARG BUN_VERSION=1.0.25-alpine
ARG NODE_ENV=production
ARG PORT=3000
ARG USER_ID=1001
ARG GROUP_ID=1001

# Base stage
FROM oven/bun:${BUN_VERSION} AS base

# Metadata labels
LABEL org.opencontainers.image.title="Backend API Service"
LABEL org.opencontainers.image.version="1.0.0"
LABEL security.non-root="true"
LABEL app.name="backend"

# Install turbo globally
RUN bun add -g turbo
WORKDIR /app

# Prune stage - creates minimal workspace
FROM base AS pruner
COPY . .
RUN turbo prune @mono/backend --docker

# Dependencies stage
FROM base AS deps

# Copy only necessary files from pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun-lock.json ./bun.lock

# Install dependencies based on NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then \
        bun install --frozen-lockfile; \
    else \
        bun install --frozen-lockfile --production; \
    fi

# Build stage
FROM base AS builder
COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules
RUN turbo build --filter=@mono/backend

# Production stage
FROM base AS production

# Install curl and create non-root user with minimal privileges
RUN apk add --no-cache curl && \
    addgroup -g ${GROUP_ID} -S backendgroup && \
    adduser -u ${USER_ID} -S backenduser -G backendgroup \
    -h /app -s /sbin/nologin

# Copy built application and dependencies
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Set working directory to app root
WORKDIR /app

# Set secure file permissions
RUN chown -R backenduser:backendgroup /app && \
    find /app -type d -exec chmod 755 {} + && \
    find /app -type f -exec chmod 644 {} + && \
    chmod 444 /app/package.json

USER backenduser
EXPOSE ${PORT}

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

# Health check
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --retries=2 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Dynamic command based on environment
CMD if [ "$NODE_ENV" = "development" ]; then \
        bun run dev; \
    else \
        bun run preview; \
    fi

