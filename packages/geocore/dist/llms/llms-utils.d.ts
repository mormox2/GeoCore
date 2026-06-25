import { LlmsOutputType } from "../types/llms-output.js";
import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { KnowledgeRelationship } from "../types/relationship.js";
/**
 * Creates a deterministic LLMs output ID.
 */
export declare function createLlmsOutputId(type: LlmsOutputType, siteName: string, language?: string): string;
/**
 * Checks if the KnowledgeObject is public and published.
 */
export declare function isLlmsPublicObject(object: KnowledgeObject): boolean;
/**
 * Deduplicates string arrays while preserving order.
 */
export declare function dedupeLlmsValues(values?: string[]): string[];
/**
 * Extracts entities from object metadata and graph relationships.
 */
export declare function extractLlmsEntities(object: KnowledgeObject, metadata?: ResolvedMetadata, relationships?: KnowledgeRelationship[]): string[];
/**
 * Extracts citations from object metadata and graph relationships.
 */
export declare function extractLlmsCitations(object: KnowledgeObject, metadata?: ResolvedMetadata, relationships?: KnowledgeRelationship[]): string[];
