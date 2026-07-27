import Bun from "bun";

const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  naming: "[dir]/[name].[ext]",
  target: "bun",
  format: "esm",
  splitting: false,
  plugins: [],
  sourcemap: "external",
  minify: {
    whitespace: true,
    syntax: true,
  },
  define: {
    "process.env.NODE_ENV": "'production'",
  },
  drop: ["debugger"],
});

if (!result.success) {
  throw new Error(
    `Backend build failed:\n${result.logs.map(String).join("\n")}`
  );
}
