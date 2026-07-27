/** biome-ignore-all lint/suspicious/noConsole: Development logging required */
import { createApp } from "./app";
import { getRuntimeConfig } from "./config/env";

const config = getRuntimeConfig();
const app = createApp(config).listen(config.apiPort);

const serverUrl = app.server?.url;
if (serverUrl) {
  console.log("🚀 Server Information:");
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Server Port: ${config.apiPort}`);
  console.log(`   Backend URL: ${serverUrl}`);
  console.log(`   Swagger URL: ${serverUrl}docs/`);
} else {
  console.error("❌ Failed to start server");
  process.exit(1);
}
