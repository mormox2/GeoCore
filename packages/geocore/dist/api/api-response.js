import { GC_API_VERSION } from "./api-types.js";
/**
 * Creates a standard successful API response envelope.
 */
export function createApiResponse(data, options = {}) {
    const meta = {
        version: GC_API_VERSION,
        generatedAt: new Date().toISOString(),
        visibility: options.visibility ?? "public",
        total: options.total,
        count: Array.isArray(data) ? data.length : undefined,
    };
    return {
        status: "ok",
        data,
        meta,
    };
}
/**
 * Creates a list API response envelope.
 */
export function createApiListResponse(items, options = {}) {
    const meta = {
        version: GC_API_VERSION,
        generatedAt: new Date().toISOString(),
        visibility: options.visibility ?? "public",
        total: options.total ?? items.length,
        count: items.length,
    };
    return {
        status: "ok",
        data: items,
        meta,
    };
}
/**
 * Creates a not-found API response.
 */
export function createNotFoundResponse(id, visibility = "public") {
    return {
        status: "not-found",
        meta: {
            version: GC_API_VERSION,
            generatedAt: new Date().toISOString(),
            visibility,
        },
        error: `Resource '${id}' not found.`,
    };
}
/**
 * Creates a forbidden API response (private data access attempt).
 */
export function createForbiddenResponse(reason = "Access denied.") {
    return {
        status: "forbidden",
        meta: {
            version: GC_API_VERSION,
            generatedAt: new Date().toISOString(),
            visibility: "public",
        },
        error: reason,
    };
}
/**
 * Creates an error API response.
 */
export function createErrorResponse(message, visibility = "public") {
    return {
        status: "error",
        meta: {
            version: GC_API_VERSION,
            generatedAt: new Date().toISOString(),
            visibility,
        },
        error: message,
    };
}
