# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install