import type { ApiResponse, ApiListResponse, ApiVisibility } from "./api-types.js";
/**
 * Creates a standard successful API response envelope.
 */
export declare function createApiResponse<T>(data: T, options?: {
    visibility?: ApiVisibility;
    total?: number;
}): ApiResponse<T>;
/**
 * Creates a list API response envelope.
 */
export declare function createApiListResponse<T>(items: T[], options?: {
    visibility?: ApiVisibility;
    total?: number;
}): ApiListResponse<T>;
/**
 * Creates a not-found API response.
 */
export declare function createNotFoundResponse(id: string, visibility?: ApiVisibility): ApiResponse<never>;
/**
 * Creates a forbidden API response (private data access attempt).
 */
export declare function createForbiddenResponse(reason?: string): ApiResponse<never>;
/**
 * Creates an error API response.
 */
export declare function createErrorResponse(message: string, visibility?: ApiVisibility): ApiResponse<never>;
