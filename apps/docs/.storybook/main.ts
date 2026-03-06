// This file has been automatically migrated to valid ESM format by Storybook.
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createStorybookViteFinal } from "@mono/config/vite/storybook-react";
import type { StorybookConfig } from "@storybook/react-vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../stories/*.stories.tsx", "../stories/**/*.stories.tsx"],
  addons: [getAbsolutePath("@storybook/addon-links")],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  core: {},

  viteFinal: createStorybookViteFinal({
    uiAliasPath: resolve(__dirname, "../../../packages/ui/"),
  }),
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
