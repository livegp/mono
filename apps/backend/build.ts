import Bun from "bun";

const result = await Bun.build({
  define: {
    "process.env.NODE_ENV": "'production'",
  },
  drop: ["debugger"],
  entrypoints: ["./src/index.ts"],
  format: "esm",
  minify: {
    syntax: true,
    whitespace: true,
  },
  naming: "[dir]/[name].[ext]",
  outdir: "./dist",
  plugins: [],
  sourcemap: "external",
  splitting: false,
  target: "bun",
});

if (!result.success) {
  throw new Error(
    `Backend build failed:\n${result.logs.map(String).join("\n")}`
  );
}
