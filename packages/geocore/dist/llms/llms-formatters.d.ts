/**
 * Formats a link as markdown if URL is provided. Otherwise returns title.
 */
export declare function formatLlmsLink(title: string, url?: string): string;
/**
 * Formats items into a Markdown list. Returns empty string if list is empty.
 */
export declare function formatLlmsList(items: string[]): string;
/**
 * Formats metadata fields as a block, omitting undefined values.
 */
export declare function formatLlmsMetadataBlock(input: {
    id: string;
    language: string;
    version?: string;
    author?: string;
    canonicalUrl?: string;
    trustLevel?: string;
    freshness?: string;
}): string;
/**
 * Returns plain string content, or formats objects as fenced JSON blocks.
 */
export declare function stringifyLlmsContent(content: string | Record<string, unknown>): string;
