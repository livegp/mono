import { defineConfig } from "@julr/vite-plugin-validate-env";
import { length, nonEmpty, optional, pipe, regex, string, url } from "valibot";

export default defineConfig({
  validator: "standard",
  schema: {
    VITE_WEB_PORT: optional(
      pipe(
        string("VITE_WEB_PORT must be a string"),
        nonEmpty("VITE_WEB_PORT must not be empty"),
        length(4, "VITE_WEB_PORT must be 4 characters long"),
        regex(/^\d+$/, "VITE_WEB_PORT must be a number")
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
    VITE_API_URL: optional(
      pipe(
        string("VITE_API_URL must be a string"),
        nonEmpty("VITE_API_URL must not be empty"),
        url("VITE_API_URL must be a valid URL")
      ),
      "http://localhost:9001"
    ),
  },
});
