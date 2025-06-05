# mono 🚀

🌍 [**Читати українською**](README.ua.md)

[![Version](https://img.shields.io/github/package-json/v/livegp/mono)](https://github.com/livegp/mono) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Bun Version](https://img.shields.io/badge/bun-%3E%3D1.2.13-orange)](https://bun.sh/)

## Table of Contents

- [About the Project](#about-the-project)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Development](#development)
- [Building the Project](#building-the-project)
- [Docker](#docker-)
- [Type Checking](#type-checking)
- [Contribution](#contribution)
- [License](#license)

## About the Project

**mono** is a monorepo built with Bun and TypeScript, designed for centralized management and development of related projects (applications and packages).

## Monorepo Structure

The monorepo is organized as follows:

```plaintext
mono/
├── apps/           # Directory containing individual applications
│   ├── frontend/   # Frontend application built with React and Vite
│   └── backend/    # Backend application built with ElysiaJS
├── packages/       # Directory for shared libraries and configurations
│   ├── ui/         # Shared UI components package (React)
│   └── configs/    # Shared configurations package
│       ├── ts/     # Base TypeScript configuration (@mono/ts-config)
│       └── vite/   # Bas Vite configuration (@mono/vite-config)
```

## Tech Stack

- **Runtime:** [Bun](https://bun.sh/) (version >=1.2.13)
- **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
- **Frontend:**
  - [React](https://react.dev/)
  - [Vite](https://vitejs.dev/)
- **Backend:**
  - [ElysiaJS](https://elysiajs.com/)
- **Development Tools:**
  - [Biome](https://biomejs.dev/) (formatting, linting)
  - [Lefthook](https://github.com/evilmartians/lefthook) (Git hooks)
- **Package Manager:** [Bun](https://bun.sh/)

## Installation

1. **Clone the repository:**

    ```bash
    git clone <your_repository_url>
    cd mono
    ```

2. **Install dependencies:**

    ```bash
    bun install
    ```

## Development

To run all applications and packages in development mode, execute from the project root:

```bash
bun dev
```

This command will run the dev script for each package defined in workspaces (e.g., @mono/frontend, @mono/backend).

To run a specific application or package in development mode, use the filter:

```bash
bun --filter @mono/frontend dev  # Run only frontend
bun --filter @mono/backend dev   # Run only backend
```

## Building the Project

To build all applications and packages, run from the project root:

```bash
bun build
```

This command will run the build script for each package.

To build a specific package:

```bash
bun --filter @mono/frontend build # Build only frontend
```

## Docker 🐳

This project uses a simple Docker Compose configuration with all services defined in a single `docker-compose.yml` file for simplicity and ease of use.

### File Structure

```tree
├── docker-compose.yml          # Main Docker Compose file with all configurations
└── .env                        # Environment variables
```

### Launch Commands

#### Basic Commands

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend
docker-compose up -d frontend
docker-compose up -d docs
```

#### Useful Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f docs

# Rebuild images
docker-compose build
docker-compose build backend

# Stop services
docker-compose down

# Stop with volume removal
docker-compose down -v

# Configuration check
docker-compose config

# View active services
docker-compose ps

# Service scaling
docker-compose up -d --scale backend=3
```

### Configuration

All environment variables are located in the `.env` file:

```env
BUN_VERSION=1.2.15-alpine
NODE_ENV=production
BACKEND_PORT=3000
FRONTEND_PORT=4173
DOCS_PORT=6006
USER_ID=1001
GROUP_ID=1001
COMPOSE_PROJECT_NAME=mono
```

### Services

The project includes the following services:

- **backend**: ElysiaJS backend application (port 3000)
- **frontend**: React frontend application (port 4173)
- **docs**: Storybook documentation (port 6006)

All services include:
- Health checks for monitoring
- Automatic restart policies
- Logging configuration
- Shared network connectivity

### Adding a New Service

To add a new service, edit the `docker-compose.yml` file and add a new service definition:

```yaml
services:
  # ... existing services ...

  newservice:
    build:
      context: .
      dockerfile: ./apps/newservice/Dockerfile
      args:
        <<: *common-variables
        PROJECT: newservice
        PORT: ${NEWSERVICE_PORT:-8000}
    container_name: mono-newservice
    ports:
      - "${NEWSERVICE_PORT:-8000}:${NEWSERVICE_PORT:-8000}"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=${NEWSERVICE_PORT:-8000}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${NEWSERVICE_PORT:-8000}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped
    networks:
      - mono-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Type Checking

To check TypeScript types in all packages:

```bash
bun check-types
```

## Available Scripts

- `bun dev`: Starts all packages in development mode.
- `bun build`: Builds all packages for production.
- `bun preview`: Starts a preview of the built applications (if supported by the packages).
- `bun check-types`: Runs TypeScript type checking for all packages.
- `bun check`: Runs Biome for code checking (formatting and linting) with auto-fix.
- `bun format`: Formats code using Biome with auto-fix.
- `bun lint`: Checks code using Biome linter with auto-fix.

## Contribution

We welcome any contributions! Please follow these steps:

1. Open an issue to discuss new features or bug fixes.
2. Fork the repository.
3. Create a new branch for your changes (`git checkout -b feature/AmazingFeature` or `bugfix/FixSomething`).
4. Make your changes and commit them (`git commit -m 'Add some AmazingFeature'`).
5. Push your changes to your fork (`git push origin feature/AmazingFeature`).
6. Open a Pull Request to the main repository.

Please ensure your code follows the project's coding standards and passes all checks (types, linting).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**What this license allows:**

- Commercial use
- Modification
- Distribution
- Private use
- Sublicensing

**Limitations:**

- No liability
- No warranty
