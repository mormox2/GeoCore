import type { KnowledgeSource, KnowledgeCitation } from "../types/citation.js";

/**
 * Formats a KnowledgeSource as a short inline reference string.
 * e.g. "WHO Oral Health Report 2022 (WHO, 2022)"
 */
export function formatSourceInline(source: KnowledgeSource): string {
  const parts: string[] = [source.title];
  const yearMatch = source.publicationDate?.match(/^(\d{4})/);
  const year = yearMatch ? yearMatch[1] : undefined;

  if (source.publisher || year) {
    const meta = [source.publisher, year].filter(Boolean).join(", ");
    parts.push(`(${meta})`);
  }

  return parts.join(" ");
}

/**
 * Formats a KnowledgeSource as an APA-style reference string.
 * Authors (Year). Title. Publisher. URL
 */
export function formatSourceApa(source: KnowledgeSource): string {
  const authors = source.authors?.join(", ") ?? "Unknown Author";
  const year = source.publicationDate?.match(/^(\d{4})/)?.[1] ?? "n.d.";
  let apa = `${authors} (${year}). ${source.title}.`;
  if (source.publisher) {
    apa += ` ${source.publisher}.`;
  }
  if (source.url) {
    apa += ` ${source.url}`;
  }
  return apa;
}

/**
 * Formats a KnowledgeCitation as a human-readable description.
 * e.g. "[supports] citation_scaling_001 → source_who_oral_health_2024"
 */
export function formatCitationLabel(citation: KnowledgeCitation): string {
  return `[${citation.purpose}] ${citation.id} → ${citation.sourceId}`;
}

/**
 * Formats a KnowledgeCitation with its resolved source for display.
 * Includes optional quote or paraphrase.
 */
export function formatCitationWithSource(
  citation: KnowledgeCitation,
  source: KnowledgeSource
): string {
  const label = `[${citation.purpose}] ${formatSourceInline(source)}`;
  if (citation.quote) {
    return `${label}: "${citation.quote}"`;
  }
  if (citation.paraphrase) {
    return `${label}: ${citation.paraphrase}`;
  }
  return label;
}

/**
 * Formats an array of citations with resolved sources as a Markdown list.
 */
export function formatCitationListMarkdown(
  citations: KnowledgeCitation[],
  sourceMap: Map<string, KnowledgeSource>
): string {
  if (citations.length === 0) return "";
  const lines = citations.map((citation) => {
    const source = sourceMap.get(citation.sourceId);
    if (!source) {
      return `- [${citation.purpose}] *Source not found: ${citation.sourceId}*`;
    }
    return `- ${formatCitationWithSource(citation, source)}`;
  });
  return lines.join("\n");
}

/**
 * Formats a source as a short trust badge string.
 * e.g. "🔵 High Trust: WHO Oral Health 2022"
 */
export function formatSourceTrustBadge(source: KnowledgeSource): string {
  const levelMap: Record<string, string> = {
    authoritative: "🟢 Authoritative",
    high: "🔵 High Trust",
    medium: "🟡 Medium Trust",
    low: "🟠 Low Trust",
    unknown: "⚪ Unknown Trust",
  };
  const badge = levelMap[source.trustLevel ?? "unknown"] ?? "⚪ Unknown Trust";
  return `${badge}: ${source.title}`;
}
