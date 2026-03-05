import type { UserConfig } from "vite";

export type ReactAppViteConfigOverrides = UserConfig;

export declare function createReactAppViteConfig(
  options?: ReactAppViteConfigOverrides,
): UserConfig;
