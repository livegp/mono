import type { UserConfig } from "vite";

export interface StorybookViteFinalOptions {
  uiAliasPath?: string;
  defineProcessEnv?: boolean;
}

export type StorybookViteFinal = (
  config: UserConfig,
) => UserConfig | Promise<UserConfig>;

export declare function createStorybookViteFinal(
  options?: StorybookViteFinalOptions,
): StorybookViteFinal;
