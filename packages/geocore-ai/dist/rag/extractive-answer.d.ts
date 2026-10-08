import type { AiContextPackage } from "@mormo_mossaab/geocore";
export type ExtractiveAnswerOptions = {
    /** Maximum answer length in characters (default 600). Whole sentences are never cut. */
    maxLength?: number;
};
export type ExtractiveAnswer = {
    /** Sentences copied verbatim from the certified knowledge object, in document order. */
    answer: string;
    /** Number of distinct query terms found in the knowledge object (0 means unrelated). */
    matchedQueryTerms: number;
};
/** Converts Markdown to plain prose: drops headings, list markers, emphasis and link targets. */
export declare function markdownToPlainText(markdown: string): string;
/**
 * Builds an answer by selecting sentences of the certified knowledge object that best match
 * the query. Nothing is generated: every sentence comes from the object body (or its summary
 * when the body is empty), so the answer can always be verified with verifyAnswerGrounding.
 */
export declare function buildExtractiveAnswer(query: string, context: AiContextPackage, options?: ExtractiveAnswerOptions): ExtractiveAnswer;
