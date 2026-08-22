import type { IncomingMessage } from "node:http";

export type AuthOptions = {
  apiKeys?: string[];
  adminKeys?: string[];
  requireAuthForInternal?: boolean;
};

export type AuthContext = {
  authenticated: boolean;
  isAdmin: boolean;
  apiKey?: string;
};

/**
 * Extracts and validates API key from incoming request headers or URL query params.
 */
export function authenticateRequest(
  req: IncomingMessage,
  options: AuthOptions = {}
): AuthContext {
  const { apiKeys = [], adminKeys = [], requireAuthForInternal = true } = options;

  if (apiKeys.length === 0 && adminKeys.length === 0 && !requireAuthForInternal) {
    return { authenticated: true, isAdmin: true };
  }

  // 1. Check Header 'x-api-key'
  let key: string | undefined = req.headers["x-api-key"] as string | undefined;

  // 2. Check Authorization 'Bearer <key>'
  if (!key && req.headers.authorization) {
    const auth = req.headers.authorization;
    if (auth.startsWith("Bearer ")) {
      key = auth.slice(7).trim();
    }
  }

  // 3. Check query param
  if (!key && req.url) {
    try {
      const url = new URL(req.url, "http://localhost");
      key = url.searchParams.get("apiKey") || undefined;
    } catch {
      // ignore malformed URL
    }
  }

  if (!key) {
    return { authenticated: false, isAdmin: false };
  }

  const isAdmin = adminKeys.includes(key);
  const isValid = isAdmin || apiKeys.includes(key);

  return {
    authenticated: isValid,
    isAdmin,
    apiKey: key,
  };
}
