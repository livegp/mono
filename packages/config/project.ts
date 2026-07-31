export type ProjectLocale = "en-US" | "uk-UA";

export interface LocalizedProjectMetadata {
  description: string;
  title: string;
}

export interface ProjectConfig {
  api: {
    docsPath: string;
    version: string;
  };
  author: {
    name: string;
    url: string;
  };
  branding: {
    backgroundColor: string;
    faviconDevUrl: string;
    faviconSource: string;
    ogImagePath: string;
    ogImageSource: string;
    themeColor: string;
  };
  fonts: {
    family: string;
    providerCssUrl: string;
    subsets: readonly string[];
    weights: readonly number[];
  };
  identity: {
    name: string;
    shortName: string;
  };
  locales: {
    active: readonly ProjectLocale[];
    content: Readonly<Record<ProjectLocale, LocalizedProjectMetadata>>;
    default: ProjectLocale;
    supported: readonly ProjectLocale[];
  };
  routes: readonly string[];
}

export interface SiteMetadata extends LocalizedProjectMetadata {
  authorName: string;
  authorUrl: string;
  canonicalUrl: string;
  htmlLocale: ProjectLocale;
  ogImageUrl: string;
  ogLocale: string;
}

export const projectConfig = {
  api: {
    docsPath: "/docs",
    version: "1.0.0",
  },
  author: {
    name: "Oleksandr Pishta",
    url: "https://livegp.github.io",
  },
  branding: {
    backgroundColor: "#fff",
    faviconDevUrl: "/src/assets/branding/favicon.svg",
    faviconSource: "src/assets/branding/favicon.svg",
    ogImagePath: "/og-image.png",
    ogImageSource: "src/assets/branding/og-image.png",
    themeColor: "#fff",
  },
  fonts: {
    family: "Roboto",
    providerCssUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
    subsets: ["latin", "cyrillic"],
    weights: [400, 500, 700],
  },
  identity: {
    name: "Mono",
    shortName: "mono",
  },
  locales: {
    active: ["uk-UA"],
    content: {
      "en-US": {
        description:
          "Mono is a Bun and TypeScript starter monorepo with React, Elysia, shared UI, and Storybook.",
        title: "Mono",
      },
      "uk-UA": {
        description:
          "Mono — стартове монорепо на Bun і TypeScript з React, Elysia, спільним UI та Storybook.",
        title: "Mono",
      },
    },
    default: "uk-UA",
    supported: ["uk-UA", "en-US"],
  },
  routes: ["/"],
} as const satisfies ProjectConfig;

export const getProjectMetadata = (
  locale: ProjectLocale = projectConfig.locales.default
): LocalizedProjectMetadata => projectConfig.locales.content[locale];

export const resolveSiteMetadata = (
  origin: string,
  locale: ProjectLocale = projectConfig.locales.default
): SiteMetadata => {
  const baseUrl = new URL(origin);
  baseUrl.hash = "";
  baseUrl.search = "";
  baseUrl.pathname = "/";

  const localized = getProjectMetadata(locale);

  return {
    ...localized,
    authorName: projectConfig.author.name,
    authorUrl: projectConfig.author.url,
    canonicalUrl: baseUrl.toString(),
    htmlLocale: locale,
    ogImageUrl: new URL(projectConfig.branding.ogImagePath, baseUrl).toString(),
    ogLocale: locale.replace("-", "_"),
  };
};
