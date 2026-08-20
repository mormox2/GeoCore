import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { KnowledgeRelationship } from "../types/relationship.js";
import type { KnowledgeCitation, KnowledgeSource } from "../types/citation.js";
import type { ResolvedMetadata } from "../types/metadata.js";
import type { ApiContextRequest, ApiResponse } from "./api-types.js";
import { createApiResponse, createNotFoundResponse, createForbiddenResponse } from "./api-response.js";
import { resolveMetadata } from "../metadata/resolve-metadata.js";
import { filterActiveCitations } from "../citation/citation-filter.js";
import { buildSourceMap } from "../citation/citation-utils.js";

/**
 * AI Context Package — a structured bundle of knowledge for AI consumption.
 * Contains the Knowledge Object, its metadata, related entities, relationships, and citations.
 */
export type AiContextPackage = {
  object: KnowledgeObject;
  metadata: ResolvedMetadata;
  entities: KnowledgeEntity[];
  relationships: KnowledgeRelationship[];
  citations: KnowledgeCitation[];
  sources: KnowledgeSource[];
  relatedObjectIds: string[];
  generatedAt: string;
};

/**
 * Builds an AI Context Package for a specific Knowledge Object.
 * This is the primary endpoint for AI/RAG consumption.
 */
export function getAiContext(
  dataset: KnowledgeDataset,
  request: ApiContextRequest
): ApiResponse<AiContextPackage> {
  const visibility = request.visibility ?? "public";
  const object = dataset.objects.find((o) => o.id === request.objectId);

  if (!object) {
    return createNotFoundResponse(request.objectId, visibility);
  }

  // Enforce visibility for public contexts: must be published
  if (visibility === "public" && object.status !== "published") {
    return createForbiddenResponse(
      `Knowledge Object '${request.objectId}' is not published and not publicly available for AI context.`
    );
  }

  // Resolve metadata
  const metadata = resolveMetadata({
    object,
    entities: dataset.entities,
    collections: dataset.collections,
    defaults: {},
  });

  // Collect related relationships
  const relationships = dataset.relationships.filter(
    (r) => r.sourceId === object.id || r.targetId === object.id
  );

  // Collect related entity IDs from relationships and metadata
  const entityIds = new Set<string>([
    ...(metadata.entities ?? []),
    ...relationships
      .flatMap((r) => [r.sourceId, r.targetId])
      .filter((id) => dataset.entities.some((e) => e.id === id)),
  ]);

  const entities = dataset.entities.filter((e) => entityIds.has(e.id));

  // Collect active citations for this object
  const allCitations = dataset.citations ?? [];
  const activeCitations = filterActiveCitations(allCitations);
  const citations = activeCitations.filter(
    (c) => c.targetId === object.id
  );

  // Resolve sources for citations
  const sourceMap = buildSourceMap(dataset.sources ?? []);
  const sources = citations
    .map((c) => sourceMap.get(c.sourceId))
    .filter((s): s is KnowledgeSource => s !== undefined);

  // Collect related object IDs from relationships
  const relatedObjectIds = [
    ...new Set(
      relationships.flatMap((r) => [r.sourceId, r.targetId]).filter((id) => id !== object.id)
    ),
  ];

  const contextPackage: AiContextPackage = {
    object,
    metadata,
    entities,
    relationships,
    citations,
    sources,
    relatedObjectIds,
    generatedAt: new Date().toISOString(),
  };

  return createApiResponse(contextPackage, { visibility });
}
