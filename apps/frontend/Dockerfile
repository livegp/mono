# syntax=docker/dockerfile:1

# Build arguments
ARG BUN_VERSION=alpine
ARG NODE_ENV=production
ARG PORT=3000
ARG USER_ID=1001
ARG GROUP_ID=1001

# Base stage
FROM oven/bun:${BUN_VERSION} AS base

# Metadata labels
LABEL org.opencontainers.image.title="Frontend Application"
LABEL org.opencontainers.image.description="React-based frontend application with Vite"
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
LABEL security.user="frontenduser"
LABEL security.group="frontendgroup"
LABEL security.scan-policy="required"
LABEL app.name="frontend"
LABEL app.component="web-ui"
LABEL app.part-of="monorepo"
LABEL app.version="1.0.0"
LABEL app.environment="${NODE_ENV}"

WORKDIR /app

# Dependencies stage
FROM base AS deps

COPY ../../package.json ../../bun.lock* ./
COPY ../../packages/*/package.json ./packages/
COPY package.json ./apps/frontend/

RUN if [ "$NODE_ENV" = "development" ]; then \
        bun install --frozen-lockfile; \
    else \
        bun install --frozen-lockfile --production; \
    fi

# Production stage
FROM base AS production

RUN apk add --no-cache --virtual .build-deps curl && \
    apk add --no-cache curl && \
    apk del .build-deps

RUN addgroup -g ${GROUP_ID} -S frontendgroup && \
    adduser -u ${USER_ID} -S frontenduser -G frontendgroup \
    -h /app -s /sbin/nologin

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --chown=frontenduser:frontendgroup . ./apps/frontend
WORKDIR /app/apps/frontend

# Build for production
RUN if [ "$NODE_ENV" = "production" ]; then \
        bun run build; \
    fi

# Set secure permissions
RUN chown -R frontenduser:frontendgroup /app && \
    chmod -R 755 /app && \
    chmod -R 644 /app/node_modules && \
    find /app -type d -exec chmod 755 {} \; && \
    find /app -type f -exec chmod 644 {} \; && \
    chmod 444 /app/apps/frontend/package.json && \
    if [ -f "/app/apps/frontend/vite.config.ts" ]; then \
        chmod 444 /app/apps/frontend/vite.config.ts; \
    fi

USER frontenduser
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
