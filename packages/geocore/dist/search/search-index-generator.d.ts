import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { KnowledgeRelationship } from "../types/relationship.js";
import { KnowledgeEntity } from "../types/entity.js";
import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeCitation } from "../types/citation.js";
import { MediaAsset } from "../types/media.js";
import { SearchIndex } from "../types/search-index.js";
export type GenerateSearchIndexInput = {
    id: string;
    name: string;
    objects: KnowledgeObject[];
    metadata?: Record<string, ResolvedMetadata>;
    relationships?: KnowledgeRelationship[];
    entities?: KnowledgeEntity[];
    collections?: KnowledgeCollection[];
    citations?: KnowledgeCitation[];
    media?: MediaAsset[];
    visibility?: "public" | "internal";
    language?: string;
};
/**
 * Generates a SearchIndex from a list of KnowledgeObjects and related assets,
 * applying visibility and language filters, and compiling diagnostics.
 */
export declare function generateSearchIndex(input: GenerateSearchIndexInput): SearchIndex;
