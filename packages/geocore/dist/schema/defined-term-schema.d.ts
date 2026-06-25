import { GlossaryEntry } from "../types/glossary.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { JsonLdObject } from "../types/json-ld.js";
/**
 * Creates a Schema.org DefinedTerm JSON-LD object.
 */
export declare function createDefinedTermSchema(input: {
    glossary: GlossaryEntry;
    metadata?: ResolvedMetadata;
}): JsonLdObject;
