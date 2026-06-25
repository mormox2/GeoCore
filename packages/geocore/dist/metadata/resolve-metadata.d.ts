import { KnowledgeObject } from "../types/knowledge-object.js";
import { GraphRegistry } from "../types/graph.js";
import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeEntity } from "../types/entity.js";
import { KnowledgeCitation } from "../types/citation.js";
import { GeoCoreMetadata, ResolvedMetadata } from "../types/metadata.js";
export type ResolveMetadataInput = {
    object: KnowledgeObject;
    graph?: GraphRegistry;
    collections?: KnowledgeCollection[];
    entities?: KnowledgeEntity[];
    citations?: KnowledgeCitation[];
    defaults?: Partial<GeoCoreMetadata>;
};
export declare function resolveMetadata(input: ResolveMetadataInput): ResolvedMetadata;
