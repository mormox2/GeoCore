import type { KnowledgeSource, KnowledgeCitation } from "../types/citation.js";

/**
 * Returns true if the source has an active status.
 */
export function isActiveSource(source: KnowledgeSource): boolean {
  return source.status === "active";
}

/**
 * Returns true if the source is publicly visible.
 */
export function isPublicSource(source: KnowledgeSource): boolean {
  return source.visibility === "public" || source.visibility === undefined;
}

/**
 * Returns true if the citation is active.
 */
export function isActiveCitation(citation: KnowledgeCitation): boolean {
  return citation.status === "active";
}

/**
 * Returns true if the citation has a high or authoritative confidence level.
 */
export function isHighConfidenceCitation(citation: KnowledgeCitation): boolean {
  return citation.confidence === "high" || citation.confidence === "authoritative";
}

/**
 * Returns true if the citation references a valid source in the given source map.
 */
export function hasResolvedSource(
  citation: KnowledgeCitation,
  sourceMap: Map<string, KnowledgeSource>
): boolean {
  return sourceMap.has(citation.sourceId);
}

/**
 * Builds a Map<sourceId, KnowledgeSource> from an array of sources for fast lookups.
 */
export function buildSourceMap(sources: KnowledgeSource[]): Map<string, KnowledgeSource> {
  const map = new Map<string, KnowledgeSource>();
  for (const source of sources) {
    map.set(source.id, source);
  }
  return map;
}

/**
 * Returns all citations that reference a specific targetId.
 */
export function getCitationsForTarget(
  citations: KnowledgeCitation[],
  targetId: string
): KnowledgeCitation[] {
  return citations.filter((c) => c.targetId === targetId);
}

/**
 * Returns all citations that reference a specific sourceId.
 */
export function getCitationsForSource(
  citations: KnowledgeCitation[],
  sourceId: string
): KnowledgeCitation[] {
  return citations.filter((c) => c.sourceId === sourceId);
}

/**
 * Returns the unique set of sourceIds referenced by a citation array.
 */
export function extractSourceIds(citations: KnowledgeCitation[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const citation of citations) {
    if (!seen.has(citation.sourceId)) {
      seen.add(citation.sourceId);
      result.push(citation.sourceId);
    }
  }
  return result;
}

/**
 * Returns the unique set of targetIds referenced by a citation array.
 */
export function extractTargetIds(citations: KnowledgeCitation[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const citation of citations) {
    if (!seen.has(citation.targetId)) {
      seen.add(citation.targetId);
      result.push(citation.targetId);
    }
  }
  return result;
}

/**
 * Creates a deterministic citation ID from a sourceId and targetId.
 */
export function createCitationId(sourceId: string, targetId: string): string {
  return `citation_${sourceId}_to_${targetId}`;
}
