import type { IncomingMessage, ServerResponse } from "node:http";
export type CorsOptions = {
    origin?: string | string[] | boolean;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
};
/**
 * Applies CORS headers to an outgoing HTTP response and handles OPTIONS preflight.
 * Returns true if the request was an OPTIONS preflight and was handled.
 */
export declare function handleCors(req: IncomingMessage, res: ServerResponse, options?: CorsOptions): boolean;
