const FORMATS = new Set([
    "html",
    "markdown",
    "json",
    "json-ld",
    "xml",
    "rss",
    "pdf",
    "llm",
    "search",
    "api",
    "text",
]);
const STATUSES = new Set([
    "experimental",
    "beta",
    "stable",
    "deprecated",
]);
const SEVERITIES = new Set([
    "info",
    "warning",
    "error",
    "critical",
]);
export function isRendererFormat(value) {
    return typeof value === "string" && FORMATS.has(value);
}
export function isRendererStatus(value) {
    return typeof value === "string" && STATUSES.has(value);
}
export function isRendererDiagnosticSeverity(value) {
    return typeof value === "string" && SEVERITIES.has(value);
}
