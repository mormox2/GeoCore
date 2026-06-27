import { filterSitemapPublicObjects } from "./sitemap-filter.js";
import { createSitemapOutputId, createSitemapEntryId, isSitemapPublicObject, resolveSitemapUrl, extractSitemapImages, dedupeSitemapEntries, dedupeSitemapUrls, } from "./sitemap-utils.js";
import { generateSitemapXml } from "./sitemap-xml.js";
import { validateSitemapOutput } from "./validate-sitemap-output.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Generates a complete SitemapOutput from a GenerateSitemapInput.
 *
 * - Filters public, published objects
 * - Resolves canonical URLs from metadata, explicit overrides, or siteUrl + slug
 * - Builds SitemapEntry per object
 * - Deduplicates entries by ID and URL
 * - Generates XML urlset
 * - Validates the resulting output
 */
export function generateSitemap(input) {
    const diagnostics = [];
    const generatedAt = new Date().toISOString();
    // Record excluded objects as info diagnostics
    for (const obj of input.objects) {
        if (!isSitemapPublicObject(obj)) {
            diagnostics.push({
                id: `${codes.GC_SITEMAP_PRIVATE_MEDIA_EXCLUDED}_${obj.id}`,
                severity: "info",
                code: codes.GC_SITEMAP_PRIVATE_MEDIA_EXCLUDED,
                message: `Excluded non-public object: ${obj.id}`,
                sourceId: obj.id,
            });
        }
    }
    const publicObjects = filterSitemapPublicObjects(input);
    if (publicObjects.length === 0) {
        diagnostics.push({
            id: `${codes.GC_SITEMAP_EMPTY}_no_objects`,
            severity: "warning",
            code: codes.GC_SITEMAP_EMPTY,
            message: "No public objects matching visibility and language criteria are present.",
        });
    }
    const rawEntries = [];
    for (const obj of publicObjects) {
        const meta = input.metadata?.[obj.id];
        const url = resolveSitemapUrl(obj, meta, input.explicitUrls, input.siteUrl);
        if (!url) {
            diagnostics.push({
                id: `${codes.GC_SITEMAP_OBJECT_URL_MISSING}_${obj.id}`,
                severity: "warning",
                code: codes.GC_SITEMAP_OBJECT_URL_MISSING,
                message: `Object lacks a resolvable URL and will be excluded: ${obj.id}`,
                sourceId: obj.id,
            });
            continue;
        }
        const entryId = createSitemapEntryId(obj.id, input.language);
        const alternates = input.alternates?.[obj.id] ?? [];
        const images = extractSitemapImages(obj.id, input.media);
        const entry = {
            id: entryId,
            sourceId: obj.id,
            sourceType: "knowledge-object",
            url,
            language: obj.language ?? input.language,
            lastModified: meta?.updatedAt ?? obj.updatedAt ?? undefined,
            changeFrequency: input.defaultChangeFrequency,
            priority: input.defaultPriority,
            visibility: "public",
            status: obj.status,
            alternates,
            images,
            generatedAt,
        };
        rawEntries.push(entry);
    }
    // Deduplicate by ID
    const { entries: dedupedById, duplicateIds } = dedupeSitemapEntries(rawEntries);
    for (const dupId of duplicateIds) {
        diagnostics.push({
            id: `${codes.GC_SITEMAP_ENTRY_ID_DUPLICATE}_${dupId}`,
            severity: "warning",
            code: codes.GC_SITEMAP_ENTRY_ID_DUPLICATE,
            message: `Duplicate sitemap entry ID detected and deduplicated: "${dupId}"`,
        });
    }
    // Deduplicate by URL
    const { entries: dedupedByUrl, duplicateUrls } = dedupeSitemapUrls(dedupedById);
    for (const dupUrl of duplicateUrls) {
        diagnostics.push({
            id: `${codes.GC_SITEMAP_URL_DUPLICATE}_${dupUrl.replace(/[^a-z0-9]+/gi, "_")}`,
            severity: "warning",
            code: codes.GC_SITEMAP_URL_DUPLICATE,
            message: `Duplicate URL detected and deduplicated: "${dupUrl}"`,
        });
    }
    const entries = dedupedByUrl;
    const xml = generateSitemapXml(entries);
    const id = createSitemapOutputId("urlset", input.id, input.language);
    const output = {
        id,
        type: "urlset",
        siteUrl: input.siteUrl,
        language: input.language,
        entries,
        xml,
        generatedAt,
        diagnostics,
    };
    // Validate and fold in any additional issues
    const validation = validateSitemapOutput(output);
    if (!validation.valid || validation.issues.length > 0) {
        for (const issue of validation.issues) {
            const exists = diagnostics.some((d) => d.code === issue.code && d.sourceId === issue.sourceId);
            if (!exists) {
                diagnostics.push({
                    id: issue.id,
                    severity: issue.severity,
                    code: issue.code,
                    message: issue.message,
                    field: issue.field,
                    recommendation: issue.recommendation,
                });
            }
        }
    }
    return output;
}
