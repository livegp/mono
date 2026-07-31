import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import jsPlugins from "ultracite/oxlint/js-plugins";
import react from "ultracite/oxlint/react";

const selectedJsPluginRulePrefix = "react-doctor";

const selectedJsPlugins = {
  ...jsPlugins,
  jsPlugins: jsPlugins.jsPlugins?.filter(
    (plugin) => plugin.name === selectedJsPluginRulePrefix
  ),
  overrides: jsPlugins.overrides?.map((override) => ({
    ...override,
    rules: Object.fromEntries(
      Object.entries(override.rules ?? {}).filter(
        ([ruleName]) =>
          (ruleName.split("/")[0] ?? ruleName) === selectedJsPluginRulePrefix
      )
    ),
  })),
  rules: Object.fromEntries(
    Object.entries(jsPlugins.rules ?? {}).filter(
      ([ruleName]) =>
        (ruleName.split("/")[0] ?? ruleName) === selectedJsPluginRulePrefix
    )
  ),
};

export default defineConfig({
  extends: [core, react, selectedJsPlugins],
  ignorePatterns: [
    ...core.ignorePatterns,
    ".github/instructions",
    ".github/skills",
  ],
  options: {
    typeAware: true,
  },
  overrides: [
    {
      files: ["apps/frontend/scripts/verify-build.ts"],
      rules: {
        "func-style": "off",
        "no-use-before-define": "off",
      },
    },
  ],
  rules: {
    "react-doctor/nextjs-no-img-element": "off",
  },
});
