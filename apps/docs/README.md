
# @mono/docs

🌍 [**Читати українською**](README.ua.md)

This project serves as the documentation hub for the Mono monorepo, built with React, TypeScript, Vite, and Storybook. It provides a comprehensive guide to the components and functionalities within the Mono ecosystem.

## Technologies Used

- **React 19:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite:** A fast build tool and development server.
- **Storybook:** An open-source tool for building UI components and pages in isolation.
- **Bun:** Used for running scripts (via `bunx`).

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system.

### Installation

1. Clone the monorepo (if you haven't already):

    ```bash
    git clone <repository_url>
    cd mono
    ```

2. Install dependencies from the root of the monorepo:

    ```bash
    bun install
    ```

## Usage

All commands should be run from the `apps/docs` directory (`h:\Fullstack\My\Bun\mono\apps\docs`).

### Development Server

To start the Vite development server for the main application:

```bash
bun run dev
```

This will typically start the server on `http://localhost:5173` (or the next available port).

### Storybook

To start the Storybook development server:

```bash
bun run storybook
```

This will typically start Storybook on `http://localhost:6006`.

### Build

To build the application for production:

```bash
bun run build
```

The production-ready files will be placed in the `dist` directory.

To build Storybook for deployment:

```bash
bun run build-storybook
```

The static Storybook files will be placed in the `storybook-static` directory.

### Preview Production Build

To preview the production build locally (after running `bun run build`):

```bash
bun run preview
```

### Type Checking

To perform a TypeScript type check:

```bash
bun run check-types
```

## Project Structure

```plaintext
mono/apps/docs/
├── .storybook/             # Storybook configuration files
│   ├── main.ts             # Main Storybook configuration (addons, stories location)
│   └── preview.ts          # Storybook preview configuration (global decorators, parameters)
├── public/                 # Static assets (e.g., vite.svg)
├── src/
│   ├── assets/             # Static assets used by components (e.g., react.svg)
│   ├── stories/            # Storybook stories and related component files
│   │   ├── Button.stories.ts # Stories for the Button component
│   │   ├── Button.tsx        # Button component implementation
│   │   ├── Configure.mdx     # MDX documentation page for Storybook
│   │   ├── Header.stories.ts # Stories for the Header component
│   │   ├── Header.tsx        # Header component implementation
│   │   ├── Page.stories.ts   # Stories for the Page component
│   │   ├── Page.tsx          # Page component implementation
│   │   └── ...               # Other stories and assets
│   ├── App.css             # Styles for the main App component
│   ├── App.tsx             # Main React application component
│   ├── index.css           # Global styles
│   ├── main.tsx            # Entry point of the React application
│   └── vite-env.d.ts       # TypeScript definitions for Vite environment variables
├── .gitignore              # Specifies intentionally untracked files that Git should ignore
├── README.md               # This file (English documentation)
├── README.ua.md            # Ukrainian version of the documentation
├── index.html              # Main HTML file for the Vite application
├── package.json            # Project metadata, dependencies, and scripts
├── tsconfig.app.json       # TypeScript configuration for the application code (src)
├── tsconfig.json           # Root TypeScript configuration, references other tsconfig files
├── tsconfig.node.json      # TypeScript configuration for Node.js specific files (e.g., vite.config.ts)
└── vite.config.ts          # Vite configuration file
```

### Key Files and Directories

- **`package.json`**: Defines project scripts (`dev`, `build`, `storybook`, etc.) and dependencies (React, Vite, Storybook, TypeScript).
- **`vite.config.ts`**: Configures Vite, primarily enabling the React plugin.
- **`src/main.tsx`**: The entry point for the React application, where the root component (`App`) is rendered.
- **`src/App.tsx`**: The main application component.
- **`.storybook/main.ts`**: Configures Storybook, specifying where to find stories and which addons to use (e.g., `@storybook/addon-docs`).
- **`src/stories/`**: Contains all Storybook stories (`*.stories.ts` or `*.stories.tsx`) and the components they document. MDX files (`*.mdx`) can also be used for documentation pages.

## Storybook Configuration (`.storybook/main.ts`)

The Storybook configuration specifies:

- **Stories Location**: `../src/**/*.mdx` and `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)` tells Storybook to look for stories and MDX documentation files within the `src` directory.
- **Addons**: Includes `@storybook/addon-onboarding` and `@storybook/addon-docs` for enhanced documentation capabilities.
- **Framework**: Uses `@storybook/react-vite` to integrate Storybook with a Vite-based React project.

This setup allows for efficient development and documentation of UI components in isolation, leveraging the speed of Vite and the power of Storybook.
