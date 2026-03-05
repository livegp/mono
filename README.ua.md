# mono 🚀

🌍 [**Read in English**](README.md)

[![Version](https://img.shields.io/github/package-json/v/livegp/mono)](https://github.com/livegp/mono) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Bun Version](https://img.shields.io/badge/bun-%3E%3D1.2.13-orange)](https://bun.sh/)

## Зміст

- [Про проєкт](#про-проєкт)
- [Структура монорепозиторію](#структура-монорепозиторію)
- [Технологічний стек](#технологічний-стек)
- [Встановлення](#встановлення)
- [Розробка](#розробка)
- [Збірка проєкту](#збірка-проєкту)
- [Docker](#docker-)
- [Перевірка типів](#перевірка-типів)
- [Внесок у проєкт](#внесок-у-проєкт)
- [Ліцензія](#ліцензія)

## Про проєкт

**mono** - це монорепозиторій, розроблений з використанням Bun та TypeScript. Він призначений для централізованого керування та розробки пов'язаних між собою проєктів (додатків та пакетів).

## Структура монорепозиторію

Монорепозиторій організований наступним чином:

```plaintext
mono/
├── apps/           # Директорія, що містить окремі додатки
│   ├── frontend/   # Фронтенд-додаток, розроблений на React та Vite
│   └── backend/    # Бекенд-додаток, побудований на ElysiaJS
├── packages/       # Директорія для спільних бібліотек та конфігурацій
│   ├── ui/         # Пакет зі спільними UI-компонентами на React
│   └── config/     # Пакет зі спільними конфігураціями (@mono/config)
│       ├── ts/     # Базова конфігурація TypeScript (@mono/config/ts)
│       └── vite/   # Базова конфігурація Vite (@mono/config/vite)
```

## Технологічний стек

- **Середовище виконання:** [Bun](https://bun.sh/) (версія >=1.2.13)
- **Мова програмування:** [TypeScript](https://www.typescriptlang.org/)
- **Фронтенд:**
  - [React](https://react.dev/)
  - [Vite](https://vitejs.dev/)
- **Бекенд:**
  - [ElysiaJS](https://elysiajs.com/)
- **Інструменти розробки:**
  - [Biome](https://biomejs.dev/) (форматування, лінтинг)
  - [Lefthook](https://github.com/evilmartians/lefthook) (Git хуки)
- **Менеджер пакетів:** [Bun](https://bun.sh/)

## Встановлення

1. **Клонуйте репозиторій:**

    ```bash
    git clone <ваш_репозиторій>
    cd mono
    ```

2. **Встановіть залежності:**

    ```bash
    bun install
    ```

## Розробка

Для запуску всіх додатків та пакетів у режимі розробки виконайте з кореня проєкту:

```bash
bun dev
```

Ця команда виконає скрипт `dev` для кожного пакету, визначеного у workspaces (наприклад, @mono/frontend, @mono/backend).

Щоб запустити конкретний додаток або пакет у режимі розробки, використовуйте фільтр:

```bash
bun --filter @mono/frontend dev  # Запуск тільки фронтенду
bun --filter @mono/backend dev   # Запуск тільки бекенду
```

## Збірка проєкту

Для збірки всіх додатків та пакетів виконайте з кореня проєкту:

```bash
bun build
```

Ця команда виконає скрипт `build` для кожного пакету.

Для збірки конкретного пакету:

```bash
bun --filter @mono/frontend build  # Збірка тільки фронтенду
```

## Docker 🐳

Цей проект використовує просту конфігурацію Docker Compose з усіма сервісами, визначеними в одному файлі `docker-compose.yml` для простоти та зручності використання.

### Команди для запуску

#### Основні команди

```bash
# Запуск всіх сервісів
docker-compose up -d

# Запуск конкретного сервісу
docker-compose up -d backend
docker-compose up -d frontend
docker-compose up -d docs
```

#### Корисні команди

```bash
# Перегляд логів
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f docs

# Перебудова образів
docker-compose build
docker-compose build backend

# Зупинка сервісів
docker-compose down

# Зупинка з видаленням volumes
docker-compose down -v

# Перевірка конфігурації
docker-compose config

# Перегляд активних сервісів
docker-compose ps

# Масштабування сервісів
docker-compose up -d --scale backend=3
```

### Конфігурація

Всі змінні середовища знаходяться в файлі `.env`:

```env
BUN_VERSION=1.2.15-alpine
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=4173
DOCS_PORT=6006
USER_ID=1001
GROUP_ID=1001
COMPOSE_PROJECT_NAME=mono
```

### Сервіси

Проект включає наступні сервіси:

- **backend**: Бекенд-додаток на ElysiaJS (порт 3000)
- **frontend**: Фронтенд-додаток на React (порт 4173)
- **docs**: Документація Storybook (порт 6006)

Всі сервіси включають:
- Перевірки стану для моніторингу
- Політики автоматичного перезапуску
- Конфігурацію логування
- Спільне мережеве з'єднання

### Додавання нового сервісу

Для додавання нового сервісу відредагуйте файл `docker-compose.yml` та додайте нове визначення сервісу:

```yaml
services:
  # ... існуючі сервіси ...

  newservice:
    build:
      context: .
      dockerfile: ./apps/newservice/Dockerfile
      args:
        <<: *common-variables
        PROJECT: newservice
        PORT: ${NEWSERVICE_PORT:-8000}
    container_name: mono-newservice
    ports:
      - "${NEWSERVICE_PORT:-8000}:${NEWSERVICE_PORT:-8000}"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=${NEWSERVICE_PORT:-8000}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${NEWSERVICE_PORT:-8000}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped
    networks:
      - mono-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Перевірка типів

Для перевірки типів TypeScript у всіх пакетах:

```bash
bun check-types
```

## Доступні скрипти

- `bun dev`: Запускає всі пакети в режимі розробки.
- `bun build`: Збирає всі пакети для продакшену.
- `bun preview`: Запускає попередній перегляд збірок (якщо підтримується пакетами).
- `bun check-types`: Виконує перевірку типів TypeScript для всіх пакетів.
- `bun check`: Запускає Biome для перевірки коду (форматування та лінтинг) з автоматичним виправленням.
- `bun format`: Форматує код за допомогою Biome з автоматичним виправленням.
- `bun lint`: Перевіряє код за допомогою Biome лінтера з автоматичним виправленням.

## Внесок у проєкт

Ми вітаємо будь-який внесок! Будь ласка, дотримуйтесь наступних кроків:

1. Відкрийте issue для обговорення нової функціональності або виправлення помилки.
2. Зробіть форк репозиторію.
3. Створіть нову гілку для ваших змін (`git checkout -b feature/AmazingFeature` or `bugfix/FixSomething`).
4. Зробіть ваші зміни та закомітьте їх (`git commit -m 'Add some AmazingFeature'`).
5. Відправте зміни у ваш форк (`git push origin feature/AmazingFeature`).
6. Відкрийте Pull Request до основного репозиторію.

Будь ласка, переконайтеся, що ваш код відповідає стандартам коду проєкту та проходить всі перевірки (типи, лінтинг).

## Ліцензія

Цей проєкт розповсюджується під ліцензією MIT. Детальніше дивіться у файлі [LICENSE](LICENSE).

**Що дозволяє ця ліцензія:**

- Комерційне використання
- Модифікацію
- Поширення
- Приватне використання
- Субліцензування

**Обмеження:**

- Відсутність гарантій
- Відповідальність обмежена

