import path from "node:path";
import { fileURLToPath } from "node:url";

import { getProjectMetadata, projectConfig } from "@mono/config/project";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const metadata = getProjectMetadata();
const getAbsolutePath = (value: string): string =>
  path.dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));

const config: StorybookConfig = {
  addons: [getAbsolutePath("@storybook/addon-links")],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  managerHead: (head) =>
    `${head}<title>${projectConfig.identity.name} UI — ${metadata.title}</title>`,
  stories: ["../stories/**/*.stories.tsx"],
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
    }),
};

export default config;
