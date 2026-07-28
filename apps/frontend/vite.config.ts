/** biome-ignore-all lint/complexity/useLiteralKeys: Vite loadEnv returns an index-signature map */

import { resolve } from "node:path";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import { projectConfig, resolveSiteMetadata } from "@mono/config/project";
import baseViteConfig from "@mono/config/vite/base";
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import { defineConfig, loadEnv, mergeConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { generateCspPlugin } from "vite-plugin-bun-csp";
import { webfontDownload } from "vite-plugin-webfont-dl";
import { siteMetadataPlugin } from "./config/site-metadata";

export default defineConfig(({ command, mode }) => {
  const envDirectory = resolve(process.cwd(), "../..");
  const env = loadEnv(mode, envDirectory, "VITE_");
  const webPort = Number(env["VITE_WEB_PORT"] || 9000);
  const apiUrl = env["VITE_API_URL"] || "http://localhost:9001";
  const siteMetadata = resolveSiteMetadata(
    env["VITE_WEB_URL"] || `http://localhost:${webPort}`
  );

  const appFrontendConfig: UserConfig = {
    base: "/",
    envDir: envDirectory,
    plugins: [
      react(),
      tailwindcss(),
      imagetools(),
      VitePluginSvgSpritemap("src/assets/icons/*.svg", {
        output: {
          filename: "spritemap.svg",
          name: "spritemap.svg",
          use: true,
          view: true,
        },
        oxvg: false,
        prefix: "icon-",
        route: "/__spritemap",
        svgo: true,
      }),
      webfontDownload([projectConfig.fonts.providerCssUrl], {
        assetsSubfolder: "fonts",
        async: false,
        cache: true,
        injectAsStyleTag: false,
        minifyCss: command === "build",
        subsetsAllowed: [...projectConfig.fonts.subsets],
        throwError: command === "build",
      }),
      siteMetadataPlugin({
        ...(command === "serve"
          ? { devFaviconUrl: projectConfig.branding.faviconDevUrl }
          : {}),
        metadata: siteMetadata,
      }),
      ValidateEnv({
        configFile: "config/env",
      }),
      generateCspPlugin({
        algorithm: "sha256",
        policy: {
          "base-uri": ["'self'"],
          "connect-src": ["'self'"],
          "default-src": ["'self'"],
          "font-src": ["'self'"],
          "form-action": ["'self'"],
          "frame-ancestors": ["'none'"],
          "img-src": ["'self'", "data:"],
          "object-src": ["'none'"],
          "script-src": ["'self'"],
          "style-src": ["'self'"],
        },
      }),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: webPort,
      proxy: {
        "/api": {
          changeOrigin: true,
          target: apiUrl,
        },
      },
      strictPort: true,
    },
  };

  const resolvedBaseConfig = baseViteConfig({ command, mode });

  return mergeConfig(resolvedBaseConfig, appFrontendConfig);
});
