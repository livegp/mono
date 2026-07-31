import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { projectConfig, resolveSiteMetadata } from "@mono/config/project";
import { loadEnv } from "vite";

interface WebManifest {
  background_color: string;
  description: string;
  icons: { src: string }[];
  lang: string;
  name: string;
  short_name: string;
  theme_color: string;
}

const WEBFONT_CSS_PATTERN = /webfonts-[^/\\]+\.css$/u;

const appRoot = path.resolve(import.meta.dir, "..");
const distDirectory = path.join(appRoot, "dist");
const workspaceRoot = path.resolve(appRoot, "../..");
const buildEnvironment = loadEnv("production", workspaceRoot, "VITE_");
const webUrl = buildEnvironment["VITE_WEB_URL"] ?? "http://localhost:9000";
const siteIndexable = buildEnvironment["VITE_SITE_INDEXABLE"] === "true";
const metadata = resolveSiteMetadata(webUrl);

invariant(existsSync(distDirectory), "dist directory does not exist");

const [html, manifestText, sitemap, robots, files] = await Promise.all([
  readFile(path.join(distDirectory, "index.html"), "utf-8"),
  readFile(path.join(distDirectory, "manifest.webmanifest"), "utf-8"),
  readFile(path.join(distDirectory, "sitemap.xml"), "utf-8"),
  readFile(path.join(distDirectory, "robots.txt"), "utf-8"),
  collectFiles(distDirectory),
]);
const parsedManifest: unknown = JSON.parse(manifestText);
invariant(isWebManifest(parsedManifest), "manifest has an invalid shape");
const manifest = parsedManifest;
const relativeFiles = files.map((file) =>
  path.relative(distDirectory, file).split(path.sep).join("/")
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

for (const link of html.matchAll(/<link\b[^>]*>/gu)) {
  const [tag] = link;
  if (!(tag.includes('rel="icon"') || tag.includes('rel="apple-touch-icon"'))) {
    continue;
  }
  const hrefMatch = /href="(?<href>[^"]+)"/u.exec(tag);
  const href = hrefMatch?.groups?.["href"];
  invariant(href !== undefined, `favicon link has no href: ${tag}`);
  assertPublicFile(href, `favicon ${href}`);
}
assertPublicFile("/favicon.ico", "favicon.ico");
assertPublicFile("/og-image.png", "Open Graph image");

const ogImage = await readFile(path.join(distDirectory, "og-image.png"));
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
  `Sitemap: ${new URL("/sitemap.xml", metadata.canonicalUrl).toString()}`,
  "robots sitemap"
);
assertContains(
  robots,
  siteIndexable ? "Allow: /" : "Disallow: /",
  "robots indexability"
);

const spritemapPath = path.join(distDirectory, "assets", "spritemap.svg");
const spritemap = await readFile(spritemapPath, "utf-8");
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
invariant(webfontCssPath !== undefined, "generated webfont CSS is missing");
const webfontCss = await readFile(webfontCssPath, "utf-8");
assertContains(webfontCss, "url(fonts/", "local webfont URL");
invariant(
  !/fonts\.(?:googleapis|gstatic)\.com/u.test(`${html}\n${webfontCss}`),
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
    existsSync(path.join(distDirectory, publicPath.slice(1))),
    `${label} does not exist`
  );
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return await collectFiles(entryPath);
      }

      return [entryPath];
    })
  );

  return nested.flat();
}

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

function hasStringProperty(value: object, property: string): boolean {
  return typeof Reflect.get(value, property) === "string";
}

function isManifestIcon(value: unknown): value is { src: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "src") === "string"
  );
}

function isWebManifest(value: unknown): value is WebManifest {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const icons: unknown = Reflect.get(value, "icons");
  return (
    hasStringProperty(value, "background_color") &&
    hasStringProperty(value, "description") &&
    hasStringProperty(value, "lang") &&
    hasStringProperty(value, "name") &&
    hasStringProperty(value, "short_name") &&
    hasStringProperty(value, "theme_color") &&
    Array.isArray(icons) &&
    icons.every((icon: unknown) => isManifestIcon(icon))
  );
}
function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Build verification failed: ${message}`);
  }
}
