const DEFAULT_CORS_OPTIONS = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Api-Key", "X-Requested-With"],
    maxAge: 86400,
};
function resolveAllowedOrigin(configured, requestOrigin) {
    if (configured === false)
        return null;
    if (configured === undefined || configured === "*")
        return "*";
    if (typeof configured === "string")
        return configured;
    if (configured === true)
        return requestOrigin ?? null;
    return requestOrigin !== undefined && configured.includes(requestOrigin) ? requestOrigin : null;
}
/**
 * Applies CORS headers to an outgoing HTTP response and handles OPTIONS preflight.
 * Returns true if the request was an OPTIONS preflight and was handled.
 */
export function handleCors(req, res, options = {}) {
    const opts = { ...DEFAULT_CORS_OPTIONS, ...options };
    const requestOrigin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
    const origin = resolveAllowedOrigin(opts.origin, requestOrigin);
    if (Array.isArray(opts.origin) || opts.origin === true) {
        res.setHeader("Vary", "Origin");
    }
    if (origin !== null) {
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
        // Browsers reject credentials with a wildcard origin, so never advertise that combination.
        if (opts.credentials && origin !== "*") {
            res.setHeader("Access-Control-Allow-Credentials", "true");
        }
        if (opts.maxAge) {
            res.setHeader("Access-Control-Max-Age", String(opts.maxAge));
        }
    }
    if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return true;
    }
    return false;
}
