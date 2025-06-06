
# @mono/docs

🌍 [**Read in English**](README.md)

Центр документації для проєкту Mono, створений за допомогою React, TypeScript, Vite та Storybook. Цей застосунок надає вичерпний посібник з компонентів та функціональних можливостей в екосистемі Mono.

## Зміст

- [Про проєкт](#про-проєкт)
- [Створено з використанням](#створено-з-використанням)
- [Початок роботи](#початок-роботи)
  - [Передумови](#передумови)
  - [Встановлення](#встановлення)
- [Використання](#використання)
  - [Сервер для розробки](#сервер-для-розробки)
  - [Сервер для розробки Storybook](#сервер-для-розробки-storybook)
  - [Збірка для продакшену](#збірка-для-продакшену)
  - [Попередній перегляд продакшен-збірки](#попередній-перегляд-продакшен-збірки)
  - [Перевірка типів](#перевірка-типів)
- [Docker](#docker)
  - [Збірка образу](#збірка-образу)
  - [Запуск контейнера](#запуск-контейнера)
- [Структура проєкту](#структура-проєкту)
- [Конфігурація Storybook](#конфігурація-storybook)
- [Ліцензія](#ліцензія)

## Про проєкт

Цей проєкт слугує центром документації для монорепозиторію Mono, створеного за допомогою React, TypeScript, Vite та Storybook. Він надає вичерпний посібник з компонентів та функціональних можливостей в екосистемі Mono.

Ключові особливості:

- Інтерактивна документація компонентів за допомогою Storybook.
- Швидка розробка та час збірки завдяки Vite та Bun.
- Вичерпна документація бібліотеки UI-компонентів.
- Ізольоване середовище розробки компонентів.
- Підтримка MDX для багатих сторінок документації.

## Створено з використанням

- [Bun](https://bun.sh/) - Середовище виконання JavaScript та інструментарій
- [Vite](https://vitejs.dev/) - Інструмент для збірки фронтенду
- [React](https://react.dev/) - JavaScript-бібліотека для створення користувацьких інтерфейсів
- [TypeScript](https://www.typescriptlang.org/) - Типізований JavaScript
- [Storybook](https://storybook.js.org/) - Інструмент для створення UI-компонентів та сторінок в ізоляції

## Початок роботи

### Передумови

- Встановлений [Bun](https://bun.sh/) у вашій системі.

### Встановлення

1. Склонуйте монорепозиторій (якщо ви ще цього не зробили):

    ```bash
    git clone <repository_url>
    cd mono
    ```

2. Встановіть залежності з кореня монорепозиторію:

    ```bash
    bun install
    ```

## Використання

Усі команди слід запускати з каталогу `apps/docs` (`h:\Fullstack\My\Bun\mono\apps\docs`).

### Сервер для розробки

Щоб запустити сервер для розробки Vite для основного застосунку:

```bash
bun run dev
```

Зазвичай це запускає сервер на `http://localhost:5173` (або наступному доступному порту).

### Сервер для розробки Storybook

Щоб запустити сервер для розробки Storybook:

```bash
bun run storybook
```

Зазвичай це запускає Storybook на `http://localhost:6006`.

### Збірка для продакшену

Щоб зібрати застосунок для продакшену:

```bash
bun run build
```

Це створює оптимізовану збірку у каталозі `dist/`.

Щоб зібрати Storybook для продакшену:

```bash
bun run build-storybook
```

Це створює статичну збірку Storybook у каталозі `storybook-static/`.

### Попередній перегляд продакшен-збірки

Щоб локально переглянути продакшен-збірку (після виконання `bun run build`):

```bash
bun run preview
```

### Перевірка типів

Щоб виконати перевірку типів TypeScript:

```bash
bun run check-types
```

## Docker

Цей проєкт використовує оптимізований багатоетапний Dockerfile з **Turbo Prune** для ефективної збірки монорепозиторію. Dockerfile створює мінімальні робочі простори, що містять лише необхідні залежності для швидшої збірки та менших образів.

### Збірка образу

```bash
# З кореневого каталогу монорепозиторію
docker build --build-arg PROJECT=docs -t mono-docs .

# Або з використанням docker-compose
docker-compose build docs
```

### Запуск контейнера

```bash
# Запуск окремого контейнера
docker run -p 6006:6006 mono-docs

# Або з використанням docker-compose
docker-compose up docs
```

### Особливості Docker-конфігурації

- **Багатоетапна збірка**: BASE → PRUNE → INSTALLER → RUNNER
- **Turbo Prune**: Створює мінімальний workspace лише з необхідними залежностями
- **Безпека**: Запуск від непривілейованого користувача
- **Health Check**: Автоматична перевірка стану Storybook сервера на порту 6006
- **Оптимізація**: Кешування залежностей для швидших повторних збірок
- **Storybook**: Обслуговування зібраної документації компонентів
- **Готовність до продакшену**: Оптимізовано для продакшн-розгортання

### Архітектура Docker

Dockerfile використовує **4-етапний процес збірки**, оптимізований для монорепозиторіїв Turborepo:

1. **Етап Prune**: Використовує `turbo prune @mono/docs --docker` для створення мінімального робочого простору з лише необхідними залежностями
2. **Етап Installer**: Встановлює залежності з обрізаного робочого простору та збирає застосунок за допомогою `turbo build --filter=@mono/docs`
3. **Етап Runner**: Створює фінальний образ для виконання з мінімальним розміром

**Переваги Turbo Prune:**

- ⚡ **Швидші збірки** - Обробляє лише релевантні файли
- 🗜️ **Менші образи** - Виключає непотрібні пакети та файли
- 🚀 **Краще кешування** - Більш детальна інвалідація шарів
- 🎯 **Точні залежності** - Включає лише те, що дійсно потрібно

Процес збірки включає належне кешування, мінімальні залежності та найкращі практики безпеки з виконанням від імені не-root користувача.

## Структура проєкту

Короткий огляд ключових каталогів та файлів:

```plaintext
mono/apps/docs/
├── .storybook/             # Каталог конфігурації Storybook
│   ├── main.ts             # Основна конфігурація Storybook (розташування історій, додатки, фреймворк)
│   └── preview.ts          # Конфігурація попереднього перегляду Storybook (глобальні декоратори, параметри)
├── Dockerfile              # Конфігурація Docker
├── README.md               # Цей файл
├── README.ua.md            # Українська версія цього файлу
├── index.html              # Основний HTML-файл для застосунку Vite
├── package.json            # Метадані проєкту, залежності та скрипти
├── public/                 # Статичні ресурси (наприклад, vite.svg)
├── src/
│   ├── App.css             # Стилі для основного компонента App
│   ├── App.tsx             # Основний компонент React-застосунку
│   ├── assets/             # Статичні ресурси, що використовуються компонентами (наприклад, react.svg)
│   ├── index.css           # Глобальні стилі
│   ├── main.tsx            # Точка входу React-застосунку
│   ├── stories/            # Історії Storybook та пов'язані файли компонентів
│   │   ├── Button.stories.ts # Історії для компонента Button
│   │   ├── Button.tsx        # Реалізація компонента Button
│   │   ├── Configure.mdx     # Сторінка документації MDX для Storybook
│   │   ├── Header.stories.ts # Історії для компонента Header
│   │   ├── Header.tsx        # Реалізація компонента Header
│   │   ├── Page.stories.ts   # Історії для компонента Page
│   │   ├── Page.tsx          # Реалізація компонента Page
│   │   └── ...               # Інші історії та ресурси
│   └── vite-env.d.ts       # Визначення TypeScript для змінних середовища Vite
├── tsconfig.app.json       # Конфігурація TypeScript для коду застосунку (src)
├── tsconfig.json           # Корінна конфігурація TypeScript, посилається на інші файли tsconfig
├── tsconfig.node.json      # Конфігурація TypeScript для файлів, специфічних для Node.js (наприклад, vite.config.ts)
├── vite.config.ts          # Файл конфігурації Vite
└── storybook-static/       # Каталог виводу для збірок Storybook (генерується)
```

### Ключові файли та каталоги

- **`.storybook/`**: Містить файли конфігурації Storybook.
  - **`main.ts`**: Основний файл конфігурації, який визначає, де знаходяться історії, які додатки використовувати та фреймворк.
  - **`preview.ts`**: Конфігурація для попереднього перегляду Storybook, включаючи глобальні декоратори та параметри.
- **`src/stories/`**: Містить усі історії Storybook та пов'язані файли компонентів.
  - **`*.stories.ts`**: Файли історій, які визначають, як компоненти повинні відображатися в Storybook.
  - **`*.tsx`**: Реалізації компонентів.
  - **`Configure.mdx`**: MDX-файл для сторінок документації в Storybook.
- **`vite.config.ts`**: Файл конфігурації Vite, який налаштовує інструмент збірки та сервер розробки.
- **`package.json`**: Містить метадані проєкту, залежності та скрипти для виконання різних завдань.

## Конфігурація Storybook

Конфігурація Storybook знаходиться в каталозі `.storybook/`:

- **`main.ts`**: Визначає розташування історій, додатки та конфігурацію фреймворку
- **`preview.ts`**: Налаштовує глобальні декоратори, параметри та налаштування попереднього перегляду

Storybook надає ізольоване середовище для розробки та тестування UI-компонентів. Він автоматично виявляє файли історій, що відповідають шаблону `**/*.stories.@(js|jsx|ts|tsx|mdx)` в каталозі `src`.

## Ліцензія

Цей проєкт є частиною монорепозиторію Mono. Дивіться основний репозиторій для інформації про ліцензію.
