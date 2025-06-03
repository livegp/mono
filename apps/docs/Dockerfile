# syntax=docker/dockerfile:1

# ============================================================================
# Multi-stage Dockerfile for Frontend Application with Turbo Prune
# ============================================================================

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags

# Build arguments
ARG BUN_VERSION=1.2.15-alpine
ARG NODE_ENV=production
ARG PORT=6006
ARG USER_ID=1001
ARG GROUP_ID=1001

# ============================================================================
# STAGE 1: BASE - Common foundation for all stages
# ============================================================================
FROM oven/bun:${BUN_VERSION} AS base

# Metadata labels
LABEL org.opencontainers.image.title="Docs Application"
LABEL org.opencontainers.image.version="1.0.0"
LABEL security.non-root="true"
LABEL app.name="docs"

# Install turbo globally
RUN bun add -g turbo
WORKDIR /app

# ============================================================================
# STAGE 2: PRUNER - Create minimal workspace using Turbo
# ============================================================================
FROM base AS pruner
COPY . .
RUN turbo prune @mono/docs --docker

# ============================================================================
# STAGE 3: DEPENDENCIES - Install only required dependencies
# ============================================================================
FROM base AS deps

# Copy only necessary files from pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun-lock.json ./bun.lock

RUN if [ "$NODE_ENV" = "development" ]; then \
        bun install --frozen-lockfile; \
    else \
        bun install --frozen-lockfile --production; \
    fi

# ============================================================================
# STAGE 4: BUILDER - Compile and build the application
# ============================================================================
FROM base AS builder
COPY --from=pruner /app/out/full/ .
RUN turbo run build --filter=@mono/docs

# ============================================================================
# STAGE 5: PRODUCTION - Final optimized runtime image
# ============================================================================
FROM base AS production

# Install curl and create non-root user
RUN apk add --no-cache curl && \
    addgroup -g ${GROUP_ID} -S docsgroup && \
    adduser -u ${USER_ID} -S docsuser -G docsgroup \
    -h /app -s /sbin/nologin

# Copy built application and dependencies with correct ownership
COPY --from=builder --chown=docsuser:docsgroup /app/apps/docs/storybook-static ./storybook-static
COPY --from=builder --chown=docsuser:docsgroup /app/apps/docs/package.json ./package.json
COPY --from=deps --chown=docsuser:docsgroup /app/node_modules ./node_modules

# Set working directory to app root
WORKDIR /app

# Set secure permissions
RUN find /app -type d -exec chmod 755 {} + && \
    find /app -type f -exec chmod 644 {} + && \
    chmod 444 /app/package.json

USER docsuser
EXPOSE ${PORT}

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --retries=2 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

CMD if [ "$NODE_ENV" = "development" ]; then \
        turbo run dev; \
    else \
        turbo run preview; \
    fi
