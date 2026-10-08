import { timingSafeEqual } from "node:crypto";
/**
 * Extracts and validates API key from incoming request headers or URL query params.
 */
export function authenticateRequest(req, options = {}) {
    const { apiKeys = [], adminKeys = [], requireAuthForInternal = true } = options;
    if (apiKeys.length === 0 && adminKeys.length === 0 && !requireAuthForInternal) {
        return { authenticated: true, isAdmin: true };
    }
    // 1. Check Header 'x-api-key'
    let key = req.headers["x-api-key"];
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
        }
        catch {
            // ignore malformed URL
        }
    }
    if (!key) {
        return { authenticated: false, isAdmin: false };
    }
    const isAdmin = containsKey(adminKeys, key);
    const isValid = isAdmin || containsKey(apiKeys, key);
    return {
        authenticated: isValid,
        isAdmin,
        apiKey: key,
    };
}
function safeEqual(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
/** Constant-time membership check so response timing does not reveal key prefixes. */
function containsKey(keys, candidate) {
    let found = false;
    for (const k of keys) {
        if (safeEqual(k, candidate))
            found = true;
    }
    return found;
}
