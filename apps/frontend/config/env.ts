import { defineConfig } from "@julr/vite-plugin-validate-env";
import { length, nonEmpty, optional, pipe, regex, string, url } from "valibot";

export default defineConfig({
  schema: {
    VITE_API_URL: optional(
      pipe(
        string("VITE_API_URL must be a string"),
        nonEmpty("VITE_API_URL must not be empty"),
        url("VITE_API_URL must be a valid URL")
      ),
      "http://localhost:9001"
    ),
    VITE_SITE_INDEXABLE: optional(
      pipe(
        string("VITE_SITE_INDEXABLE must be a string"),
        regex(
          /^(?:true|false)$/u,
          "VITE_SITE_INDEXABLE must be either true or false"
        )
      ),
      "false"
    ),
    VITE_WEB_PORT: optional(
      pipe(
        string("VITE_WEB_PORT must be a string"),
        nonEmpty("VITE_WEB_PORT must not be empty"),
        length(4, "VITE_WEB_PORT must be 4 characters long"),
        regex(/^\d+$/u, "VITE_WEB_PORT must be a number")
      ),
      "9000"
    ),
    VITE_WEB_URL: optional(
      pipe(
        string("VITE_WEB_URL must be a string"),
        nonEmpty("VITE_WEB_URL must not be empty"),
        url("VITE_WEB_URL must be a valid URL")
      ),
      "http://localhost:9000"
    ),
  },
  validator: "standard",
});
