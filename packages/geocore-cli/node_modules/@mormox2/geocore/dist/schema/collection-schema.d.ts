import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeObject } from "../types/knowledge-object.js";
import { JsonLdObject } from "../types/json-ld.js";
/**
 * Creates a Schema.org CollectionPage JSON-LD object.
 */
export declare function createCollectionSchema(input: {
    collection: KnowledgeCollection;
    objects?: KnowledgeObject[];
}): JsonLdObject;
