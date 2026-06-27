import type { LoaderDiagnostic, LoaderDiagnosticSeverity } from "../types/loader-diagnostic.js";
/**
 * Creates a deterministic dataset ID from the dataset name.
 */
export declare function createKnowledgeDatasetId(name: string): string;
/**
 * Creates a LoaderDiagnostic with a deterministic ID.
 */
export declare function createLoaderDiagnostic(input: {
    severity: LoaderDiagnosticSeverity;
    code: string;
    message: string;
    sourcePath?: string;
    inputId?: string;
    field?: string;
    recommendation?: string;
}): LoaderDiagnostic;
/**
 * Returns true if the value is a plain record.
 */
export declare function isRecord(value: unknown): value is Record<string, unknown>;
/**
 * Helper to safely cast/resolve a value to a string or undefined.
 */
export declare function asString(value: unknown): string | undefined;
/**
 * Helper to safely resolve a value to an array of strings.
 * Supports comma-separated strings.
 */
export declare function asStringArray(value: unknown): string[];
/**
 * Helper to default status to "draft" if missing or normalize it.
 */
export declare function normalizeLoadedStatus(value?: unknown): string;
/**
 * Returns current ISO timestamp.
 */
export declare function createIsoTimestamp(): string;
