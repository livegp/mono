import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";

import type { RuntimeConfig } from "./env";

type HelmetOptions = NonNullable<Parameters<typeof helmet>[0]>;

const PERMISSIONS_POLICY = "camera=(), microphone=(), geolocation=()";

export function securityHeaders(config: RuntimeConfig) {
  const options = {
    contentSecurityPolicy: {
      directives: {
        "base-uri": ["'self'"],
        "connect-src": ["'self'"],
        "default-src": ["'self'"],
        "font-src": ["'self'", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "https://cdn.jsdelivr.net"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "upgrade-insecure-requests":
          config.nodeEnv === "production" ? [] : null,
      },
      useDefaults: false,
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    // elysia-helmet 3.1.0 writes Origin-Agent-Cluster into the CORP header.
    originAgentCluster: false,
    referrerPolicy: { policy: "no-referrer" },
    seed: config.nodeEnv,
    // TLS terminates at the deployment ingress, which owns HSTS.
    strictTransportSecurity: false,
    xContentTypeOptions: true,
    xDnsPrefetchControl: { allow: false },
    xDownloadOptions: true,
    xFrameOptions: { action: "deny" },
    xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
    xPoweredBy: true,
    xXssProtection: true,
  } satisfies HelmetOptions;

  return new Elysia({ name: "mono-security-headers", seed: config.nodeEnv })
    .use(helmet(options))
    .onRequest(({ set }) => {
      set.headers["permissions-policy"] = PERMISSIONS_POLICY;
    });
}
