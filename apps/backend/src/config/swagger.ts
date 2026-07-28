import { getProjectMetadata, projectConfig } from "@mono/config/project";

const metadata = getProjectMetadata();

export const swaggerConfig = {
  documentation: {
    info: {
      contact: {
        email: "",
        name: projectConfig.author.name,
        url: projectConfig.author.url,
      },
      description: metadata.description,
      title: `${projectConfig.identity.name} API`,
      version: projectConfig.api.version,
    },
    openapi: "3.0.0",
    tags: [],
  },
  path: projectConfig.api.docsPath,
};
