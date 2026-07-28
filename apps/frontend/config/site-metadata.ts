import type { SiteMetadata } from "@mono/config/project";
import type { HtmlTagDescriptor, Plugin } from "vite";

const HTML_TAG_PATTERN = /<html(?:\s+lang="[^"]*")?>/;
const TITLE_TAG_PATTERN = /<title>.*?<\/title>/s;

interface SiteMetadataPluginOptions {
  devFaviconUrl?: string;
  metadata: SiteMetadata;
}

export function siteMetadataPlugin({
  devFaviconUrl,
  metadata,
}: SiteMetadataPluginOptions): Plugin {
  return {
    name: "mono:site-metadata",
    transformIndexHtml(html) {
      const transformedHtml = html
        .replace(
          HTML_TAG_PATTERN,
          `<html lang="${escapeHtml(metadata.htmlLocale)}">`
        )
        .replace(
          TITLE_TAG_PATTERN,
          `<title>${escapeHtml(metadata.title)}</title>`
        );
      const tags: HtmlTagDescriptor[] = [
        {
          attrs: {
            content: metadata.authorName,
            name: "author",
          },
          injectTo: "head",
          tag: "meta",
        },
        {
          attrs: {
            href: metadata.authorUrl,
            rel: "author",
          },
          injectTo: "head",
          tag: "link",
        },
        {
          attrs: {
            content: metadata.description,
            name: "description",
          },
          injectTo: "head",
          tag: "meta",
        },
        {
          attrs: {
            href: metadata.canonicalUrl,
            rel: "canonical",
          },
          injectTo: "head",
          tag: "link",
        },
      ];

      if (devFaviconUrl) {
        tags.push({
          attrs: {
            href: devFaviconUrl,
            rel: "icon",
            type: "image/svg+xml",
          },
          injectTo: "head",
          tag: "link",
        });
      }

      return { html: transformedHtml, tags };
    },
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
