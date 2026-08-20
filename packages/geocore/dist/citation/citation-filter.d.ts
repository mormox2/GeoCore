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
export declare function filterCitations(citations: KnowledgeCitation[], options: CitationFilterOptions): KnowledgeCitation[];
/**
 * Returns only active, non-removed citations.
 */
export declare function filterActiveCitations(citations: KnowledgeCitation[]): KnowledgeCitation[];
/**
 * Filters an array of KnowledgeSource by status, visibility, or trustLevel.
 */
export declare function filterSources(sources: KnowledgeSource[], options: SourceFilterOptions): KnowledgeSource[];
/**
 * Returns only active, publicly visible sources.
 */
export declare function filterPublicSources(sources: KnowledgeSource[]): KnowledgeSource[];
