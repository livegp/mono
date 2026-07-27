import { cors } from "@elysiajs/cors";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { getRuntimeConfig, type RuntimeConfig } from "./config/env";
import { swaggerConfig } from "./config/swagger";
import { greetRouter } from "./routes/greet";

export function createApp(config: RuntimeConfig = getRuntimeConfig()) {
  return new Elysia()
    .use(opentelemetry())
    .use(cors({ origin: config.corsOrigins }))
    .onAfterHandle(({ set }) => {
      set.headers["content-security-policy"] =
        "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; object-src 'none'; base-uri 'self'; frame-ancestors 'none'";
      set.headers["referrer-policy"] = "no-referrer";
      set.headers["x-content-type-options"] = "nosniff";
      set.headers["x-frame-options"] = "DENY";
    })
    .use(swagger(swaggerConfig))
    .onError(({ code, error, set }) => {
      if (code === "NOT_FOUND") {
        set.status = 404;
        return { success: false, error: "Not Found" };
      }

      if (code === "VALIDATION") {
        set.status = 422;
        return { success: false, error: "Validation Error" };
      }

      set.status = 500;
      return {
        success: false,
        error:
          config.nodeEnv !== "production" && error instanceof Error
            ? error.message
            : "Internal Server Error",
      };
    })
    .get("/api/health", () => ({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    }))
    .use(greetRouter);
}

export type App = ReturnType<typeof createApp>;
