import { cors } from "@elysiajs/cors";
import { opentelemetry } from '@elysiajs/opentelemetry'
import { swagger } from "@elysiajs/swagger";
import { env } from "@yolk-oss/elysia-env";
import { Elysia } from "elysia";
import { elysiaHelmet } from "elysiajs-helmet";

import { helmetConfig } from "./config/helmet";
import { swaggerConfig } from "./config/swagger";
import { greetRouter } from './routes/greet'
import { envSchema } from "./schemas/env";

const app = new Elysia()
  .use(env(envSchema))
  .use(opentelemetry())
  .use(cors())
  .use(elysiaHelmet(helmetConfig))
  .use(swagger(swaggerConfig))
  .use(greetRouter)
  .onError(({ code, error, set }) => {
    console.error(`Error [${code}]:`, error);
    set.status = code === 'NOT_FOUND' ? 404 : 500;
    return {
      success: false,
      error: process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : error.message
    };
  })
  .listen(Number(process.env['VITE_API_PORT']));

const serverUrl = app.server?.url;
if (serverUrl) {
  console.log('🚀 Server Information:');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Server Port: ${process.env['VITE_API_PORT']}`);
  console.log(`   Backend URL: ${serverUrl}`);
  console.log(`   Swagger URL: ${serverUrl}docs/`);
} else {
  console.error('❌ Failed to start server');
  process.exit(1);
}

export type App = typeof app
