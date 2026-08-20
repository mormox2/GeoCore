export type ApiVisibility = "public" | "internal";
export type ApiListRequest = {
    visibility?: ApiVisibility;
    language?: string;
    status?: string;
    limit?: number;
    offset?: number;
};
export type ApiGetRequest = {
    id: string;
    visibility?: ApiVisibility;
};
export type ApiSearchRequest = {
    query: string;
    visibility?: ApiVisibility;
    language?: string;
    limit?: number;
};
export type ApiContextRequest = {
    objectId: string;
    visibility?: ApiVisibility;
};
export type ApiStatus = "ok" | "not-found" | "error" | "forbidden";
export type ApiResponseMeta = {
    version: string;
    generatedAt: string;
    visibility: ApiVisibility;
    total?: number;
    count?: number;
};
export type ApiResponse<T> = {
    status: ApiStatus;
    data?: T;
    meta: ApiResponseMeta;
    error?: string;
};
export type ApiListResponse<T> = ApiResponse<T[]>;
export declare const GC_API_VERSION = "1.0.0";
