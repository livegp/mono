const DEFAULT_API_PORT = 9001;
const DEFAULT_CORS_ORIGIN = "http://localhost:9000";
const SUPPORTED_NODE_ENVS = ["development", "production", "test"] as const;

export type NodeEnv = (typeof SUPPORTED_NODE_ENVS)[number];

export interface RuntimeConfig {
  apiPort: number;
  corsOrigins: string[];
  nodeEnv: NodeEnv;
}

const parseApiPort = (value: string | undefined): number => {
  const port = Number(value ?? DEFAULT_API_PORT);

  if (!Number.isInteger(port) || port < 1000 || port > 9999) {
    throw new Error("API_PORT must be an integer between 1000 and 9999");
  }

  return port;
};

const parseCorsOrigins = (value: string | undefined): string[] => {
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
};

const isNodeEnv = (value: string): value is NodeEnv =>
  SUPPORTED_NODE_ENVS.some((supportedNodeEnv) => supportedNodeEnv === value);

const parseNodeEnv = (nodeEnv: string | undefined = "development"): NodeEnv => {
  if (!isNodeEnv(nodeEnv)) {
    throw new Error(
      `NODE_ENV must be one of: ${SUPPORTED_NODE_ENVS.join(", ")}`
    );
  }

  return nodeEnv;
};

export const getRuntimeConfig = (
  environment: NodeJS.ProcessEnv = process.env
): RuntimeConfig => ({
  apiPort: parseApiPort(environment["API_PORT"]),
  corsOrigins: parseCorsOrigins(environment["CORS_ORIGIN"]),
  nodeEnv: parseNodeEnv(environment.NODE_ENV),
});
