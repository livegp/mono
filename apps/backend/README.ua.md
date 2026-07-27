# @mono/backend

Elysia API для workspace `mono`.

```bash
bun run dev
bun run check-types
bun run test
bun run build
bun run start
```

Стандартна runtime-конфігурація:

```env
NODE_ENV=development
API_PORT=9001
CORS_ORIGIN=http://localhost:9000
```

App factory експортується з `@mono/backend` для Eden type inference і тестів. Runtime entrypoint відокремлений, тому імпорт типу не запускає сервер.

Маршрути:

- `GET /api/health`
- `GET /api/greet/:name`
- `GET /docs`

Повні workspace і Docker інструкції дивіться в [кореневому README](../../README.ua.md).
