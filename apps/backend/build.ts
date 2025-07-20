/** biome-ignore-all lint/correctness/noUndeclaredVariables: <explanation> */
Bun.build({
  // root: '.',
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  naming: '[dir]/[name].[ext]',
  target: 'bun',
  format: 'esm',
  splitting: false,
  plugins: [],
  env: 'inline',
  sourcemap: 'external',
  minify: {
    whitespace: true,
    syntax: true,
  },
  define: {
    'process.env.NODE_ENV': "'production'",
  },
  drop: ['console', 'debugger', 'alert', 'assert', 'exports', 'imports'],
});
