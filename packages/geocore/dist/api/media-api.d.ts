import type { MediaAsset } from "../types/media.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ApiGetRequest, ApiListRequest, ApiResponse, ApiListResponse } from "./api-types.js";
/**
 * Returns a single Media Asset by ID, respecting visibility rules.
 */
export declare function getMedia(dataset: KnowledgeDataset, request: ApiGetRequest): ApiResponse<MediaAsset>;
/**
 * Returns a list of media assets, respecting visibility rules.
 */
export declare function listMedia(dataset: KnowledgeDataset, request?: ApiListRequest): ApiListResponse<MediaAsset>;
