import type { KnowledgeCitation, KnowledgeSource } from "../types/citation.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ApiGetRequest, ApiListRequest, ApiResponse, ApiListResponse } from "./api-types.js";
/**
 * Returns a single Knowledge Source by ID, respecting visibility rules.
 */
export declare function getSource(dataset: KnowledgeDataset, request: ApiGetRequest): ApiResponse<KnowledgeSource>;
/**
 * Returns a list of Knowledge Sources, respecting visibility rules.
 */
export declare function listSources(dataset: KnowledgeDataset, request?: ApiListRequest): ApiListResponse<KnowledgeSource>;
/**
 * Returns a single Knowledge Citation by ID.
 */
export declare function getCitation(dataset: KnowledgeDataset, request: ApiGetRequest): ApiResponse<KnowledgeCitation>;
/**
 * Returns a list of citations for a specific target or all active citations.
 */
export declare function listCitations(dataset: KnowledgeDataset, request?: ApiListRequest & {
    targetId?: string;
    sourceId?: string;
}): ApiListResponse<KnowledgeCitation>;
