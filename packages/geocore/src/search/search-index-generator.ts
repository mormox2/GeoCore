import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { KnowledgeRelationship } from "../types/relationship.js";
import { KnowledgeEntity } from "../types/entity.js";
import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeCitation } from "../types/citation.js";
import { MediaAsset } from "../types/media.js";
import { SearchIndex } from "../types/search-index.js";
import { SearchDocument } from "../types/search-document.js";
import { SearchIndexDiagnostic } from "../types/search.js";
import { createSearchDocumentFromKnowledgeObject } from "./search-document.js";
import { filterSearchDocuments } from "./search-filter.js";
import { validateSearchDocument } from "./validate-search-document.js";
import * as codes from "../validation/validation-codes.js";

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
export function generateSearchIndex(input: GenerateSearchIndexInput): SearchIndex {
  const {
    id,
    name,
    objects,
    metadata = {},
    relationships = [],
    entities = [],
    collections = [],
    citations = [],
    media = [],
    visibility,
    language,
  } = input;

  const diagnostics: SearchIndexDiagnostic[] = [];

  // 1. Validate index header
  if (!id || id.trim() === "") {
    diagnostics.push({
      id: `${codes.GC_SEARCH_INDEX_ID_MISSING}_idx`,
      severity: "error",
      code: codes.GC_SEARCH_INDEX_ID_MISSING,
      message: "Search index ID is missing.",
      field: "id",
      recommendation: "Provide a unique ID for this search index.",
    });
  }

  if (!name || name.trim() === "") {
    diagnostics.push({
      id: `${codes.GC_SEARCH_INDEX_NAME_MISSING}_idx`,
      severity: "error",
      code: codes.GC_SEARCH_INDEX_NAME_MISSING,
      message: "Search index name is missing.",
      field: "name",
      recommendation: "Provide a descriptive name for this search index.",
    });
  }

  // 2. Generate SearchDocuments
  const rawDocuments: SearchDocument[] = [];
  for (const obj of objects) {
    const doc = createSearchDocumentFromKnowledgeObject({
      object: obj,
      metadata: metadata[obj.id],
      relationships,
      entities,
      collections,
      citations,
      media,
    });
    rawDocuments.push(doc);
  }

  // 3. Filter documents
  const filteredDocuments = filterSearchDocuments(rawDocuments, {
    visibility,
    language,
  });

  // 4. Validate filtered documents and detect duplicates
  const seenIds = new Set<string>();
  for (const doc of filteredDocuments) {
    // Check for duplicates
    if (seenIds.has(doc.id)) {
      diagnostics.push({
        id: `${codes.GC_SEARCH_INDEX_DOCUMENT_DUPLICATE}_${doc.id}`,
        severity: "error",
        code: codes.GC_SEARCH_INDEX_DOCUMENT_DUPLICATE,
        message: `Duplicate search document ID detected: ${doc.id}`,
        documentId: doc.id,
        sourceId: doc.sourceId,
        recommendation: "Ensure source IDs and types are unique across the input objects.",
      });
    } else {
      seenIds.add(doc.id);
    }

    // Run document-level validation
    const validation = validateSearchDocument(doc);
    if (!validation.valid || validation.issues.length > 0) {
      for (const issue of validation.issues) {
        diagnostics.push({
          id: issue.id,
          severity: issue.severity,
          code: issue.code,
          message: issue.message,
          documentId: doc.id,
          sourceId: doc.sourceId,
          field: issue.field,
          recommendation: issue.recommendation,
        });
      }
    }
  }

  // 5. Check if index is empty
  if (filteredDocuments.length === 0) {
    diagnostics.push({
      id: `${codes.GC_SEARCH_INDEX_EMPTY}_idx`,
      severity: "warning",
      code: codes.GC_SEARCH_INDEX_EMPTY,
      message: "The search index is empty.",
      recommendation: "Ensure knowledge objects exist and match visibility and language filters.",
    });
  }

  return {
    id,
    name,
    language,
    documents: filteredDocuments,
    generatedAt: new Date().toISOString(),
    diagnostics,
  };
}
