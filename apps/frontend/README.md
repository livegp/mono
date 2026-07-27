# @mono/frontend

The React and Vite frontend for `mono`.

```bash
bun run dev
bun run check-types
bun run build
```

Default development configuration:

```env
VITE_WEB_PORT=9000
VITE_WEB_URL=http://localhost:9000
VITE_API_URL=http://localhost:9001
```

The browser uses the typed official Eden client and calls same-origin `/api`. Vite proxies that path to `VITE_API_URL` during development; production Nginx proxies it to the backend container.

The Vite configuration intentionally includes only:

- React SWC
- TypeScript path resolution
- Tailwind CSS
- environment validation
- CSP generation

See the [root README](../../README.md) for full workspace and Docker instructions.
