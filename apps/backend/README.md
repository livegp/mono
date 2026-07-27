# @mono/backend

The Elysia API for the `mono` workspace.

```bash
bun run dev
bun run check-types
bun run test
bun run build
bun run start
```

Default runtime configuration:

```env
NODE_ENV=development
API_PORT=9001
CORS_ORIGIN=http://localhost:9000
```

The app factory is exported from `@mono/backend` for Eden type inference and tests. The runtime entrypoint is kept separate so importing the type never starts a server.

Routes:

- `GET /api/health`
- `GET /api/greet/:name`
- `GET /docs`

See the [root README](../../README.md) for full workspace and Docker instructions.
