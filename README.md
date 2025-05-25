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
- [Type Checking](#type-checking)
- [Contribution](#contribution)
- [License](#license)

## About the Project

**mono** is a monorepo built with Bun and TypeScript, designed for centralized management and development of related projects (applications and packages).

## Monorepo Structure

The monorepo is organized as follows:

```tree
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
