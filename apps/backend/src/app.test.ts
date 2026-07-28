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

function expectSecurityHeaders(response: Response) {
  expect(response.headers.get("content-security-policy")).toContain(
    "default-src 'self'"
  );
  expect(response.headers.get("cross-origin-opener-policy")).toBe(
    "same-origin"
  );
  expect(response.headers.get("cross-origin-resource-policy")).toBe(
    "same-origin"
  );
  expect(response.headers.get("origin-agent-cluster")).toBeNull();
  expect(response.headers.get("permissions-policy")).toBe(
    "camera=(), microphone=(), geolocation=()"
  );
  expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  expect(response.headers.get("strict-transport-security")).toBeNull();
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(response.headers.get("x-dns-prefetch-control")).toBe("off");
  expect(response.headers.get("x-download-options")).toBe("noopen");
  expect(response.headers.get("x-frame-options")).toBe("DENY");
  expect(response.headers.get("x-permitted-cross-domain-policies")).toBe(
    "none"
  );
  expect(response.headers.get("x-powered-by")).toBeNull();
  expect(response.headers.get("x-xss-protection")).toBe("0");
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
    expectSecurityHeaders(response);
  });

  test("returns a typed greeting", async () => {
    const response = await createTestApp().handle(
      new Request("http://localhost/api/greet/Vite")
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: "Hello, Vite!" });
    expectSecurityHeaders(response);
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
    expectSecurityHeaders(response);
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
    expectSecurityHeaders(response);
  });

  test("returns security headers for internal errors", async () => {
    const response = await createTestApp()
      .get("/api/test-error", () => {
        throw new Error("Expected test error");
      })
      .handle(new Request("http://localhost/api/test-error"));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Expected test error",
      success: false,
    });
    expectSecurityHeaders(response);
  });
});
