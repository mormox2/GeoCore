export type ExtractSearchTextInput = {
    title?: string;
    summary?: string;
    body?: string | Record<string, unknown>;
    entities?: string[];
    aliases?: string[];
    keywords?: string[];
};
/**
 * Extracts searchable text by concatenating title, summary, body, entities,
 * aliases, and keywords, and normalizing whitespace.
 */
export declare function extractSearchText(input: ExtractSearchTextInput): string;
