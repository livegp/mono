# Огляд проекту та інструкції для GitHub Copilot

## Структура проекту

Це монорепозиторій, керований за допомогою Bun.

```plaintext
mono/
|   .dockerignore
|   .editorconfig
|   .gitignore
|   biome.json
|   bun.lock
|   bunfig.toml
|   docker-compose.override.yml
|   docker-compose.prod.yml
|   docker-compose.yml
|   lefthook.yml
|   LICENSE.md
|   package.json
|   README.md
|   README.ua.md
|   structure.txt
|   turbo.json
|
+---.github
|   |   copilot-instructions.md
|   |
|   +---instructions
|   \---prompts
+---.vscode
|       .vscodeextensions.json
|       mcp.json
|       settings.json
|
+---apps
|   +---backend
|   |   |   .env
|   |   |   .env.development
|   |   |   .env.production
|   |   |   .gitignore
|   |   |   build.ts
|   |   |   Dockerfile.dev
|   |   |   Dockerfile.prod
|   |   |   package.json
|   |   |   README.md
|   |   |   README.ua.md
|   |   |   tsconfig.json
|   |   |
|   |   \---src
|   |       |   index.ts
|   |       |
|   |       +---config
|   |       |       helmet.ts
|   |       |       swagger.ts
|   |       |
|   |       +---routes
|   |       |       greet.ts
|   |       |
|   |       \---schemas
|   |               env.ts
|   |               greet.ts
|   |
|   +---docs
|   |   |   .gitignore
|   |   |   index.html
|   |   |   package.json
|   |   |   README.md
|   |   |   README.ua.md
|   |   |   tsconfig.app.json
|   |   |   tsconfig.json
|   |   |   tsconfig.node.json
|   |   |   vite.config.ts
|   |   |
|   |   +---.storybook
|   |   |       main.ts
|   |   |       preview.ts
|   |   |
|   |   +---public
|   |   |       vite.svg
|   |   |
|   |   \---src
|   |       |   App.css
|   |       |   App.tsx
|   |       |   index.css
|   |       |   main.tsx
|   |       |   vite-env.d.ts
|   |       |
|   |       +---assets
|   |       |       react.svg
|   |       |
|   |       \---stories
|   |           |   button.css
|   |           |   Button.stories.ts
|   |           |   Button.tsx
|   |           |   Configure.mdx
|   |           |   header.css
|   |           |   Header.stories.ts
|   |           |   Header.tsx
|   |           |   page.css
|   |           |   Page.stories.ts
|   |           |   Page.tsx
|   |           |
|   |           \---assets
|   |                   accessibility.png
|   |                   accessibility.svg
|   |                   addon-library.png
|   |                   assets.png
|   |                   avif-test-image.avif
|   |                   context.png
|   |                   discord.svg
|   |                   docs.png
|   |                   figma-plugin.png
|   |                   github.svg
|   |                   share.png
|   |                   styling.png
|   |                   testing.png
|   |                   theming.png
|   |                   tutorials.svg
|   |                   youtube.svg
|   |
|   \---frontend
|       |   .env
|       |   .env.development
|       |   .env.production
|       |   .gitignore
|       |   404.html
|       |   Dockerfile.dev
|       |   Dockerfile.prod
|       |   index.html
|       |   package.json
|       |   README.md
|       |   README.ua.md
|       |   tsconfig.app.json
|       |   tsconfig.json
|       |   tsconfig.node.json
|       |   vite.config.ts
|       |
|       +---config
|       |       env.ts
|       |
|       +---public
|       |       vite.svg
|       |
|       \---src
|           |   App.css
|           |   App.tsx
|           |   index.css
|           |   main.tsx
|           |   vite-env.d.ts
|           |
|           +---assets
|           |   |   react.svg
|           |   |
|           |   +---icons
|           |   |       favicon.svg
|           |   |       react.svg
|           |   |       ts.svg
|           |   |       vite.svg
|           |   |
|           |   \---img
|           \---lib
|                   eden.ts
|
\---packages
    +---configs
    |   +---ts
    |   |       package.json
    |   |       README.md
    |   |       README.ua.md
    |   |       tsconfig.base.json
    |   |
    |   \---vite
    |           package.json
    |           README.md
    |           README.ua.md
    |           vite.config.base.ts
    |
    +---types
    +---ui
    |   |   package.json
    |   |   tsconfig.app.json
    |   |   tsconfig.json
    |   |   tsconfig.node.json
    |   |   vite.config.ts
    |   |
    |   \---src
    |           Button.tsx
    |           index.ts
    |
    \---utils
```

* **`apps/frontend/`**: Фронтенд-додаток (React + Vite).
* **`apps/backend/`**: Бекенд-додаток (ElysiaJS).
* **`apps/docs/`**: Документація та Storybook (Vite).
* **`packages/configs/`**: Спільні конфігурації (TypeScript, Vite).
* **`packages/ui/`**: UI-компоненти для повторного використання у фронтенді.
* **`.github/`**: Службові файли GitHub (Copilot instructions).
* **`.vscode/`**: Налаштування редактора для проекту.

## Технологічний стек

* **Середовище виконання:** Bun
* **Мова:** TypeScript
* **Фронтенд:** React, Vite
* **Бекенд:** Node.js/Bun
* **Інші технології:** Biome, Docker

## Загальні вказівки

* Дотримуйтесь конфігурацій TypeScript, визначених у [`packages/configs/typescript/`](h:\Fullstack\My\Bun\mono\packages\configs\typescript).
* Використовуйте сучасний синтаксис ECMAScript (ESNext).
* Дотримуйтесь правил форматування та лінтингу, визначених у Biome (див. `biome.json`).
* Пишіть чіткий, зрозумілий та документований код.
* Дотримуйтесь принципів DRY, KISS, SOLID.
* За потреби доповнюйте цей файл новими правилами чи структурними змінами.
