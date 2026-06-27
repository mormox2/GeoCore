/**
 * Determines the appropriate Schema.org type for a KnowledgeObject.
 */
export function mapKnowledgeObjectToSchemaType(input) {
    const { object, metadata, objectType } = input;
    // 1. If explicit overrides exist
    if (objectType) {
        return objectType;
    }
    // 2. If explicit metadata schema type exists, use it.
    const explicitType = metadata?.schemaType || object.metadata?.schemaType;
    if (explicitType) {
        return explicitType;
    }
    // 3. If object is FAQ-like, use FAQPage
    const contentType = object.metadata?.contentType || metadata?.contentType;
    const isFaq = contentType === "faq" ||
        object.type === "faq" ||
        metadata?.topics?.includes("faq");
    if (isFaq) {
        return "FAQPage";
    }
    // 4. If object is glossary-like, use DefinedTerm
    const isGlossary = contentType === "glossary" ||
        object.type === "glossary-entry";
    if (isGlossary) {
        return "DefinedTerm";
    }
    // 5. If object is collection-like, use CollectionPage
    const isCollection = contentType === "collection" ||
        object.type === "collection";
    if (isCollection) {
        return "CollectionPage";
    }
    // Default to Article
    return "Article";
}
