/**
 * Shared, dependency-free tokenisation used by grounding checks and extractive answers.
 */
/** Lower-cases and strips diacritics so "détartrage" and "detartrage" compare equal. */
export declare function normalizeText(text: string): string;
/** Returns stemmed content words (4+ letters, stopwords removed). */
export declare function contentTokens(text: string): string[];
