/** biome-ignore-all lint/complexity/useLiteralKeys: NodeJS.ProcessEnv is an index-signature map */

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { projectConfig, resolveSiteMetadata } from "@mono/config/project";

interface WebManifest {
  background_color: string;
  description: string;
  icons: Array<{ src: string }>;
  lang: string;
  name: string;
  short_name: string;
  theme_color: string;
}

const WEBFONT_CSS_PATTERN = /webfonts-[^/\\]+\.css$/;

const appRoot = resolve(import.meta.dir, "..");
const distDirectory = join(appRoot, "dist");
const webUrl = process.env["VITE_WEB_URL"] ?? "http://localhost:9000";
const siteIndexable = process.env["VITE_SITE_INDEXABLE"] === "true";
const metadata = resolveSiteMetadata(webUrl);

invariant(existsSync(distDirectory), "dist directory does not exist");

const [html, manifestText, sitemap, robots, files] = await Promise.all([
  readFile(join(distDirectory, "index.html"), "utf8"),
  readFile(join(distDirectory, "manifest.webmanifest"), "utf8"),
  readFile(join(distDirectory, "sitemap.xml"), "utf8"),
  readFile(join(distDirectory, "robots.txt"), "utf8"),
  collectFiles(distDirectory),
]);
const manifest = JSON.parse(manifestText) as WebManifest;
const relativeFiles = files.map((file) =>
  relative(distDirectory, file).split(sep).join("/")
);

assertContains(html, `<html lang="${metadata.htmlLocale}">`, "HTML lang");
assertContains(html, `<title>${metadata.title}</title>`, "HTML title");
assertContains(
  html,
  `content="${metadata.description}" name="description"`,
  "description"
);
assertContains(
  html,
  `href="${metadata.canonicalUrl}" rel="canonical"`,
  "canonical URL"
);
assertContains(
  html,
  `content="${metadata.authorName}" name="author"`,
  "author metadata"
);
assertContains(
  html,
  `href="${metadata.authorUrl}" rel="author"`,
  "author link"
);
assertContains(
  html,
  `property="og:title" content="${metadata.title}"`,
  "Open Graph title"
);
assertContains(
  html,
  `property="og:description" content="${metadata.description}"`,
  "Open Graph description"
);
assertContains(
  html,
  `property="og:image:url" content="${metadata.ogImageUrl}"`,
  "Open Graph image"
);
assertContains(
  html,
  `property="og:locale" content="${metadata.ogLocale}"`,
  "Open Graph locale"
);
assertContains(
  html,
  'name="twitter:card" content="summary_large_image"',
  "Twitter card"
);
assertContains(
  html,
  `name="twitter:image" content="${metadata.ogImageUrl}"`,
  "Twitter image"
);

invariant(
  manifest.name === projectConfig.identity.name,
  "manifest name is incorrect"
);
invariant(
  manifest.short_name === projectConfig.identity.shortName,
  "manifest short_name is incorrect"
);
invariant(
  manifest.description === metadata.description,
  "manifest description is incorrect"
);
invariant(manifest.lang === metadata.htmlLocale, "manifest lang is incorrect");
invariant(
  manifest.theme_color === projectConfig.branding.themeColor,
  "manifest theme color is incorrect"
);
invariant(
  manifest.background_color === projectConfig.branding.backgroundColor,
  "manifest background color is incorrect"
);
invariant(manifest.icons.length >= 3, "manifest favicon set is incomplete");

for (const icon of manifest.icons) {
  assertPublicFile(icon.src, `manifest icon ${icon.src}`);
}

for (const link of html.matchAll(/<link\b[^>]*>/g)) {
  const [tag] = link;
  if (!(tag.includes('rel="icon"') || tag.includes('rel="apple-touch-icon"'))) {
    continue;
  }
  const href = /href="([^"]+)"/.exec(tag)?.[1];
  invariant(Boolean(href), `favicon link has no href: ${tag}`);
  assertPublicFile(href as string, `favicon ${href}`);
}
assertPublicFile("/favicon.ico", "favicon.ico");
assertPublicFile("/og-image.png", "Open Graph image");

const ogImage = await readFile(join(distDirectory, "og-image.png"));
invariant(
  ogImage.readUInt32BE(16) === 1200,
  "Open Graph image width must be 1200"
);
invariant(
  ogImage.readUInt32BE(20) === 630,
  "Open Graph image height must be 630"
);

for (const route of projectConfig.routes) {
  const routeUrl = new URL(route, metadata.canonicalUrl).toString();
  invariant(sitemap.includes(routeUrl), `sitemap is missing ${routeUrl}`);
  invariant(
    countOccurrences(sitemap, routeUrl) === 1,
    `sitemap contains duplicate ${routeUrl}`
  );
}
assertContains(
  robots,
  `Sitemap: ${new URL("/sitemap.xml", metadata.canonicalUrl)}`,
  "robots sitemap"
);
assertContains(
  robots,
  siteIndexable ? "Allow: /" : "Disallow: /",
  "robots indexability"
);

const spritemapPath = join(distDirectory, "assets", "spritemap.svg");
const spritemap = await readFile(spritemapPath, "utf8");
for (const iconName of ["react", "ts", "vite"]) {
  assertContains(
    spritemap,
    `id="icon-${iconName}"`,
    `spritemap icon-${iconName}`
  );
}

const fontFiles = relativeFiles.filter((file) => file.endsWith(".woff2"));
invariant(fontFiles.length > 0, "no local WOFF2 files were generated");
const webfontCssPath = files.find((file) => WEBFONT_CSS_PATTERN.test(file));
invariant(Boolean(webfontCssPath), "generated webfont CSS is missing");
const webfontCss = await readFile(webfontCssPath as string, "utf8");
assertContains(webfontCss, "url(fonts/", "local webfont URL");
invariant(
  !/fonts\.(?:googleapis|gstatic)\.com/.test(`${html}\n${webfontCss}`),
  "build contains browser requests to Google Fonts"
);

for (const extension of [".avif", ".webp", ".png"]) {
  invariant(
    relativeFiles.some(
      (file) => file.includes("assets/og-image-") && file.endsWith(extension)
    ),
    `missing transformed ${extension} image`
  );
}

assertContains(html, 'http-equiv="Content-Security-Policy"', "CSP meta tag");
assertContains(html, "script-src 'self'", "CSP script policy");
assertContains(html, "style-src 'self'", "CSP style policy");
invariant(
  !html.includes("'unsafe-inline'"),
  "CSP unexpectedly allows unsafe-inline"
);

console.log(
  `Verified frontend build: ${relativeFiles.length} files, ${manifest.icons.length} manifest icons, ${fontFiles.length} local fonts.`
);

function assertContains(haystack: string, needle: string, label: string): void {
  invariant(haystack.includes(needle), `${label} is missing`);
}

function assertPublicFile(publicPath: string, label: string): void {
  invariant(
    publicPath.startsWith("/"),
    `${label} must use an absolute public path`
  );
  invariant(
    existsSync(join(distDirectory, publicPath.slice(1))),
    `${label} does not exist`
  );
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : [path];
    })
  );

  return nested.flat();
}

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Build verification failed: ${message}`);
  }
}
