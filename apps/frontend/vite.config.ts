/** biome-ignore-all lint/complexity/useLiteralKeys: Dynamic env variable access required */
import { ValidateEnv } from '@julr/vite-plugin-validate-env';
import baseViteConfig from '@mono/vite-config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

import type { PluginOption, UserConfig } from 'vite';
import { defineConfig, loadEnv, mergeConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { generateCspPlugin } from 'vite-plugin-bun-csp';
import checker from 'vite-plugin-checker';
import compression from 'vite-plugin-compression';
import hashedFaviconsPlugin from 'vite-plugin-hashed-favicons';
import mkcert from 'vite-plugin-mkcert';
import ogPlugin from 'vite-plugin-open-graph';
import Sitemap from 'vite-plugin-sitemap';
import { svgSpritemap } from 'vite-plugin-svg-spritemap';
import { webfontDownload } from 'vite-plugin-webfont-dl';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const WEB_PORT = Number(env['VITE_WEB_PORT']);
  const WEB_URL = env['VITE_WEB_URL'] || `http://localhost:${WEB_PORT}`;
  const API_PORT = Number(env['VITE_API_PORT']);
  const API_URL = env['VITE_API_URL'];
  const CORS_ORIGIN = env['VITE_CORS_ORIGIN'];

  const appFrontendConfig: UserConfig = {
    define: {
      'process.env': env,
    },
    base: WEB_URL,
    server: {
      port: WEB_PORT,
      cors: {
        origin: CORS_ORIGIN?.split(',').map((o) => o.trim()) || [
          WEB_URL,
          `http://localhost:${WEB_PORT}`,
        ],
      },
      ...(API_URL && API_PORT
        ? {
            proxy: {
              '/api': {
                target: `${API_URL}:${API_PORT}`,
                changeOrigin: true,
              },
            },
          }
        : {}),
    },
    plugins: [
      mkcert(),
      react(),
      tsconfigPaths(),
      checker({
        typescript: true,
        biome: true,
      }),
      compression(),
      imagetools({
        defaultDirectives: new URLSearchParams({
          format: 'avif;webp;jpg',
          quality: '75',
        }),
      }),
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        brotliSize: true,
        sourcemap: mode === 'development',
      }),
      generateCspPlugin({
        algorithm: 'sha256',
        policy: {
          'default-src': ["'self'"],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'img-src': ["'self'", 'data:'],
          'script-src': ["'self'"],
          'style-src': ["'self'", 'https://fonts.googleapis.com'],
          'connect-src': [
            "'self'",
            ...(API_URL ? [new URL(API_URL).origin] : []),
          ],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"],
          'frame-ancestors': ["'none'"],
        },
      }),
      hashedFaviconsPlugin('src/assets/icons/favicon.svg', {
        webManifest: {
          appName: 'mono',
          appShortName: 'mono',
          appDescription: 'the starting template of the project',
          developerName: 'Oleksandr Pishta',
          developerURL: 'https://livegp.github.io',
          background: '#fff',
          theme_color: '#fff',
          icons: {
            android: true,
            appleIcon: true,
            appleStartup: true,
            favicons: true,
            windows: true,
            yandex: true,
          },
        },
      }),
      ogPlugin({
        basic: {
          title: 'mono',
          image: {
            url: `${WEB_URL.endsWith('/') ? WEB_URL : `${WEB_URL}/`}vite.png`,
          },
          url: WEB_URL,
          description: 'the starting template of the project',
        },
      }),
      Sitemap(),
      svgSpritemap({
        pattern: 'src/assets/icons/*.svg',
        prefix: '',
        filename: 'spritemap.svg',
        currentColor: false,
        svgo: true,
        emit: false,
      }),
      webfontDownload([
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap',
      ]),
      tailwindcss(),
      ValidateEnv({
        configFile: 'config/env',
      }),
    ] as PluginOption[],
  };

  const resolvedBaseConfig = baseViteConfig({ command, mode });

  return mergeConfig(resolvedBaseConfig, appFrontendConfig);
});
