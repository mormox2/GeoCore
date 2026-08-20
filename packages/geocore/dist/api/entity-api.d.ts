import type { KnowledgeEntity } from "../types/entity.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ApiGetRequest, ApiListRequest, ApiResponse, ApiListResponse } from "./api-types.js";
/**
 * Returns a single Entity by ID, respecting visibility rules.
 */
export declare function getEntity(dataset: KnowledgeDataset, request: ApiGetRequest): ApiResponse<KnowledgeEntity>;
/**
 * Returns a list of entities, respecting visibility rules.
 */
export declare function listEntities(dataset: KnowledgeDataset, request?: ApiListRequest): ApiListResponse<KnowledgeEntity>;
