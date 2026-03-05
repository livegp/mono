import { createStorybookViteFinal } from "@mono/config/vite/react-doc";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: createStorybookViteFinal({
    defineProcessEnv: false,
  }),
};
export default config;
