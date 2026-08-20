import type { ApiResponse, ApiListResponse, ApiStatus, ApiResponseMeta, ApiVisibility } from "./api-types.js";
import { GC_API_VERSION } from "./api-types.js";

/**
 * Creates a standard successful API response envelope.
 */
export function createApiResponse<T>(
  data: T,
  options: {
    visibility?: ApiVisibility;
    total?: number;
  } = {}
): ApiResponse<T> {
  const meta: ApiResponseMeta = {
    version: GC_API_VERSION,
    generatedAt: new Date().toISOString(),
    visibility: options.visibility ?? "public",
    total: options.total,
    count: Array.isArray(data) ? (data as unknown[]).length : undefined,
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
export function createApiListResponse<T>(
  items: T[],
  options: {
    visibility?: ApiVisibility;
    total?: number;
  } = {}
): ApiListResponse<T> {
  const meta: ApiResponseMeta = {
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
export function createNotFoundResponse(id: string, visibility: ApiVisibility = "public"): ApiResponse<never> {
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
export function createForbiddenResponse(reason: string = "Access denied."): ApiResponse<never> {
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
export function createErrorResponse(message: string, visibility: ApiVisibility = "public"): ApiResponse<never> {
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
