import { omitUndefined } from "./schema-utils.js";
/**
 * Creates a Schema.org DefinedTerm JSON-LD object.
 */
export function createDefinedTermSchema(input) {
    const { glossary } = input;
    const base = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: glossary.term,
        description: glossary.definition,
        termCode: glossary.id,
        inDefinedTermSet: glossary.canonicalUrl || undefined,
        identifier: glossary.entityId || undefined,
        sameAs: glossary.entityId ? `entity:${glossary.entityId}` : undefined,
    };
    return omitUndefined(base);
}
