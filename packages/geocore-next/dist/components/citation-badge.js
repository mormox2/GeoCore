import { formatSourceTrustBadge, formatSourceInline } from "@mormox2/geocore";
/**
 * Extracts and prepares citation badge data for UI components.
 */
export function createCitationBadgeData(citation, source) {
    const badgeLabel = source ? formatSourceTrustBadge(source) : `[${citation.purpose}]`;
    const sourceText = source ? formatSourceInline(source) : citation.sourceId;
    const isAuthoritative = source?.trustLevel === "authoritative" || citation.confidence === "authoritative";
    return {
        citation,
        source,
        badgeLabel,
        sourceText,
        url: source?.url ?? citation.url,
        trustLevel: source?.trustLevel,
        isAuthoritative,
    };
}
/**
 * Renders an accessible HTML markup string for a citation badge.
 */
export function renderCitationBadgeHtml(citation, source) {
    const data = createCitationBadgeData(citation, source);
    const linkStart = data.url ? `<a href="${data.url}" target="_blank" rel="noopener noreferrer" class="geocore-citation-link">` : "";
    const linkEnd = data.url ? "</a>" : "";
    return (`<span class="geocore-citation-badge" data-purpose="${citation.purpose}" data-trust="${data.trustLevel || "unknown"}">` +
        `${linkStart}<span class="geocore-badge-icon">${data.badgeLabel}</span> ` +
        `<span class="geocore-badge-text">${data.sourceText}</span>${linkEnd}` +
        `</span>`);
}
