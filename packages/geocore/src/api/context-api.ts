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
import { buildSourceMap, isPublicSource } from "../citation/citation-utils.js";

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

  const isPublic = visibility === "public";
  const objectMap = new Map(dataset.objects.map((o) => [o.id, o]));
  const entityMap = new Map(dataset.entities.map((e) => [e.id, e]));
  const sourceMap = buildSourceMap(dataset.sources ?? []);
  const mediaMap = new Map((dataset.media ?? []).map((m) => [m.id, m]));

  const isSourceVisible = (source: KnowledgeSource): boolean =>
    isPublic
      ? source.status === "active" && isPublicSource(source)
      : source.visibility !== "private";

  // A node is hidden only when it is known to the dataset and not visible at this level.
  const isNodeVisible = (id: string): boolean => {
    if (!isPublic) return true;
    const obj = objectMap.get(id);
    if (obj) return obj.status === "published";
    const entity = entityMap.get(id);
    if (entity) return entity.status === "published";
    const source = sourceMap.get(id);
    if (source) return isSourceVisible(source);
    const media = mediaMap.get(id);
    if (media) return media.status === "active" && media.visibility === "public";
    return true;
  };

  // Resolve metadata
  const resolvedMetadata = resolveMetadata({
    object,
    entities: dataset.entities,
    collections: dataset.collections,
    defaults: {},
  });
  const metadata: ResolvedMetadata = resolvedMetadata.entities
    ? { ...resolvedMetadata, entities: resolvedMetadata.entities.filter(isNodeVisible) }
    : resolvedMetadata;

  // Collect related relationships whose other endpoint is visible
  const relationships = dataset.relationships.filter((r) => {
    if (r.sourceId === object.id) return isNodeVisible(r.targetId);
    if (r.targetId === object.id) return isNodeVisible(r.sourceId);
    return false;
  });

  // Collect related entity IDs from relationships and metadata
  const entityIds = new Set<string>([
    ...(metadata.entities ?? []),
    ...relationships
      .flatMap((r) => [r.sourceId, r.targetId])
      .filter((id) => entityMap.has(id)),
  ]);

  const entities = dataset.entities.filter((e) => entityIds.has(e.id) && isNodeVisible(e.id));

  // Collect active citations for this object, dropping those backed by a non-visible source
  const allCitations = dataset.citations ?? [];
  const activeCitations = filterActiveCitations(allCitations);
  const citations = activeCitations.filter((c) => {
    if (c.targetId !== object.id) return false;
    const source = sourceMap.get(c.sourceId);
    return source === undefined || isSourceVisible(source);
  });

  // Resolve sources for citations
  const sources = [...new Set(citations.map((c) => c.sourceId))]
    .map((id) => sourceMap.get(id))
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
