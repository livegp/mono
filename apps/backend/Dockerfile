# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.3.14-alpine

FROM oven/bun:${BUN_VERSION} AS build
WORKDIR /app

COPY package.json bun.lock bunfig.toml turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile
RUN bunx turbo run build --filter=@mono/backend

FROM oven/bun:${BUN_VERSION} AS runner
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=build --chown=bun:bun /app/apps/backend/dist ./dist

ENV NODE_ENV=production
ENV API_PORT=9001
ENV CORS_ORIGIN=http://localhost:9000

USER bun
EXPOSE 9001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail --silent http://localhost:9001/api/health > /dev/null || exit 1

CMD ["bun", "dist/index.js"]
