import type { UserConfig } from "vite";
import { mergeConfig } from "vite";

export interface StorybookViteFinalOptions {
  uiAliasPath?: string;
  defineProcessEnv?: boolean;
}

export type StorybookViteFinal = (
  config: UserConfig,
) => UserConfig | Promise<UserConfig>;

export function createStorybookViteFinal(
  options: StorybookViteFinalOptions = {},
): StorybookViteFinal {
  const { uiAliasPath, defineProcessEnv = true } = options;

  return (config) => {
    const patch: UserConfig = {};

    if (defineProcessEnv) {
      patch.define = { "process.env": {} };
    }

    if (uiAliasPath) {
      patch.resolve = {
        alias: [{ find: "ui", replacement: uiAliasPath }],
      };
    }

    return mergeConfig(config, patch);
  };
}
