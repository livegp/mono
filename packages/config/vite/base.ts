import crypto from "node:crypto";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig, searchForWorkspaceRoot } from "vite";

const NONCE = crypto.randomBytes(16).toString("base64");

const baseSettings: UserConfig = {
  build: {
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    cssMinify: "lightningcss",
    emptyOutDir: true,
    manifest: true,
    modulePreload: {
      polyfill: true,
    },
    outDir: "dist",
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) {
            return null;
          }
          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("scheduler")
          ) {
            return "react-vendor";
          }
          return "vendor";
        },
      },
    },
    target: "esnext",
  },
  cacheDir: "node_modules/.vite",
  css: {
    devSourcemap: true,
    lightningcss: {
      targets: browserslistToTargets(browserslist(">= 0.25%")),
    },
    modules: {
      localsConvention: "camelCase",
      scopeBehaviour: "local",
    },
    transformer: "lightningcss",
  },
  esbuild: {
    target: "esnext",
  },
  html: {
    cspNonce: NONCE,
  },
  optimizeDeps: {
    exclude: ["@mono/ui"],
    include: ["react", "react-dom"],
  },
  preview: {
    cors: true,
    port: 3000,
    strictPort: true,
  },
  publicDir: "public",
  root: ".",
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
      strict: true,
    },
    strictPort: false,
  },
};

export default defineConfig((env: ConfigEnv) => {
  const isDev = env.mode === "development";

  return {
    ...baseSettings,
    build: {
      ...baseSettings.build,
      minify: isDev ? false : ("esbuild" as const),
      sourcemap: isDev,
    },
  };
});
