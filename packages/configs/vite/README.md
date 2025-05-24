# Vite Configuration (@mono/vite-config)

🌍 **Switch language to:** [Ukrainian (UA)](./README.ua.md)

This package provides a centralized and standardized base Vite configuration, designed for use in projects within a monorepo.

## Purpose of the Package

The main goal of this package is to simplify the development and maintenance of projects using Vite by:

- **Centralizing settings**: The base Vite configuration is stored in one place.
- **Unification**: Ensuring a consistent approach to build and development settings for all projects using this base.
- **Reducing Boilerplate**: Decreasing the amount of repetitive settings in each individual project's `vite.config.ts`.
- **Simplifying updates**: Easily updating Vite versions, plugins, and related rules for the entire monorepo by updating this base configuration.
- **Applying best practices**: Implementing time-tested settings that serve as a foundation for various types of applications.

## Available Configuration

The package exports a single base configuration (the import path is based on the `exports` field in this package's `package.json`, usually `@mono/vite-config`):

- **`vite.config.base.ts` (exported as `@mono/vite-config`)**:
  Base Vite configuration. Includes general settings such as optimizations for development and build, server settings, CSS processing, TypeScript support, `manualChunks` settings for better vendor caching, and integration with `lightningcss`. This configuration serves as a universal foundation for various project types (e.g., React, Vue, Svelte), which can supplement it with their specific plugins and settings.

## Key Features

- **Optimized development process**: Settings for fast Hot Module Replacement (HMR) and efficient development server operation.
- **Effective production build**: Code optimization, chunk splitting (`react-vendor`, `vendor`), minification using `esbuild` or `lightningcss` for CSS.
- **Support for modern standards**: Configured to work with TypeScript and ESNext.
- **Extensibility**: Easily extensible and customizable. Projects can import this base configuration and merge it with their specific settings using `mergeConfig` from Vite.
- **Monorepo integration**: `fs.allow` settings for correct operation in a monorepo environment.
- **Unification**: Ensuring a consistent approach to base Vite configuration across all parts of your monorepo.
- **Security**: Includes CSP Nonce generation for HTML.

## Usage

To use the base configuration in your project, install this package (`@mono/vite-config`) as a development dependency. Then, in your project's `vite.config.ts` file, import and use this configuration, merging it with your own settings as needed:

```typescript
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from '@mono/vite-config'; // Import base configuration

export default defineConfig((configEnv) => {
  // The base configuration can be a function or an object.
  // If it's a function (as in the provided vite.config.base.ts example), call it:
  const resolvedBaseConfig = typeof baseConfig === 'function' ? baseConfig(configEnv) : baseConfig;

  return mergeConfig(
    resolvedBaseConfig, // Base configuration from your package
    {
      // Specific settings for your project
      // For example, for a React application:
      // plugins: [react()], // Don't forget to install @vitejs/plugin-react
      server: {
        port: 3001, // Your port
      },
      resolve: {
        alias: {
          '@': '/src', // Example alias for your project
        },
      },
      // Other project-specific settings...
    }
  );
});
