# syntax=docker/dockerfile:1

# Build arguments - Global scope for all stages
ARG BUN_VERSION=1.3.5-alpine # see all versions at https://hub.docker.com/r/oven/bun/tags
ARG PORT=3000
ARG USER_ID=1001
ARG GROUP_ID=1001
ARG PROJECT

# ============================================================================
# STAGE 1: BASE - Common foundation for all stages
# ============================================================================
FROM oven/bun:${BUN_VERSION} AS base

# Metadata labels
LABEL app.name="${PROJECT}"
LABEL version="1.0.0"
LABEL security.non-root="true"

# Install dependencies and clean cache
RUN apk update && \
    apk add --no-cache curl

# ============================================================================
# STAGE 2: PRUNE - Create minimal workspace using Turbo
# ============================================================================
FROM base AS prune
WORKDIR /app
RUN bun add -g turbo
COPY . .
RUN turbo prune @mono/${PROJECT} --docker

# ============================================================================
# STAGE 3: INSTALLER - Install dependencies and build
# ============================================================================
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/bun-lock.json ./bun.lock
RUN bun install --frozen-lockfile

# Build the project
COPY --from=prune /app/out/full/ .
RUN turbo run build --filter=@mono/${PROJECT}

# ============================================================================
# STAGE 4: RUNNER - Final production image
# ============================================================================
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup -g ${GROUP_ID} -S ${PROJECT}group && \
    adduser -u ${USER_ID} -S ${PROJECT}user -G ${PROJECT}group \
    -h /app -s /sbin/nologin

# Copy built application for production serving
COPY --from=installer --chown=${PROJECT}user:${PROJECT}group /app/apps/${PROJECT}/dist ./dist
COPY --from=installer --chown=${PROJECT}user:${PROJECT}group /app/apps/${PROJECT}/package.json ./package.json
COPY --from=installer --chown=${PROJECT}user:${PROJECT}group /app/node_modules ./node_modules

# Set secure permissions
RUN find /app -type d -exec chmod 755 {} + && \
    find /app -type f -exec chmod 644 {} + && \
    chmod 444 /app/package.json

USER ${PROJECT}user
EXPOSE ${PORT}

ENV NODE_ENV=production
ENV PORT=${PORT}

# Health check for production server
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || \
        curl -f http://localhost:${PORT}/ || \
        exit 1

# Start production server
CMD ["bun", "run", "start"]

