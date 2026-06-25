import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { KnowledgeRelationship } from "../types/relationship.js";
import { KnowledgeEntity } from "../types/entity.js";
import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeCitation } from "../types/citation.js";
import { MediaAsset } from "../types/media.js";
import { SearchDocument } from "../types/search-document.js";
import { SearchDocumentVisibility } from "../types/search.js";
export type CreateSearchDocumentInput = {
    object: KnowledgeObject;
    metadata?: ResolvedMetadata;
    relationships?: KnowledgeRelationship[];
    entities?: KnowledgeEntity[];
    collections?: KnowledgeCollection[];
    citations?: KnowledgeCitation[];
    media?: MediaAsset[];
    visibility?: SearchDocumentVisibility;
};
/**
 * Creates a SearchDocument from a KnowledgeObject, enriching it with optional metadata,
 * relationships, and assets.
 */
export declare function createSearchDocumentFromKnowledgeObject(input: CreateSearchDocumentInput): SearchDocument;
