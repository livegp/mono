# @mono/backend

🌍 [**Читати українською**](README.ua.md)

Backend for the Mono project, built with Elysia.js and Bun.

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Development Mode](#development-mode)
  - [Building for Production](#building-for-production)
  - [Running Production Build](#running-production-build)
  - [Type Checking](#type-checking)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Docker](#docker)
  - [Building the Image](#building-the-image)
  - [Running the Container](#running-the-container)
- [Project Structure](#project-structure)
- [License](#license)

## About The Project

This project serves as the backend API for the Mono application. It is developed using the Elysia.js framework on the Bun runtime, focusing on performance and developer experience.

Key features include:

- Fast and efficient API endpoints.
- Built-in Swagger documentation.
- Environment variable management.
- CORS and Helmet for security.
- OpenTelemetry for observability.

## Built With

- [Bun](https://bun.sh/) - JavaScript runtime
- [Elysia.js](https://elysiajs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/)
- [Swagger (OpenAPI)](https://swagger.io/) - API documentation
- [Helmet](https://helmetjs.github.io/) - Security headers
- [OpenTelemetry](https://opentelemetry.io/) - Observability

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have [Bun](https://bun.sh/docs/installation) installed on your system.

### Installation

1. Clone the monorepo (if you haven't already).
2. Navigate to the backend directory:

    ```bash
    cd apps/backend
    ```

3. Install dependencies:

    ```bash
    bun install
    ```

## Usage

### Development Mode

To run the backend server in development mode with hot-reloading:

```bash
bun run dev
```

This command starts the server using `src/index.ts` and watches for file changes.
The server will typically run on the port specified by the `VITE_API_PORT` environment variable. Check the console output for the exact URL.

### Building for Production

To build the application for production:

```bash
bun run build
```

This command uses `build.ts` to create an optimized build in the `dist` directory. It minifies the code and sets `NODE_ENV` to `production`.

### Running Production Build

After building the project, you can run the production-ready server:

```bash
bun run preview
```

This executes the compiled `dist/index.js` file.

### Type Checking

To check for TypeScript errors without emitting JavaScript files:

```bash
bun run check-types
```

## API Documentation

This project uses `@elysiajs/swagger` to provide API documentation.
Once the server is running, you can access the Swagger UI at:
`http://localhost:<VITE_API_PORT>/docs/` (replace `<VITE_API_PORT>` with the actual port number).

Example endpoint:э

- `GET /api/greet/:name` - Greets the user.

## Configuration

### Environment Variables

The application uses environment variables for configuration, managed by `@yolk-oss/elysia-env` with schema validation defined in `src/schemas/env.ts`.
Create a `.env` file in the `apps/backend` directory based on `.env.example` (if one exists, otherwise create it).

Required environment variables:

- `VITE_API_PORT`: The port number for the server (e.g., `3000`).
- `NODE_ENV`: The environment mode (`development` or `production`).

Example `.env` file:

```env
VITE_API_PORT=3001
NODE_ENV=development
```

## Docker

This project uses an optimized multi-stage Dockerfile with **Turbo Prune** for efficient monorepo builds. The Dockerfile creates minimal workspaces containing only necessary dependencies for faster builds and smaller images.

### Building the Image

```bash
# From the monorepo root
docker build --build-arg PROJECT=backend -t mono-backend .

# Or using docker-compose
docker-compose build backend
```

### Running the Container

```bash
# Run standalone container
docker run -p 3000:3000 mono-backend

# Or using docker-compose
docker-compose up backend
```

### Docker Configuration Features

- **Multi-stage build**: BASE → PRUNE → INSTALLER → RUNNER
- **Turbo Prune**: Creates minimal workspace with only necessary dependencies
- **Security**: Runs as non-privileged user
- **Health Check**: Automatic server health monitoring on port 3000
- **Optimization**: Dependency caching for faster rebuilds
- **Production ready**: Optimized for production deployment

### Docker Architecture

The Dockerfile uses a **4-stage build process** optimized for Turborepo monorepos:

1. **Prune Stage**: Uses `turbo prune @mono/backend --docker` to create a minimal workspace with only necessary dependencies
2. **Installer Stage**: Installs dependencies from the pruned workspace and builds the application using `turbo build --filter=@mono/backend`
3. **Runner Stage**: Creates the final runtime image with minimal footprint

**Benefits of Turbo Prune:**

- ⚡ **Faster builds** - Only processes relevant files
- 🗜️ **Smaller images** - Excludes unnecessary packages and files
- 🚀 **Better caching** - More granular layer invalidation
- 🎯 **Precise dependencies** - Only includes what's actually needed

The build process includes proper caching, minimal dependencies, and security best practices with non-root user execution.

## Project Structure

A brief overview of the key directories and files:

```plaintext
mono/apps/backend/
├── Dockerfile            # Docker configuration
├── README.md             # This file
├── README.ua.md          # Ukrainian version of this file
├── build.ts              # Bun build script
├── package.json          # Project metadata and dependencies
├── src/                  # Source code
│   ├── config/           # Application configurations (helmet, swagger)
│   ├── index.ts          # Main application entry point
│   ├── routes/           # API route definitions
│   └── schemas/          # Data schemas (request/response, environment variables)
├── tsconfig.json         # TypeScript configuration
└── dist/                 # Output directory for production builds (generated)
```

## License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE.md) file in the monorepo root for details.

**What this license allows:**

- Commercial use
- Modification
- Distribution
- Private use
- Sublicensing

**Limitations:**

- No liability
- No warranty
