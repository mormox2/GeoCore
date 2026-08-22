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
export declare function authenticateRequest(req: IncomingMessage, options?: AuthOptions): AuthContext;
