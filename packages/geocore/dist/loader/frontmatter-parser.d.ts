import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Parses simple frontmatter at the beginning of a markdown string.
 */
export declare function parseSimpleFrontmatter(markdown: string): {
    data: Record<string, unknown>;
    body: string;
    diagnostics: LoaderDiagnostic[];
};
