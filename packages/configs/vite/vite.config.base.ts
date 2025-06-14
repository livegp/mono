import browserslist from 'browserslist';
import crypto from 'crypto'
import { browserslistToTargets } from 'lightningcss';
import { defineConfig, searchForWorkspaceRoot } from 'vite'

import type { UserConfig, ConfigEnv } from 'vite'

const NONCE = crypto.randomBytes(16).toString('base64')

const baseSettings: UserConfig = {
  root: '.',
  publicDir: 'public',
  cacheDir: 'node_modules/.vite',
  build: {
    chunkSizeWarningLimit: 1000,
    cssMinify: 'lightningcss',
    emptyOutDir: true,
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            // if (id.includes('@tanstack')) {
            //   return 'tanstack-vendor';
            // }
            return 'vendor';
          }
          return undefined;
        },
      },
    },
    target: 'esnext',
    assetsInlineLimit: 4096,
    modulePreload: {
      polyfill: true
    },
    reportCompressedSize: true,
  },
  html: {
    cspNonce: NONCE,
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local',
    },
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%'))
    },
  },
  server: {
    strictPort: false,
    fs: {
      strict: true,
      allow: [searchForWorkspaceRoot(process.cwd())]
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@mono/ui'],
  },
  esbuild: {
    target: 'esnext',
  }
};

export default defineConfig((env: ConfigEnv) => {
  const isDev = env.mode === 'development'

  return {
    ...baseSettings,
    build: {
      ...baseSettings.build,
      sourcemap: isDev,
      minify: isDev ? false : 'esbuild' as const,
    }
  }
})
