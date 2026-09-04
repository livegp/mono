# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.3.14-alpine

FROM oven/bun:${BUN_VERSION} AS build
WORKDIR /app

COPY package.json bun.lock bunfig.toml turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile
RUN bunx turbo run build --filter=@mono/docs

FROM nginx:1.31-alpine AS runner

COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/docs/dist /usr/share/nginx/html

EXPOSE 6006
