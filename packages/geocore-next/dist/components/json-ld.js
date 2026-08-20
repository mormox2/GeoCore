/**
 * Generates a safe JSON string for embedding inside `<script type="application/ld+json">`.
 * Sanitizes against XSS / HTML injection in script contexts.
 */
export function formatJsonLdScript(schema) {
    const json = JSON.stringify(schema && typeof schema === "object" && "jsonld" in schema ? schema.jsonld : schema);
    // Prevent </script> tag breakout attacks
    return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}
/**
 * Returns an HTML script tag string for SSR / static generation.
 */
export function renderJsonLdTag(schema) {
    const sanitized = formatJsonLdScript(schema);
    return `<script type="application/ld+json">${sanitized}</script>`;
}
