/** biome-ignore-all lint/complexity/useLiteralKeys: NodeJS.ProcessEnv requires indexed access */

const DEFAULT_API_PORT = 9001;
const DEFAULT_CORS_ORIGIN = "http://localhost:9000";
const SUPPORTED_NODE_ENVS = ["development", "production", "test"] as const;

export type NodeEnv = (typeof SUPPORTED_NODE_ENVS)[number];

export interface RuntimeConfig {
  apiPort: number;
  corsOrigins: string[];
  nodeEnv: NodeEnv;
}

function parseApiPort(value: string | undefined): number {
  const port = Number(value ?? DEFAULT_API_PORT);

  if (!Number.isInteger(port) || port < 1000 || port > 9999) {
    throw new Error("API_PORT must be an integer between 1000 and 9999");
  }

  return port;
}

function parseCorsOrigins(value: string | undefined): string[] {
  const origins = (value ?? DEFAULT_CORS_ORIGIN)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error("CORS_ORIGIN must contain at least one URL");
  }

  for (const origin of origins) {
    if (!URL.canParse(origin)) {
      throw new Error(`CORS_ORIGIN contains an invalid URL: ${origin}`);
    }
  }

  return origins;
}

function parseNodeEnv(value: string | undefined): NodeEnv {
  const nodeEnv = value ?? "development";

  if (!SUPPORTED_NODE_ENVS.includes(nodeEnv as NodeEnv)) {
    throw new Error(
      `NODE_ENV must be one of: ${SUPPORTED_NODE_ENVS.join(", ")}`
    );
  }

  return nodeEnv as NodeEnv;
}

export function getRuntimeConfig(
  environment: NodeJS.ProcessEnv = process.env
): RuntimeConfig {
  return {
    apiPort: parseApiPort(environment["API_PORT"]),
    corsOrigins: parseCorsOrigins(environment["CORS_ORIGIN"]),
    nodeEnv: parseNodeEnv(environment.NODE_ENV),
  };
}
