# @mono/docs

Storybook-only documentation for `@mono/ui`.

```bash
bun run dev
bun run check-types
bun run build
```

The workspace has no standalone Vite application. Storybook configuration lives in `.storybook`, stories live in `stories`, and the static build is written to `dist`.

The current public component import is:

```ts
import { Button } from "@mono/ui/components/button";
```

Run the static Docker service with:

```bash
docker compose --profile docs up --build
```

See the [root README](../../README.md) for full workspace instructions.
