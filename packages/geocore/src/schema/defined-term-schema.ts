import { GlossaryEntry } from "../types/glossary.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { JsonLdObject } from "../types/json-ld.js";
import { omitUndefined } from "./schema-utils.js";

/**
 * Creates a Schema.org DefinedTerm JSON-LD object.
 */
export function createDefinedTermSchema(input: {
  glossary: GlossaryEntry;
  metadata?: ResolvedMetadata;
}): JsonLdObject {
  const { glossary } = input;

  const base: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: glossary.term,
    description: glossary.definition,
    termCode: glossary.id,
    inDefinedTermSet: glossary.canonicalUrl || undefined,
    identifier: glossary.entityId || undefined,
    sameAs: glossary.entityId ? `entity:${glossary.entityId}` : undefined,
  };

  return omitUndefined(base) as JsonLdObject;
}
