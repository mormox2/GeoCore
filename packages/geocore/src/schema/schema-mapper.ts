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
export function mapKnowledgeObjectToSchemaType(input: SchemaMappingInput): string {
  const { object, metadata, objectType } = input;

  // 1. If explicit overrides exist
  if (objectType) {
    return objectType;
  }

  // 2. If explicit metadata schema type exists, use it.
  const explicitType = (metadata as any)?.schemaType || (object.metadata as any)?.schemaType;
  if (explicitType) {
    return explicitType;
  }

  // 3. If object is FAQ-like, use FAQPage
  const contentType = (object.metadata as any)?.contentType || (metadata as any)?.contentType;
  const isFaq =
    contentType === "faq" ||
    (object as any).type === "faq" ||
    metadata?.topics?.includes("faq");
  if (isFaq) {
    return "FAQPage";
  }

  // 4. If object is glossary-like, use DefinedTerm
  const isGlossary =
    contentType === "glossary" ||
    (object as any).type === "glossary-entry";
  if (isGlossary) {
    return "DefinedTerm";
  }

  // 5. If object is collection-like, use CollectionPage
  const isCollection =
    contentType === "collection" ||
    (object as any).type === "collection";
  if (isCollection) {
    return "CollectionPage";
  }

  // Default to Article
  return "Article";
}
