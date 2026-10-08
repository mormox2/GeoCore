import type { IncomingMessage, ServerResponse } from "node:http";
export type CorsOptions = {
    /**
     * - `"*"` or a single origin string: sent as-is.
     * - `string[]`: the request origin is echoed back only when it is in the list.
     * - `true`: the request origin is echoed back.
     * - `false`: no CORS headers are sent.
     */
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
