# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Frontend Application with Turbo Prune

# Build arguments
ARG BUN_VERSION=1.0.25-alpine
ARG NODE_ENV=production
ARG PORT=4173
ARG USER_ID=1001
ARG GROUP_ID=1001

# Base stage
FROM oven/bun:${BUN_VERSION} AS base

# Metadata labels
LABEL org.opencontainers.image.title="Frontend Application"
LABEL org.opencontainers.image.version="1.0.0"
LABEL security.non-root="true"
LABEL app.name="frontend"

# Install turbo globally
RUN bun add -g turbo
WORKDIR /app

# Prune stage - creates minimal workspace
FROM base AS pruner
COPY . .
RUN turbo prune @mono/frontend --docker

# Dependencies stage
FROM base AS deps

# Copy only necessary files from pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun-lock.json ./bun.lock

RUN if [ "$NODE_ENV" = "development" ]; then \
        bun install --frozen-lockfile; \
    else \
        bun install --frozen-lockfile --production; \
    fi

# Build stage
FROM base AS builder
COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules
RUN turbo build --filter=@mono/frontend

# Production stage
FROM base AS production

# Install curl and create non-root user
RUN apk add --no-cache curl && \
    addgroup -g ${GROUP_ID} -S frontendgroup && \
    adduser -u ${USER_ID} -S frontenduser -G frontendgroup \
    -h /app -s /sbin/nologin

# Copy built application and dependencies
COPY --from=builder /app/apps/frontend/dist ./dist
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Set working directory to app root
WORKDIR /app

# Set secure permissions
RUN chown -R frontenduser:frontendgroup /app && \
    find /app -type d -exec chmod 755 {} + && \
    find /app -type f -exec chmod 644 {} + && \
    chmod 444 /app/package.json

USER frontenduser
EXPOSE ${PORT}

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --retries=2 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

CMD if [ "$NODE_ENV" = "development" ]; then \
        bun run dev; \
    else \
        bun run preview; \
    fi
