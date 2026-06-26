/**
 * Creates a deterministic dataset ID from the dataset name.
 */
export function createKnowledgeDatasetId(name) {
    const normalized = name.replace(/\s+/g, "-").toLowerCase();
    return `dataset_${normalized}`;
}
/**
 * Creates a LoaderDiagnostic with a deterministic ID.
 */
export function createLoaderDiagnostic(input) {
    const { severity, code, message, sourcePath, inputId, field, recommendation } = input;
    // Create a deterministic hash/ID based on code, inputId, field, and part of the message.
    const msgPart = message.replace(/[^a-zA-Z0-9]/g, "").slice(0, 15).toLowerCase();
    const id = `loaderdiag_${code.toLowerCase()}${inputId ? `_${inputId}` : ""}${field ? `_${field}` : ""}_${msgPart}`;
    return {
        id,
        severity,
        code,
        message,
        sourcePath,
        inputId,
        field,
        recommendation,
    };
}
/**
 * Returns true if the value is a plain record.
 */
export function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
 * Helper to safely cast/resolve a value to a string or undefined.
 */
export function asString(value) {
    if (typeof value === "string")
        return value;
    if (value === undefined || value === null)
        return undefined;
    return String(value);
}
/**
 * Helper to safely resolve a value to an array of strings.
 * Supports comma-separated strings.
 */
export function asStringArray(value) {
    if (Array.isArray(value)) {
        return value.map((v) => (typeof v === "string" ? v : String(v)).trim());
    }
    if (typeof value === "string") {
        if (value.trim() === "")
            return [];
        return value.split(",").map((v) => v.trim()).filter((v) => v !== "");
    }
    if (value === undefined || value === null) {
        return [];
    }
    return [String(value).trim()];
}
/**
 * Helper to default status to "draft" if missing or normalize it.
 */
export function normalizeLoadedStatus(value) {
    const status = asString(value);
    return status ? status.toLowerCase() : "draft";
}
/**
 * Returns current ISO timestamp.
 */
export function createIsoTimestamp() {
    return new Date().toISOString();
}
