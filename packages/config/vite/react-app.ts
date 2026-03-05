import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
import { defineConfig, mergeConfig } from "vite";

export type ReactAppViteConfigOverrides = UserConfig;

export function createReactAppViteConfig(
  options: ReactAppViteConfigOverrides = {},
): UserConfig {
  const baseConfig = defineConfig({
    plugins: [react()],
  });

  return mergeConfig(baseConfig, options);
}
