import type { SearchDocument } from "../types/search-document.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ApiSearchRequest, ApiListResponse } from "./api-types.js";
/**
 * Searches the dataset for knowledge objects matching the query.
 * Only returns public, published knowledge when visibility is 'public'.
 */
export declare function searchKnowledge(dataset: KnowledgeDataset, request: ApiSearchRequest): ApiListResponse<SearchDocument>;
