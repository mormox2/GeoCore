import type { KnowledgeCitation, KnowledgeSource } from "../types/citation.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
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
export declare function extractCitationsFromDataset(dataset: KnowledgeDataset, options?: {
    publicOnly?: boolean;
}): CitationExtractionResult;
/**
 * Extracts all citations for a specific targetId from a KnowledgeDataset.
 */
export declare function extractCitationsForTarget(dataset: KnowledgeDataset, targetId: string): KnowledgeCitation[];
/**
 * Extracts all unique source IDs referenced by active citations in the dataset.
 */
export declare function extractReferencedSourceIds(dataset: KnowledgeDataset): string[];
/**
 * Returns all sources that are referenced by at least one active citation.
 */
export declare function extractUsedSources(dataset: KnowledgeDataset): KnowledgeSource[];
