import type { KnowledgeSource, KnowledgeCitation } from "../types/citation.js";
/**
 * Returns true if the source has an active status.
 */
export declare function isActiveSource(source: KnowledgeSource): boolean;
/**
 * Returns true if the source is publicly visible.
 */
export declare function isPublicSource(source: KnowledgeSource): boolean;
/**
 * Returns true if the citation is active.
 */
export declare function isActiveCitation(citation: KnowledgeCitation): boolean;
/**
 * Returns true if the citation has a high or authoritative confidence level.
 */
export declare function isHighConfidenceCitation(citation: KnowledgeCitation): boolean;
/**
 * Returns true if the citation references a valid source in the given source map.
 */
export declare function hasResolvedSource(citation: KnowledgeCitation, sourceMap: Map<string, KnowledgeSource>): boolean;
/**
 * Builds a Map<sourceId, KnowledgeSource> from an array of sources for fast lookups.
 */
export declare function buildSourceMap(sources: KnowledgeSource[]): Map<string, KnowledgeSource>;
/**
 * Returns all citations that reference a specific targetId.
 */
export declare function getCitationsForTarget(citations: KnowledgeCitation[], targetId: string): KnowledgeCitation[];
/**
 * Returns all citations that reference a specific sourceId.
 */
export declare function getCitationsForSource(citations: KnowledgeCitation[], sourceId: string): KnowledgeCitation[];
/**
 * Returns the unique set of sourceIds referenced by a citation array.
 */
export declare function extractSourceIds(citations: KnowledgeCitation[]): string[];
/**
 * Returns the unique set of targetIds referenced by a citation array.
 */
export declare function extractTargetIds(citations: KnowledgeCitation[]): string[];
/**
 * Creates a deterministic citation ID from a sourceId and targetId.
 */
export declare function createCitationId(sourceId: string, targetId: string): string;
