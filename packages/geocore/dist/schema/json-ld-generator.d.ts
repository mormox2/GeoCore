import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { KnowledgeRelationship } from "../types/relationship.js";
import { KnowledgeEntity } from "../types/entity.js";
import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeCitation } from "../types/citation.js";
import { KnowledgeSource } from "../types/citation.js";
import { MediaAsset } from "../types/media.js";
import { BreadcrumbItem } from "./breadcrumb-schema.js";
import { SchemaOutput } from "../types/schema.js";
export type GenerateJsonLdInput = {
    object: KnowledgeObject;
    metadata?: ResolvedMetadata;
    relationships?: KnowledgeRelationship[];
    entities?: KnowledgeEntity[];
    collections?: KnowledgeCollection[];
    citations?: KnowledgeCitation[];
    sources?: KnowledgeSource[];
    media?: MediaAsset[];
    breadcrumbs?: BreadcrumbItem[];
    schemaType?: string;
};
/**
 * Generates SchemaOutput containing a JSON-LD object for a KnowledgeObject and its dependencies.
 */
export declare function generateJsonLd(input: GenerateJsonLdInput): SchemaOutput;
