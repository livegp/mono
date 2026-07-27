# @mono/docs

Storybook-only документація для `@mono/ui`.

```bash
bun run dev
bun run check-types
bun run build
```

Workspace не має окремого Vite-застосунку. Storybook-конфігурація знаходиться в `.storybook`, stories — у `stories`, а статична збірка створюється в `dist`.

Поточний публічний імпорт компонента:

```ts
import { Button } from "@mono/ui/components/button";
```

Статичний Docker-сервіс запускається командою:

```bash
docker compose --profile docs up --build
```

Повні workspace інструкції дивіться в [кореневому README](../../README.ua.md).
