# TypeScript Configurations (@mono/ts-config)

🌍 **Switch language to:** [Українська (UA)](./README.ua.md)

This package provides a centralized and standardized base TypeScript configuration designed for use in projects within a monorepo.

## Purpose of the Package

The main goal of this package is to simplify the development and maintenance of TypeScript projects by:

- **Centralizing settings**: The base TypeScript configuration is stored in one place.
- **Unification**: Ensuring a consistent configuration style and set of rules for all projects using this base.
- **Reducing Boilerplate**: Decreasing the amount of repetitive settings in each individual project's `tsconfig.json`.
- **Simplifying updates**: Easily updating the TypeScript version and related rules for the entire monorepo by updating this base configuration.
- **Applying best practices**: Implementing time-tested settings that serve as a foundation for various types of applications.

## Available Configuration

The package exports a single base configuration (the path for `extends` is based on the `exports` field in this package's `package.json`):

- **`tsconfig.base.json` (`@mono/ts-config`)**:
  Base TypeScript configuration. Includes strict compiler settings (`strict`, `noImplicitAny`, etc.), support for modern ECMAScript (ESNext), and settings optimized for monorepo work, for example, through `projectReferences`. This configuration serves as a universal foundation for various project types (backend, frontend, Node.js scripts), which can supplement it with their own specific settings.

## Key Features

- **Maximum type safety**: The base configuration uses strict TypeScript compiler flags by default for early detection of potential errors.
- **Modern JavaScript/TypeScript**: Configured to support the latest ECMAScript (ESNext) and TypeScript features.
- **Optimization for monorepos**: Efficient use of `projectReferences` to improve incremental compilation speed and better isolation between projects.
- **Uniformity and consistency**: Ensuring a unified approach to base TypeScript configuration across all parts of your monorepo.
- **Compatibility with popular tools**: Developed with integration with modern development tools like Bun, Vite, Elysia, ESLint in mind, and can be easily extended for specific needs.

## Usage

To use the base configuration in your project, install this package (`@mono/ts-config`) as a development dependency. Then, in your project's `tsconfig.json` file, add the `extends` field, specifying the package name:

```json
{
  "extends": "@mono/ts-config",
  "compilerOptions": {
    // Here you can override or add project-specific
    // compiler settings. For example:
    //
    // For a frontend project with React:
    // "jsx": "react-jsx",
    // "lib": ["ESNext", "DOM", "DOM.Iterable"],
    //
    // For a backend project on Node.js:
    // "module": "NodeNext", // if compatibility with native ES modules of Node.js is needed
    // "types": ["node", "bun-types"], // adding types for Node.js and Bun
    //
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
    // "tsBuildInfoFile": ".cache/tsconfig.app.tsbuildinfo" // for incremental builds
  },
  "include": [
    "src/**/*"
    // "src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts" // more explicit enumeration
  ],
  "exclude": [
    "node_modules",
    "dist",
    ".cache"
    // other files or directories that should not be compiled
  ]
  // "references": [] // If your project is part of a larger system with project references
}
