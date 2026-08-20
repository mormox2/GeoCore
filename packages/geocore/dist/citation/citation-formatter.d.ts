import type { KnowledgeSource, KnowledgeCitation } from "../types/citation.js";
/**
 * Formats a KnowledgeSource as a short inline reference string.
 * e.g. "WHO Oral Health Report 2022 (WHO, 2022)"
 */
export declare function formatSourceInline(source: KnowledgeSource): string;
/**
 * Formats a KnowledgeSource as an APA-style reference string.
 * Authors (Year). Title. Publisher. URL
 */
export declare function formatSourceApa(source: KnowledgeSource): string;
/**
 * Formats a KnowledgeCitation as a human-readable description.
 * e.g. "[supports] citation_scaling_001 → source_who_oral_health_2024"
 */
export declare function formatCitationLabel(citation: KnowledgeCitation): string;
/**
 * Formats a KnowledgeCitation with its resolved source for display.
 * Includes optional quote or paraphrase.
 */
export declare function formatCitationWithSource(citation: KnowledgeCitation, source: KnowledgeSource): string;
/**
 * Formats an array of citations with resolved sources as a Markdown list.
 */
export declare function formatCitationListMarkdown(citations: KnowledgeCitation[], sourceMap: Map<string, KnowledgeSource>): string;
/**
 * Formats a source as a short trust badge string.
 * e.g. "🔵 High Trust: WHO Oral Health 2022"
 */
export declare function formatSourceTrustBadge(source: KnowledgeSource): string;
