# mono

[English version](README.md)

Монорепозиторій на Bun і TypeScript із React frontend, Elysia backend, спільним UI-пакетом та Storybook-документацією.

## Вимоги

- Bun 1.3.14 або новіший
- Docker із підтримкою Compose (необов'язково)

## Структура

```text
apps/
  backend/   Elysia API
  frontend/  React і Vite застосунок
  docs/      Storybook документація
packages/
  config/    спільні TypeScript і Vite конфігурації
  ui/        спільні React-компоненти
```

## Локальна розробка

Скопіюйте `.env.example` у `.env`, потім установіть залежності:

```bash
bun install --frozen-lockfile
```

Запустіть backend і frontend в окремих терміналах:

```bash
bun run dev:backend
bun run dev:frontend
```

Стандартні адреси сервісів:

- frontend: <http://localhost:9000>
- backend: <http://localhost:9001>
- API документація: <http://localhost:9001/docs>
- Storybook: <http://localhost:6006> через `bun run dev:docs`

Браузер звертається до API через same-origin `/api`. У development Vite проксіює ці запити на `VITE_API_URL`.

## Змінні середовища

| Змінна | Стандартне значення | Призначення |
| --- | --- | --- |
| `NODE_ENV` | `development` | Режим backend: `development`, `production` або `test` |
| `API_PORT` | `9001` | Порт backend |
| `CORS_ORIGIN` | `http://localhost:9000` | Дозволені browser origins через кому |
| `VITE_WEB_PORT` | `9000` | Порт Vite development server |
| `VITE_WEB_URL` | `http://localhost:9000` | Публічна адреса frontend |
| `VITE_API_URL` | `http://localhost:9001` | Адреса development API proxy |

Збережені стандартні значення безпечні для локальної розробки. Production secrets не повинні мати префікс `VITE_`, оскільки Vite-змінні публічні.

## Перевірка якості

```bash
bun run check-types
bun run lint
bun run test
bun run build
```

TypeScript перевіряє реальні frontend, backend, UI та Storybook проєкти. Backend-тести перевіряють health, greeting, validation і not-found відповіді без відкриття мережевого порту.
Поточний toolchain використовує Vite 8.1.5 із Rolldown. TypeScript працює side-by-side: `tsc` запускає native compiler TypeScript 7.0.2, а `typescript` залишається TypeScript 6.0.3 для Storybook, tsdown і compiler API. Перевірити TypeScript 6 можна командою `bun run tsc6 -- --version`.

## Docker

Зберіть і запустіть production frontend та backend:

```bash
docker compose up --build
```

Frontend віддається через Nginx на порту 9000 і проксіює `/api` до backend-контейнера на порту 9001.

Для запуску додаткового статичного Storybook-сервісу:

```bash
docker compose --profile docs up --build
```

Опубліковані порти можна змінити через `WEB_PORT`, `API_PORT` і `DOCS_PORT` у shell або Compose environment.

## Публічні контракти

- `GET /api/health` повертає стан backend.
- `GET /api/greet/:name` повертає типізоване привітання.
- Eden-тип backend імпортується з `@mono/backend`.
- Спільна кнопка імпортується з `@mono/ui/components/button`.

## Додавання frontend-інструментів

Frontend навмисно має невелике Vite-ядро: React SWC, TypeScript paths, Tailwind CSS, env validation і CSP generation. PWA, обробку зображень, sitemap, metadata або bundle analysis слід додавати лише під конкретну потребу застосунку. HTTP compression виконується на рівні Nginx або deployment CDN.

## Ліцензія

[MIT](LICENSE.md)
