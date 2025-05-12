# Огляд проекту та інструкції для GitHub Copilot

## Структура проекту

Це монорепозиторій, керований за допомогою Bun.

```plaintext
mono/
├── .dockerignore
├── .editorconfig
├── .env
├── .env.development
├── .env.production
├── .gitignore
├── .hintrc
├── .nojekyll
├── biome.json
├── bun.lock
├── bunfig.toml
├── docker-compose.yml
├── Dockerfile
├── lefthook.yml
├── LICENSE.md
├── package.json
├── README.md
├── structure.txt
├── tsconfig.json
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   ├── .vscodeextensions.json
│   └── settings.json
├── apps/
│   ├── backend/
│   │   ├── .gitignore
│   │   ├── build.ts
│   │   ├── Dockerfile
│   │   ├── Dockerfile.tmp
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── config/
│   │       │   ├── helmet.ts
│   │       │   └── swagger.ts
│   │       ├── routes/
│   │       │   └── greet.ts
│   │       └── schemas/
│   │           └── greet.ts
│   └── frontend/
│       ├── .env
│       ├── .env.development
│       ├── .env.production
│       ├── .gitignore
│       ├── Dockerfile
│       ├── Dockerfile.tmp
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── README.md
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       ├── public/
│       │   └── vite.svg
│       └── src/
│           ├── App.css
│           ├── App.tsx
│           ├── index.css
│           ├── main.tsx
│           ├── vite-env.d.ts
│           ├── assets/
│           │   └── react.svg
│           └── lib/
│               └── eden.ts
├── packages/
│   ├── configs/
│   │   ├── typescript/
│   │   │   ├── tsconfig.base.json
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   └── vite/
│   │       ├── base.ts
│   │       ├── frontend.ts
│   │       └── package.json
│   └── ui/
│       ├── bun.lock
│       ├── package.json
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       └── src/
│           ├── Button.tsx
│           └── index.ts
```

* **`apps/frontend/`**: Фронтенд-додаток (React + Vite).
* **`apps/backend/`**: Бекенд-додаток (Node.js/Bun, REST API).
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
