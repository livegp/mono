# Аргументи збірки
ARG BUN_VERSION=alpine
ARG NODE_ENV=production
ARG PORT=3000
ARG USER_ID=1001
ARG GROUP_ID=1001

# Базовий етап
FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app

# Етап встановлення залежностей
FROM base AS install

# Копіювання файлів залежностей з кореня монорепо
COPY ../../package.json ../../bun.lock* ../../
COPY ../../packages ../../packages
COPY package.json ./

# Встановлення залежностей
RUN bun install --frozen-lockfile

# Встановлення продакшн залежностей окремо
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
COPY ../../bun.lock* /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Етап збірки
FROM install AS builder

COPY . .
RUN bun run build

# Продакшн етап
FROM base AS production

# Створюємо non-root користувача для безпеки
RUN addgroup -g ${GROUP_ID} -S backendgroup && \
    adduser -u ${USER_ID} -S backenduser -G backendgroup

# Копіювання продакшн залежностей
COPY --from=install /temp/prod/node_modules ./node_modules

# Копіювання зібраних файлів та конфігурації
COPY --from=builder --chown=backenduser:backendgroup /app/dist ./dist
COPY --from=builder --chown=backenduser:backendgroup /app/package.json ./

# Змінюємо власника файлів
RUN chown -R backenduser:backendgroup /app
USER backenduser

# Відкриття порту
EXPOSE ${PORT}

# Змінні середовища
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

# Команда запуску
CMD ["bun", "run", "preview"]
