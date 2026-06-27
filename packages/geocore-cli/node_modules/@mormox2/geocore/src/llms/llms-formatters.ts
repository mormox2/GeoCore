/**
 * Formats a link as markdown if URL is provided. Otherwise returns title.
 */
export function formatLlmsLink(title: string, url?: string): string {
  if (url) {
    return `[${title}](${url})`;
  }
  return title;
}

/**
 * Formats items into a Markdown list. Returns empty string if list is empty.
 */
export function formatLlmsList(items: string[]): string {
  if (!items || items.length === 0) {
    return "";
  }
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * Formats metadata fields as a block, omitting undefined values.
 */
export function formatLlmsMetadataBlock(input: {
  id: string;
  language: string;
  version?: string;
  author?: string;
  canonicalUrl?: string;
  trustLevel?: string;
  freshness?: string;
}): string {
  const parts: string[] = [];
  parts.push(`ID: ${input.id}`);
  parts.push(`Language: ${input.language}`);
  if (input.version) parts.push(`Version: ${input.version}`);
  if (input.author) parts.push(`Author: ${input.author}`);
  if (input.canonicalUrl) parts.push(`Canonical URL: ${input.canonicalUrl}`);
  if (input.trustLevel) parts.push(`Trust Level: ${input.trustLevel}`);
  if (input.freshness) parts.push(`Freshness: ${input.freshness}`);
  return parts.join("\n");
}

/**
 * Returns plain string content, or formats objects as fenced JSON blocks.
 */
export function stringifyLlmsContent(content: string | Record<string, unknown>): string {
  if (typeof content === "string") {
    return content;
  }
  try {
    return "```json\n" + JSON.stringify(content, null, 2) + "\n```";
  } catch {
    return String(content);
  }
}
