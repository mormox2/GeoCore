import type { KnowledgeCitation, KnowledgeSource } from "@mormox2/geocore";
export type CitationBadgeData = {
    citation: KnowledgeCitation;
    source?: KnowledgeSource;
    badgeLabel: string;
    sourceText: string;
    url?: string;
    trustLevel?: string;
    isAuthoritative: boolean;
};
/**
 * Extracts and prepares citation badge data for UI components.
 */
export declare function createCitationBadgeData(citation: KnowledgeCitation, source?: KnowledgeSource): CitationBadgeData;
/**
 * Renders an accessible HTML markup string for a citation badge.
 */
export declare function renderCitationBadgeHtml(citation: KnowledgeCitation, source?: KnowledgeSource): string;
