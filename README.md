# mono

[Українська версія](README.ua.md)

A Bun and TypeScript monorepo with a React frontend, an Elysia backend, a shared UI package, and Storybook documentation.

## Requirements

- Bun 1.3.14 or newer
- Docker with Compose support (optional)

## Workspace

```text
apps/
  backend/   Elysia API
  frontend/  React and Vite application
  docs/      Storybook documentation
packages/
  config/    shared TypeScript and Vite configuration
  ui/        shared React components
```

## Local development

Copy `.env.example` to `.env`, then install dependencies:

```bash
bun install --frozen-lockfile
```

Start the backend and frontend in separate terminals:

```bash
bun run dev:backend
bun run dev:frontend
```

The services use these default addresses:

- frontend: <http://localhost:9000>
- backend: <http://localhost:9001>
- API documentation: <http://localhost:9001/docs>
- Storybook: <http://localhost:6006> via `bun run dev:docs`

The browser calls the API through same-origin `/api`. Vite proxies these requests to `VITE_API_URL` during development.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `NODE_ENV` | `development` | Backend runtime mode: `development`, `production`, or `test` |
| `API_PORT` | `9001` | Backend listen port |
| `CORS_ORIGIN` | `http://localhost:9000` | Comma-separated allowed browser origins |
| `VITE_WEB_PORT` | `9000` | Vite development port |
| `VITE_WEB_URL` | `http://localhost:9000` | Public frontend URL |
| `VITE_API_URL` | `http://localhost:9001` | Development proxy target |

The committed defaults are safe for local development. Production secrets must not use the `VITE_` prefix because Vite variables are public.

## Quality commands

```bash
bun run check-types
bun run lint
bun run test
bun run build
```

TypeScript checks inspect the actual frontend, backend, UI, and Storybook projects. Backend tests exercise health, greeting, validation, and not-found responses without opening a network port.
The current toolchain pins Vite 8.1.5 with Rolldown. TypeScript uses a side-by-side setup: `tsc` runs the native TypeScript 7.0.2 compiler, while `typescript` remains TypeScript 6.0.3 for Storybook, tsdown, and compiler API consumers. Run `bun run tsc6 -- --version` to inspect the TypeScript 6 compiler.

## Docker

Build and start the production frontend and backend:

```bash
docker compose up --build
```

The frontend is served by Nginx on port 9000 and proxies `/api` to the backend container on port 9001.

Start the optional static Storybook service as well:

```bash
docker compose --profile docs up --build
```

Override published ports with `WEB_PORT`, `API_PORT`, or `DOCS_PORT` in the shell or Compose environment.

## Public contracts

- `GET /api/health` returns backend health information.
- `GET /api/greet/:name` returns a typed greeting.
- Import the backend Eden type from `@mono/backend`.
- Import the shared button from `@mono/ui/components/button`.

## Adding optional frontend tooling

The frontend intentionally keeps a small Vite core: React SWC, TypeScript paths, Tailwind CSS, environment validation, and CSP generation. Add PWA, image processing, sitemap, metadata, or bundle analysis only when the application has a concrete requirement for it. HTTP compression belongs in Nginx or the deployment CDN.

## License

[MIT](LICENSE.md)
