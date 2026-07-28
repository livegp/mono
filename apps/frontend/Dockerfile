# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.3.14-alpine

FROM oven/bun:${BUN_VERSION} AS build
WORKDIR /app

COPY package.json bun.lock bunfig.toml turbo.json tsconfig.json biome.jsonc ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile

ARG VITE_WEB_PORT=9000
ARG VITE_WEB_URL=http://localhost:9000
ARG VITE_API_URL=http://localhost:9001
ARG VITE_SITE_INDEXABLE=false
ENV VITE_WEB_PORT=${VITE_WEB_PORT}
ENV VITE_WEB_URL=${VITE_WEB_URL}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SITE_INDEXABLE=${VITE_SITE_INDEXABLE}

RUN --mount=type=cache,target=/app/apps/frontend/node_modules/.vite \
    --mount=type=cache,target=/app/apps/frontend/node_modules/.cache \
    bunx turbo run build --filter=@mono/frontend && \
    bun run --cwd apps/frontend verify:build

FROM nginx:1.27-alpine AS runner

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --output-document=- http://127.0.0.1:9000/health > /dev/null || exit 1
