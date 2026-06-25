import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
export type SchemaMappingInput = {
    object: KnowledgeObject;
    metadata?: ResolvedMetadata;
    taxonomy?: string[];
    objectType?: string;
};
/**
 * Determines the appropriate Schema.org type for a KnowledgeObject.
 */
export declare function mapKnowledgeObjectToSchemaType(input: SchemaMappingInput): string;
