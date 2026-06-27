import { sitemapOutputSchema } from "../schemas/sitemap-output.schema.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Validates the complete SitemapOutput for structural correctness.
 * Checks required fields, duplicate entries/URLs, XML presence, and Zod schema.
 */
export function validateSitemapOutput(output) {
    const checkedAt = new Date().toISOString();
    const issues = [];
    if (!output || typeof output !== "object") {
        return {
            valid: false,
            publishable: false,
            checkedAt,
            issues: [
                {
                    id: `${codes.GC_SITEMAP_OUTPUT_ID_MISSING}_root`,
                    severity: "critical",
                    code: codes.GC_SITEMAP_OUTPUT_ID_MISSING,
                    message: "SitemapOutput must be a non-null object.",
                },
            ],
        };
    }
    // 1. Output ID
    if (!output.id || typeof output.id !== "string" || output.id.trim() === "") {
        issues.push({
            id: `${codes.GC_SITEMAP_OUTPUT_ID_MISSING}_id`,
            severity: "error",
            code: codes.GC_SITEMAP_OUTPUT_ID_MISSING,
            message: "SitemapOutput ID is missing.",
            field: "id",
        });
    }
    // 2. Type
    if (output.type !== "urlset" && output.type !== "index") {
        issues.push({
            id: `${codes.GC_SITEMAP_OUTPUT_TYPE_INVALID}_type`,
            severity: "error",
            code: codes.GC_SITEMAP_OUTPUT_TYPE_INVALID,
            message: `SitemapOutput type "${output.type}" is not valid. Must be "urlset" or "index".`,
            field: "type",
        });
    }
    // 3. XML
    if (!output.xml || typeof output.xml !== "string" || output.xml.trim() === "") {
        issues.push({
            id: `${codes.GC_SITEMAP_XML_MISSING}_xml`,
            severity: "error",
            code: codes.GC_SITEMAP_XML_MISSING,
            message: "SitemapOutput XML content is missing or empty.",
            field: "xml",
        });
    }
    // 4. Entries array
    if (!Array.isArray(output.entries)) {
        issues.push({
            id: `${codes.GC_SITEMAP_ENTRIES_INVALID}_entries`,
            severity: "error",
            code: codes.GC_SITEMAP_ENTRIES_INVALID,
            message: "SitemapOutput entries must be an array.",
            field: "entries",
        });
    }
    else {
        // 5. Duplicate entry IDs
        const idCounts = new Map();
        for (const entry of output.entries) {
            idCounts.set(entry.id, (idCounts.get(entry.id) || 0) + 1);
        }
        for (const [entryId, count] of idCounts.entries()) {
            if (count > 1) {
                issues.push({
                    id: `${codes.GC_SITEMAP_ENTRY_ID_DUPLICATE}_${entryId}`,
                    severity: "warning",
                    code: codes.GC_SITEMAP_ENTRY_ID_DUPLICATE,
                    message: `Duplicate sitemap entry ID detected: "${entryId}" (appears ${count} times).`,
                    field: "entries",
                });
            }
        }
        // 6. Duplicate URLs
        const urlCounts = new Map();
        for (const entry of output.entries) {
            urlCounts.set(entry.url, (urlCounts.get(entry.url) || 0) + 1);
        }
        for (const [url, count] of urlCounts.entries()) {
            if (count > 1) {
                issues.push({
                    id: `${codes.GC_SITEMAP_URL_DUPLICATE}_${url.replace(/[^a-z0-9]+/gi, "_")}`,
                    severity: "warning",
                    code: codes.GC_SITEMAP_URL_DUPLICATE,
                    message: `Duplicate URL detected: "${url}" (appears ${count} times).`,
                    field: "entries",
                });
            }
        }
        // 7. Empty sitemap
        const publicEntries = output.entries.filter((e) => e.visibility === "public");
        if (publicEntries.length === 0) {
            issues.push({
                id: `${codes.GC_SITEMAP_EMPTY}_empty`,
                severity: "warning",
                code: codes.GC_SITEMAP_EMPTY,
                message: "Sitemap contains no public entries.",
                field: "entries",
            });
        }
    }
    // 8. Generated At
    if (!output.generatedAt || typeof output.generatedAt !== "string" || output.generatedAt.trim() === "") {
        issues.push({
            id: `${codes.GC_SITEMAP_GENERATED_AT_MISSING}_generatedAt`,
            severity: "error",
            code: codes.GC_SITEMAP_GENERATED_AT_MISSING,
            message: "SitemapOutput generatedAt is missing.",
            field: "generatedAt",
        });
    }
    // 9. Diagnostics array
    if (!Array.isArray(output.diagnostics)) {
        issues.push({
            id: `${codes.GC_SITEMAP_ENTRIES_INVALID}_diagnostics`,
            severity: "error",
            code: codes.GC_SITEMAP_ENTRIES_INVALID,
            message: "SitemapOutput diagnostics must be an array.",
            field: "diagnostics",
        });
    }
    // 10. Zod schema validation
    const zodResult = sitemapOutputSchema.safeParse(output);
    if (!zodResult.success) {
        for (const zodIssue of zodResult.error.issues) {
            const field = zodIssue.path.join(".");
            const alreadyExists = issues.some((i) => i.field === field);
            if (!alreadyExists) {
                issues.push({
                    id: `GC_SITEMAP_ZOD_${field || "field"}_${issues.length}`,
                    severity: "error",
                    code: codes.GC_SITEMAP_ENTRIES_INVALID,
                    message: zodIssue.message,
                    field: field || undefined,
                });
            }
        }
    }
    const hasErrors = issues.some((i) => i.severity === "error" || i.severity === "critical");
    return {
        valid: !hasErrors,
        publishable: !hasErrors,
        issues,
        checkedAt,
    };
}
