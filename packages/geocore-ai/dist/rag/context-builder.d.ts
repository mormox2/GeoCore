import type { AiContextPackage } from "@mormo_mossaab/geocore";
export type FormatPromptContextOptions = {
    includeSystemPreamble?: boolean;
    includeCitations?: boolean;
    includeEntities?: boolean;
    includeTechnicalMeta?: boolean;
    maxTokensEstimate?: number;
};
/**
 * Builds a structured Markdown context string optimized for LLM prompting
 * from an AiContextPackage.
 */
export declare function buildPromptContext(contextPackage: AiContextPackage, options?: FormatPromptContextOptions): string;
