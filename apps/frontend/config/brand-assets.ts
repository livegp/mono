import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Plugin } from "vite";

interface BrandAssetsPluginOptions {
  ogImageSource: string;
}

export const brandAssetsPlugin = ({
  ogImageSource,
}: BrandAssetsPluginOptions): Plugin => ({
  apply: "build",
  async generateBundle() {
    const source = await readFile(path.resolve(process.cwd(), ogImageSource));

    this.emitFile({
      fileName: "og-image.png",
      source,
      type: "asset",
    });
  },
  name: "mono:brand-assets",
});
