import type { IncomingMessage, ServerResponse } from "node:http";

export type CorsOptions = {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
};

const DEFAULT_CORS_OPTIONS: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Api-Key", "X-Requested-With"],
  maxAge: 86400,
};

/**
 * Applies CORS headers to an outgoing HTTP response and handles OPTIONS preflight.
 * Returns true if the request was an OPTIONS preflight and was handled.
 */
export function handleCors(
  req: IncomingMessage,
  res: ServerResponse,
  options: CorsOptions = {}
): boolean {
  const opts = { ...DEFAULT_CORS_OPTIONS, ...options };
  const origin = typeof opts.origin === "string" ? opts.origin : "*";

  res.setHeader("Access-Control-Allow-Origin", origin);

  if (opts.methods) {
    res.setHeader("Access-Control-Allow-Methods", opts.methods.join(", "));
  }
  if (opts.allowedHeaders) {
    res.setHeader("Access-Control-Allow-Headers", opts.allowedHeaders.join(", "));
  }
  if (opts.exposedHeaders) {
    res.setHeader("Access-Control-Expose-Headers", opts.exposedHeaders.join(", "));
  }
  if (opts.credentials) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  if (opts.maxAge) {
    res.setHeader("Access-Control-Max-Age", String(opts.maxAge));
  }

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }

  return false;
}
