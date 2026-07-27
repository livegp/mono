/** biome-ignore-all lint/complexity/useLiteralKeys: Response JSON is intentionally checked as unknown data */

import { describe, expect, test } from "bun:test";

import { createApp } from "./app";
import type { RuntimeConfig } from "./config/env";

const testConfig: RuntimeConfig = {
  apiPort: 9001,
  corsOrigins: ["http://localhost:9000"],
  nodeEnv: "test",
};

function createTestApp() {
  return createApp(testConfig);
}

describe("backend API", () => {
  test("returns health information", async () => {
    const response = await createTestApp().handle(
      new Request("http://localhost/api/health")
    );
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      environment: "test",
      status: "healthy",
    });
    expect(body["timestamp"]).toBeString();
    expect(body["uptime"]).toBeNumber();
  });

  test("returns a typed greeting", async () => {
    const response = await createTestApp().handle(
      new Request("http://localhost/api/greet/Vite")
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Hello, Vite!" });
  });

  test("rejects a blank greeting name", async () => {
    const response = await createTestApp().handle(
      new Request("http://localhost/api/greet/%20")
    );

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error: "Validation Error",
      success: false,
    });
  });

  test("returns a stable error for unknown routes", async () => {
    const response = await createTestApp().handle(
      new Request("http://localhost/api/unknown")
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Not Found",
      success: false,
    });
  });
});
