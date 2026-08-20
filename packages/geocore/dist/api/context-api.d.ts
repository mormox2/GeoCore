import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { KnowledgeRelationship } from "../types/relationship.js";
import type { KnowledgeCitation, KnowledgeSource } from "../types/citation.js";
import type { ResolvedMetadata } from "../types/metadata.js";
import type { ApiContextRequest, ApiResponse } from "./api-types.js";
/**
 * AI Context Package — a structured bundle of knowledge for AI consumption.
 * Contains the Knowledge Object, its metadata, related entities, relationships, and citations.
 */
export type AiContextPackage = {
    object: KnowledgeObject;
    metadata: ResolvedMetadata;
    entities: KnowledgeEntity[];
    relationships: KnowledgeRelationship[];
    citations: KnowledgeCitation[];
    sources: KnowledgeSource[];
    relatedObjectIds: string[];
    generatedAt: string;
};
/**
 * Builds an AI Context Package for a specific Knowledge Object.
 * This is the primary endpoint for AI/RAG consumption.
 */
export declare function getAiContext(dataset: KnowledgeDataset, request: ApiContextRequest): ApiResponse<AiContextPackage>;
