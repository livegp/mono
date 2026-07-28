import { cors } from "@elysiajs/cors";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { getRuntimeConfig, type RuntimeConfig } from "./config/env";
import { securityHeaders } from "./config/helmet";
import { swaggerConfig } from "./config/swagger";
import { greetRouter } from "./routes/greet";

export function createApp(config: RuntimeConfig = getRuntimeConfig()) {
  return new Elysia()
    .use(opentelemetry())
    .use(cors({ origin: config.corsOrigins }))
    .use(securityHeaders(config))
    .use(swagger(swaggerConfig))
    .onError(({ code, error, set }) => {
      if (code === "NOT_FOUND") {
        set.status = 404;
        return { error: "Not Found", success: false };
      }

      if (code === "VALIDATION") {
        set.status = 422;
        return { error: "Validation Error", success: false };
      }

      set.status = 500;
      return {
        error:
          config.nodeEnv !== "production" && error instanceof Error
            ? error.message
            : "Internal Server Error",
        success: false,
      };
    })
    .get("/api/health", () => ({
      environment: config.nodeEnv,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }))
    .use(greetRouter);
}

export type App = ReturnType<typeof createApp>;
