/** biome-ignore-all lint/complexity/useLiteralKeys: Vite loadEnv returns an index-signature map */

import { resolve } from "node:path";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import { projectConfig, resolveSiteMetadata } from "@mono/config/project";
import baseViteConfig from "@mono/config/vite/base";
import VitePluginSvgSpritemap from "@spiriit/vite-plugin-svg-spritemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin, UserConfig } from "vite";
import { defineConfig, loadEnv, mergeConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { generateCspPlugin } from "vite-plugin-bun-csp";
import hashedFaviconsPlugin from "vite-plugin-hashed-favicons";
import openGraphPlugin from "vite-plugin-open-graph";
import Sitemap from "vite-plugin-sitemap";
import { webfontDownload } from "vite-plugin-webfont-dl";
import { brandAssetsPlugin } from "./config/brand-assets";
import { siteMetadataPlugin } from "./config/site-metadata";

export default defineConfig(({ command, mode }) => {
  const envDirectory = resolve(process.cwd(), "../..");
  const env = loadEnv(mode, envDirectory, "VITE_");
  const webPort = Number(env["VITE_WEB_PORT"] || 9000);
  const apiUrl = env["VITE_API_URL"] || "http://localhost:9001";
  const siteIndexable = env["VITE_SITE_INDEXABLE"] === "true";
  const siteMetadata = resolveSiteMetadata(
    env["VITE_WEB_URL"] || `http://localhost:${webPort}`
  );
  const buildOnlyPlugins: Plugin[] =
    command === "build"
      ? [
          brandAssetsPlugin({
            ogImageSource: projectConfig.branding.ogImageSource,
          }),
          hashedFaviconsPlugin(projectConfig.branding.faviconSource, {
            webManifest: {
              background_color: projectConfig.branding.backgroundColor,
              description: siteMetadata.description,
              display: "standalone",
              lang: siteMetadata.htmlLocale,
              name: projectConfig.identity.name,
              scope: "/",
              short_name: projectConfig.identity.shortName,
              start_url: "/",
              theme_color: projectConfig.branding.themeColor,
            },
          }),
          openGraphPlugin({
            basic: {
              description: siteMetadata.description,
              image: {
                alt: `${siteMetadata.title} starter monorepo`,
                height: 630,
                type: "image/png",
                url: siteMetadata.ogImageUrl,
                width: 1200,
              },
              locale: siteMetadata.ogLocale,
              siteName: projectConfig.identity.name,
              title: siteMetadata.title,
              type: "website",
              url: siteMetadata.canonicalUrl,
            },
            twitter: {
              card: "summary_large_image",
              description: siteMetadata.description,
              image: siteMetadata.ogImageUrl,
              imageAlt: `${siteMetadata.title} starter monorepo`,
              title: siteMetadata.title,
            },
          }),
          Sitemap({
            dynamicRoutes: [...projectConfig.routes],
            extensions: [],
            generateRobotsTxt: true,
            hostname: siteMetadata.canonicalUrl,
            readable: true,
            robots: [
              siteIndexable
                ? { allow: "/", userAgent: "*" }
                : { disallow: "/", userAgent: "*" },
            ],
          }),
        ]
      : [];

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
      ...buildOnlyPlugins,
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
