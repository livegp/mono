# @mono/frontend

React і Vite frontend для `mono`.

```bash
bun run dev
bun run check-types
bun run build
```

Стандартна development-конфігурація:

```env
VITE_WEB_PORT=9000
VITE_WEB_URL=http://localhost:9000
VITE_API_URL=http://localhost:9001
```

Браузер використовує типізований офіційний Eden-клієнт і звертається до same-origin `/api`. У development Vite проксіює цей шлях на `VITE_API_URL`, а в production Nginx — до backend-контейнера.

Vite-конфігурація навмисно містить лише:

- React SWC
- TypeScript path resolution
- Tailwind CSS
- env validation
- CSP generation

Повні workspace і Docker інструкції дивіться в [кореневому README](../../README.ua.md).
