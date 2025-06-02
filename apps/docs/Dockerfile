# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Docs Application with Turbo Prune

# Build arguments
ARG BUN_VERSION=alpine
ARG NODE_ENV=production
ARG PORT=6006
ARG USER_ID=1001
ARG GROUP_ID=1001

# Base stage
FROM oven/bun:${BUN_VERSION} AS base

# Metadata labels
LABEL org.opencontainers.image.title="Docs Application"
LABEL org.opencontainers.image.description="Storybook documentation application for UI components"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="Development Team"
LABEL org.opencontainers.image.vendor="Your Organization"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.url="https://github.com/your-org/your-repo"
LABEL org.opencontainers.image.source="https://github.com/your-org/your-repo"
LABEL org.opencontainers.image.documentation="https://github.com/your-org/your-repo#readme"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.revision="${GIT_COMMIT}"
LABEL maintainer="your-email@example.com"
LABEL security.non-root="true"
LABEL security.user="docsuser"
LABEL security.group="docsgroup"
LABEL security.scan-policy="required"
LABEL app.name="docs"
LABEL app.component="documentation"
LABEL app.part-of="monorepo"
LABEL app.version="1.0.0"
LABEL app.environment="${NODE_ENV}"

# Install turbo globally
RUN bun add -g turbo
WORKDIR /app

# Prune stage - creates minimal workspace
FROM base AS pruner
COPY . .
RUN turbo prune @mono/docs --docker

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

# Production stage
# Build stage
FROM base AS builder
COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules
RUN turbo build --filter=@mono/docs

FROM base AS production

RUN apk add --no-cache --virtual .build-deps curl && \
    apk add --no-cache curl && \
    apk del .build-deps

RUN addgroup -g ${GROUP_ID} -S docsgroup && \
    adduser -u ${USER_ID} -S docsuser -G docsgroup \
    -h /app -s /sbin/nologin

# Copy built application and dependencies
COPY --from=builder /app/apps/docs/storybook-static ./storybook-static
COPY --from=builder /app/apps/docs/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Set working directory to app root
WORKDIR /app

# Set secure permissions
RUN chown -R docsuser:docsgroup /app && \
    chmod -R 755 /app && \
    chmod -R 644 /app/node_modules && \
    find /app -type d -exec chmod 755 {} \; && \
    find /app -type f -exec chmod 644 {} \; && \
    chmod 444 /app/package.json

USER docsuser
EXPOSE ${PORT}

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

CMD if [ "$NODE_ENV" = "development" ]; then \
        bun run dev; \
    else \
        bun run preview; \
    fi
