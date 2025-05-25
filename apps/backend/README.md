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
  - [Development with Docker](#development-with-docker)
  - [Production with Docker](#production-with-docker)
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

This project includes Dockerfiles for containerization.

### Development with Docker

The `Dockerfile.dev` is configured to run the frontend application (as per its CMD). To adapt it for backend development or use a separate backend Docker setup, you might need to adjust it or use `docker-compose.yml` if it's configured for backend services.

*Note: The provided `Dockerfile.dev` in `apps/backend` seems to be misconfigured or intended for a different purpose as its `CMD` tries to run `apps/frontend`.*
If you intend to run the backend in development using Docker, you would typically use a command like:

```bash
# (Assuming docker-compose.yml is set up for the backend service)
# docker-compose up backend_service_name
```

Or build and run the dev Docker image directly (after correcting `Dockerfile.dev` if needed for backend):

```bash
# Example if Dockerfile.dev was for backend:
# docker build -t mono-backend-dev -f Dockerfile.dev ../../
# docker run -p <HOST_PORT>:<VITE_API_PORT> -v $(pwd)/src:/app/apps/backend/src mono-backend-dev
```

### Production with Docker

The `Dockerfile.prod` is used to build a production-ready image for the backend.

1. **Build the image:**
    From the monorepo root (`h:\Fullstack\My\Bun\mono`):

    ```bash
    docker build -t mono-backend-prod -f ./apps/backend/Dockerfile.prod .
    ```

2. **Run the container:**

    ```bash
    docker run -p <HOST_PORT>:<VITE_API_PORT> --env-file ./apps/backend/.env.production mono-backend-prod
    ```

    (Ensure you have a `.env.production` file or pass environment variables accordingly.)

The production Docker image uses a multi-stage build to create a small and optimized runtime image.

## Project Structure

A brief overview of the key directories and files:

```plaintext
mono/apps/backend/
├── Dockerfile.dev        # Docker configuration for development (currently points to frontend)
├── Dockerfile.prod       # Docker configuration for production
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
