import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ApiGetRequest, ApiListRequest, ApiResponse, ApiListResponse } from "./api-types.js";
/**
 * Returns a single Knowledge Object by ID, respecting visibility rules.
 * Public API must only expose published objects.
 */
export declare function getKnowledgeObject(dataset: KnowledgeDataset, request: ApiGetRequest): ApiResponse<KnowledgeObject>;
/**
 * Returns a list of Knowledge Objects, respecting visibility rules.
 */
export declare function listKnowledgeObjects(dataset: KnowledgeDataset, request?: ApiListRequest): ApiListResponse<KnowledgeObject>;
