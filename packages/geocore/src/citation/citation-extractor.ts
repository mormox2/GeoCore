import type { KnowledgeCitation, KnowledgeSource } from "../types/citation.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import { buildSourceMap, getCitationsForTarget, extractSourceIds } from "./citation-utils.js";
import { filterActiveCitations, filterPublicSources } from "./citation-filter.js";

export type CitationExtractionResult = {
  citations: KnowledgeCitation[];
  sources: KnowledgeSource[];
  sourceMap: Map<string, KnowledgeSource>;
  citationsByTarget: Map<string, KnowledgeCitation[]>;
};

/**
 * Extracts all citations and their resolved sources from a KnowledgeDataset.
 * Returns only active citations and publicly visible sources by default.
 */
export function extractCitationsFromDataset(
  dataset: KnowledgeDataset,
  options: { publicOnly?: boolean } = {}
): CitationExtractionResult {
  const allCitations = dataset.citations ?? [];
  const allSources = dataset.sources ?? [];

  const citations = options.publicOnly
    ? filterActiveCitations(allCitations)
    : allCitations;

  const sources = options.publicOnly
    ? filterPublicSources(allSources)
    : allSources;

  const sourceMap = buildSourceMap(sources);

  // Group citations by targetId for fast access
  const citationsByTarget = new Map<string, KnowledgeCitation[]>();
  for (const citation of citations) {
    if (!citationsByTarget.has(citation.targetId)) {
      citationsByTarget.set(citation.targetId, []);
    }
    citationsByTarget.get(citation.targetId)!.push(citation);
  }

  return { citations, sources, sourceMap, citationsByTarget };
}

/**
 * Extracts all citations for a specific targetId from a KnowledgeDataset.
 */
export function extractCitationsForTarget(
  dataset: KnowledgeDataset,
  targetId: string
): KnowledgeCitation[] {
  const allCitations = dataset.citations ?? [];
  return getCitationsForTarget(allCitations, targetId);
}

/**
 * Extracts all unique source IDs referenced by active citations in the dataset.
 */
export function extractReferencedSourceIds(dataset: KnowledgeDataset): string[] {
  const activeCitations = filterActiveCitations(dataset.citations ?? []);
  return extractSourceIds(activeCitations);
}

/**
 * Returns all sources that are referenced by at least one active citation.
 */
export function extractUsedSources(dataset: KnowledgeDataset): KnowledgeSource[] {
  const referencedIds = new Set(extractReferencedSourceIds(dataset));
  const allSources = dataset.sources ?? [];
  return allSources.filter((s) => referencedIds.has(s.id));
}
