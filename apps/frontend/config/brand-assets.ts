import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

interface BrandAssetsPluginOptions {
  ogImageSource: string;
}

export function brandAssetsPlugin({
  ogImageSource,
}: BrandAssetsPluginOptions): Plugin {
  return {
    apply: "build",
    async generateBundle() {
      const source = await readFile(resolve(process.cwd(), ogImageSource));

      this.emitFile({
        fileName: "og-image.png",
        source,
        type: "asset",
      });
    },
    name: "mono:brand-assets",
  };
}
