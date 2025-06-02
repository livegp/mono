# @mono/docs

🌍 [**Читати українською**](README.ua.md)

Documentation hub for the Mono project, built with React, TypeScript, Vite, and Storybook. This application provides a comprehensive guide to the components and functionalities within the Mono ecosystem.

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Development Server](#development-server)
  - [Storybook Development Server](#storybook-development-server)
  - [Building for Production](#building-for-production)
  - [Preview Production Build](#preview-production-build)
  - [Linting and Type Checking](#linting-and-type-checking)
- [Docker](#docker)
  - [Building the Image](#building-the-image)
  - [Running the Container](#running-the-container)
- [Project Structure](#project-structure)
- [Storybook Configuration](#storybook-configuration)
- [License](#license)

## About The Project

This project serves as the documentation hub for the Mono monorepo, built with React, TypeScript, Vite, and Storybook. It provides a comprehensive guide to the components and functionalities within the Mono ecosystem.

Key features include:

- Interactive component documentation with Storybook.
- Fast development and build times powered by Vite and Bun.
- Comprehensive UI component library documentation.
- Isolated component development environment.
- MDX support for rich documentation pages.

## Built With

- [Bun](https://bun.sh/) - JavaScript runtime & toolkit
- [Vite](https://vitejs.dev/) - Frontend build tool
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Storybook](https://storybook.js.org/) - Tool for building UI components and pages in isolation

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

### Storybook Development Server

To start the Storybook development server:

```bash
bun run storybook
```

This will start Storybook on `http://localhost:6006` (or the next available port). Storybook provides an isolated environment to develop and test UI components.

### Building for Production

To build the main application for production:

```bash
bun run build
```

The built files will be output to the `dist/` directory.

To build Storybook for production:

```bash
bun run build-storybook
```

The built Storybook will be output to the `storybook-static/` directory.

### Preview Production Build

To preview the production build locally:

```bash
bun run preview
```

This serves the built files from the `dist/` directory.

### Linting and Type Checking

To run the linter:

```bash
bun run lint
```

To run TypeScript type checking:

```bash
bun run type-check
```

## Docker

This project uses an optimized multi-stage Dockerfile with **Turbo Prune** for efficient monorepo builds. The Dockerfile creates minimal workspaces containing only necessary dependencies for faster builds and smaller images.

### Building the Image

**Important:** All Docker builds must be run from the **monorepo root directory** (`h:\Fullstack\My\Bun\mono`) to enable Turbo Prune functionality.

**For Production:**

```bash
# From the monorepo root (h:\Fullstack\My\Bun\mono)
docker build -f apps/docs/Dockerfile -t @mono/docs:latest .
```

**For Development:**

```bash
# From the monorepo root (h:\Fullstack\My\Bun\mono)
docker build -f apps/docs/Dockerfile -t @mono/docs:dev --build-arg NODE_ENV=development .
```

**For CI/CD (with metadata):**

```bash
# From the monorepo root (h:\Fullstack\My\Bun\mono)
docker build -f apps/docs/Dockerfile -t @mono/docs:$(git rev-parse --short HEAD) \
  --build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  --build-arg GIT_COMMIT=$(git rev-parse HEAD) \
  --build-arg GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD) \
  .
```

### Running the Container

**Production:**

```bash
docker run -d -p 6006:6006 --name docs-prod @mono/docs:latest
```

**Development (with volume mounts for live reload):**

```bash
docker run -d -p 6006:6006 \
  -v ./src:/app/src \
  -v ./public:/app/public \
  -v ./.storybook:/app/.storybook \
  -v ./package.json:/app/package.json \
  -v ./bun.lockb:/app/bun.lockb \
  --name docs-dev @mono/docs:dev
```

**With custom environment variables:**

```bash
docker run -d -p 6006:6006 \
  -e NODE_ENV=production \
  -e PORT=6006 \
  --name docs @mono/docs:latest
```

### Docker Architecture

The Dockerfile uses a **4-stage build process** optimized for Turborepo monorepos:

1. **Pruner Stage**: Uses `turbo prune @mono/docs --docker` to create a minimal workspace with only necessary dependencies
2. **Dependencies Stage**: Installs dependencies from the pruned workspace for optimal caching
3. **Builder Stage**: Builds the application using `turbo build --filter=@mono/docs`
4. **Production Stage**: Creates the final runtime image with minimal footprint

**Benefits of Turbo Prune:**

- ⚡ **Faster builds** - Only processes relevant files
- 🗜️ **Smaller images** - Excludes unnecessary packages and files
- 🚀 **Better caching** - More granular layer invalidation
- 🎯 **Precise dependencies** - Only includes what's actually needed

The build process includes proper caching, minimal dependencies, and security best practices with non-root user execution.

## Project Structure

A brief overview of the key directories and files:

```plaintext
mono/apps/docs/
├── .storybook/             # Storybook configuration directory
│   ├── main.ts             # Main Storybook configuration (stories location, addons, framework)
│   └── preview.ts          # Storybook preview configuration (global decorators, parameters)
├── Dockerfile              # Docker configuration
├── README.md               # This file
├── README.ua.md            # Ukrainian version of this file
├── index.html              # Main HTML file for the Vite application
├── package.json            # Project metadata, dependencies, and scripts
├── public/                 # Static assets (e.g., vite.svg)
├── src/
│   ├── App.css             # Styles for the main App component
│   ├── App.tsx             # Main React application component
│   ├── assets/             # Static assets used by components (e.g., react.svg)
│   ├── index.css           # Global styles
│   ├── main.tsx            # Entry point of the React application
│   ├── stories/            # Storybook stories and related component files
│   │   ├── Button.stories.ts # Stories for the Button component
│   │   ├── Button.tsx        # Button component implementation
│   │   ├── Configure.mdx     # MDX documentation page for Storybook
│   │   ├── Header.stories.ts # Stories for the Header component
│   │   ├── Header.tsx        # Header component implementation
│   │   ├── Page.stories.ts   # Stories for the Page component
│   │   ├── Page.tsx          # Page component implementation
│   │   └── ...               # Other stories and assets
│   └── vite-env.d.ts       # TypeScript definitions for Vite environment variables
├── tsconfig.app.json       # TypeScript configuration for the application code (src)
├── tsconfig.json           # Root TypeScript configuration, references other tsconfig files
├── tsconfig.node.json      # TypeScript configuration for Node.js specific files (e.g., vite.config.ts)
├── vite.config.ts          # Vite configuration file
└── storybook-static/       # Output directory for Storybook builds (generated)
```

### Key Files and Directories

- **`.storybook/`**: Contains Storybook configuration files.
  - **`main.ts`**: Main configuration file that defines where stories are located, which addons to use, and the framework.
  - **`preview.ts`**: Configuration for the Storybook preview, including global decorators and parameters.
- **`src/stories/`**: Contains all the Storybook stories and related component files.
  - **`*.stories.ts`**: Story files that define how components should be displayed in Storybook.
  - **`*.tsx`**: Component implementations.
  - **`Configure.mdx`**: MDX file for documentation pages within Storybook.
- **`vite.config.ts`**: Vite configuration file that sets up the build tool and development server.
- **`package.json`**: Contains project metadata, dependencies, and scripts for running various tasks.

## Storybook Configuration

The Storybook configuration is located in the `.storybook/` directory:

- **`main.ts`**: Defines the stories location, addons, and framework configuration
- **`preview.ts`**: Sets up global decorators, parameters, and preview settings

Storybook provides an isolated environment for developing and testing UI components. It automatically discovers story files matching the pattern `**/*.stories.@(js|jsx|ts|tsx|mdx)` in the `src` directory.

## License

This project is part of the Mono monorepo. See the main repository for license information.
