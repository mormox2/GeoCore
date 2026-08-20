import type { KnowledgeSource, KnowledgeCitation } from "../types/citation.js";

export type CitationFilterOptions = {
  status?: "draft" | "active" | "deprecated" | "removed";
  targetId?: string;
  sourceId?: string;
  purpose?: string;
  confidence?: string;
};

export type SourceFilterOptions = {
  status?: "draft" | "active" | "deprecated" | "archived";
  visibility?: "public" | "internal" | "private";
  trustLevel?: string;
};

/**
 * Filters an array of KnowledgeCitation by status, targetId, sourceId, purpose, or confidence.
 */
export function filterCitations(
  citations: KnowledgeCitation[],
  options: CitationFilterOptions
): KnowledgeCitation[] {
  return citations.filter((citation) => {
    if (options.status !== undefined && citation.status !== options.status) {
      return false;
    }
    if (options.targetId !== undefined && citation.targetId !== options.targetId) {
      return false;
    }
    if (options.sourceId !== undefined && citation.sourceId !== options.sourceId) {
      return false;
    }
    if (options.purpose !== undefined && citation.purpose !== options.purpose) {
      return false;
    }
    if (options.confidence !== undefined && citation.confidence !== options.confidence) {
      return false;
    }
    return true;
  });
}

/**
 * Returns only active, non-removed citations.
 */
export function filterActiveCitations(citations: KnowledgeCitation[]): KnowledgeCitation[] {
  return citations.filter((c) => c.status === "active");
}

/**
 * Filters an array of KnowledgeSource by status, visibility, or trustLevel.
 */
export function filterSources(
  sources: KnowledgeSource[],
  options: SourceFilterOptions
): KnowledgeSource[] {
  return sources.filter((source) => {
    if (options.status !== undefined && source.status !== options.status) {
      return false;
    }
    if (options.visibility !== undefined && source.visibility !== options.visibility) {
      return false;
    }
    if (options.trustLevel !== undefined && source.trustLevel !== options.trustLevel) {
      return false;
    }
    return true;
  });
}

/**
 * Returns only active, publicly visible sources.
 */
export function filterPublicSources(sources: KnowledgeSource[]): KnowledgeSource[] {
  return sources.filter(
    (s) => s.status === "active" && (s.visibility === "public" || s.visibility === undefined)
  );
}
