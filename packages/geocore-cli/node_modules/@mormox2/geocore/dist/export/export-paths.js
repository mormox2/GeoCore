import { normalizeExportPath } from "./export-utils.js";
/**
 * Create a relative export path from asset type and optional route/slug/language.
 *
 * Rules:
 * - output path is always relative (no leading slash);
 * - no "..", no query, no hash;
 * - extensions follow the type conventions.
 */
export function createExportPath(input) {
    const { type, routePath, slug, language } = input;
    if (type === "search-index")
        return "search-index.json";
    if (type === "llms")
        return "llms.txt";
    if (type === "llms-full")
        return "llms-full.txt";
    if (type === "sitemap")
        return "sitemap.xml";
    if (type === "manifest")
        return "manifest.json";
    // Build the base path from route path or slug/language.
    let base;
    if (routePath && routePath.trim().length > 0) {
        base = normalizeExportPath(routePath);
    }
    else if (slug && language) {
        base = normalizeExportPath(`${language}/${slug}`);
    }
    else if (slug) {
        base = slug;
    }
    else {
        // Fallback to sourceId if nothing else available.
        base = input.sourceId ?? "unknown";
    }
    // Suffix with the appropriate extension.
    const ext = extensionForType(type);
    return `${base}${ext}`;
}
function extensionForType(type) {
    switch (type) {
        case "markdown":
            return ".md";
        case "json":
            return ".json";
        case "json-ld":
            return ".schema.json";
        case "xml":
            return ".xml";
        case "text":
            return ".txt";
        default:
            return "";
    }
}
