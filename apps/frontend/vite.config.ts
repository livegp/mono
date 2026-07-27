/** biome-ignore-all lint/complexity/useLiteralKeys: Vite loadEnv returns an index-signature map */

import { resolve } from "node:path";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import baseViteConfig from "@mono/config/vite/base";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import type { UserConfig } from "vite";
import { defineConfig, loadEnv, mergeConfig } from "vite";
import { generateCspPlugin } from "vite-plugin-bun-csp";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const envDirectory = resolve(process.cwd(), "../..");
  const env = loadEnv(mode, envDirectory, "VITE_");
  const webPort = Number(env["VITE_WEB_PORT"] || 9000);
  const apiUrl = env["VITE_API_URL"] || "http://localhost:9001";

  const appFrontendConfig: UserConfig = {
    base: "/",
    envDir: envDirectory,
    server: {
      port: webPort,
      strictPort: true,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      tsconfigPaths(),
      tailwindcss(),
      ValidateEnv({
        configFile: "config/env",
      }),
      generateCspPlugin({
        algorithm: "sha256",
        policy: {
          "default-src": ["'self'"],
          "font-src": ["'self'"],
          "img-src": ["'self'", "data:"],
          "script-src": ["'self'"],
          "style-src": ["'self'"],
          "connect-src": ["'self'"],
          "object-src": ["'none'"],
          "base-uri": ["'self'"],
          "form-action": ["'self'"],
          "frame-ancestors": ["'none'"],
        },
      }),
    ],
  };

  const resolvedBaseConfig = baseViteConfig({ command, mode });

  return mergeConfig(resolvedBaseConfig, appFrontendConfig);
});
