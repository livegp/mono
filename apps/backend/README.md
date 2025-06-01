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

This project uses a single optimized Dockerfile that can build both development and production images based on the `NODE_ENV` build argument.

### Building the Image

**For Production:**

```bash
# From the backend directory (h:\Fullstack\My\Bun\mono\apps\backend)
docker build -t @mono/backend:latest .
```

**For Development:**

```bash
# From the backend directory (h:\Fullstack\My\Bun\mono\apps\backend)
docker build -t @mono/backend:dev --build-arg NODE_ENV=development .
```

**For CI/CD (with metadata):**

```bash
docker build -t @mono/backend:$(git rev-parse --short HEAD) \
  --build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  --build-arg GIT_COMMIT=$(git rev-parse HEAD) \
  --build-arg GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD) \
  .
```

### Running the Container

**Production:**

```bash
docker run -d -p 3000:3000 --name backend-prod @mono/backend:latest
```

**Development (with volume mounts for live reload):**

```bash
docker run -d -p 3000:3000 \
  -v ./src:/app/src \
  -v ./package.json:/app/package.json \
  -v ./bun.lockb:/app/bun.lockb \
  --name backend-dev @mono/backend:dev
```

**With custom environment variables:**

```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --name backend @mono/backend:latest
```

The Dockerfile uses a multi-stage build with optimizations for both development and production environments, including proper caching, minimal dependencies, and security best practices.

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
