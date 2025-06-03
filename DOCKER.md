# Docker Setup Guide

Цей проект використовує Docker Compose з базовим файлом та окремими конфігураціями для розробки та продакшену.

## Структура файлів

```
├── docker-compose.yml          # Базова конфігурація (спільні сервіси)
├── docker-compose.dev.yml      # Конфігурація для розробки
├── docker-compose.prod.yml     # Конфігурація для продакшену
├── .env.prod.example          # Приклад змінних для продакшену
└── docker.cmd                 # Windows скрипт для управління
```

## Швидкий старт

### Розробка

```bash
# Запуск середовища розробки
docker.cmd dev up

# Запуск у фоновому режимі
docker.cmd dev up -d

# Перебудова образів
docker.cmd dev build

# Перегляд логів
docker.cmd dev logs

# Зупинка
docker.cmd dev down
```

### Продакшен

1. Створіть файл `.env.prod` на основі `.env.prod.example`:

   ```bash
   copy .env.prod.example .env.prod
   ```

2. Відредагуйте `.env.prod` з вашими реальними значеннями

3. Запустіть продакшен:

   ```bash
   # Запуск продакшену
   docker.cmd prod up -d

   # Перегляд статусу
   docker.cmd prod ps

   # Перегляд логів
   docker.cmd prod logs
   ```

## Ручне управління

Якщо ви не хочете використовувати `docker.cmd`, можете запускати команди напряму:

### Розробка

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### Продакшен

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up -d
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod down
```

## Доступні сервіси

### Розробка

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Docs (Storybook)**: http://localhost:6006
- **Database (PostgreSQL)**: localhost:5432
- **Redis**: localhost:6379
- **Adminer (DB Admin)**: http://localhost:8080

### Продакшен

- **Frontend**: http://localhost:80
- **Backend**: http://localhost:3001
- **Docs**: http://localhost:6006
- **Nginx**: http://localhost:80, https://localhost:443

## Переваги базового файлу

1. **DRY принцип**: Спільні налаштування не дублюються
2. **Консистентність**: Однакові базові сервіси в усіх середовищах
3. **Легкість підтримки**: Зміни в базовому файлі застосовуються скрізь
4. **Модульність**: Кожне середовище має свої специфічні налаштування

## Корисні команди

```bash
# Перегляд всіх контейнерів
docker.cmd dev ps

# Перегляд логів конкретного сервісу
docker.cmd dev logs backend

# Виконання команди в контейнері
docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend bun install

# Очищення всіх контейнерів та образів
docker.cmd dev down --rmi all --volumes --remove-orphans
```

## Налагодження

Якщо виникають проблеми:

1. Перевірте, чи запущений Docker Desktop
2. Переконайтеся, що порти не зайняті іншими процесами
3. Перебудуйте образи: `docker.cmd dev build --no-cache`
4. Очистіть volumes: `docker.cmd dev down --volumes`
