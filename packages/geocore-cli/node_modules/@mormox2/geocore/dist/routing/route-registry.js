import { resolveRoutePatterns } from "./route-patterns.js";
import { createRouteEntryFromKnowledgeObject } from "./route-resolver.js";
import { filterRouteObjects } from "./route-filter.js";
import { detectRouteConflicts } from "./route-conflicts.js";
import { GC_ROUTE_OBJECT_EXCLUDED } from "../validation/validation-codes.js";
/**
 * Resolve a full route registry from validated knowledge objects.
 *
 * The resolver:
 *   1. filters objects by visibility and language;
 *   2. resolves one route per routable object;
 *   3. applies explicit path / canonical URL overrides;
 *   4. resolves canonical URLs;
 *   5. attaches explicit alternates and redirects;
 *   6. detects conflicts;
 *   7. returns a registry with diagnostics.
 *
 * It never mutates its input.
 */
export function resolveRoutes(input) {
    const generatedAt = new Date().toISOString();
    const patterns = resolveRoutePatterns(input.patterns);
    const diagnostics = [];
    let counter = 0;
    const filtered = filterRouteObjects(input);
    // Emit info diagnostics for objects that were excluded by the filter.
    const filteredIds = new Set(filtered.map((o) => o.id));
    for (const object of input.objects) {
        if (!filteredIds.has(object.id)) {
            diagnostics.push({
                id: `route-diagnostic-${counter++}`,
                severity: "info",
                code: GC_ROUTE_OBJECT_EXCLUDED,
                message: `Object "${object.id}" was excluded from routes by the visibility/language filter.`,
                sourceId: object.id,
            });
        }
    }
    const routes = [];
    for (const object of filtered) {
        const entry = createRouteEntryFromKnowledgeObject({
            object,
            metadata: input.metadata?.[object.id],
            siteUrl: input.siteUrl,
            pattern: patterns.knowledgeObject,
            explicitPath: input.explicitPaths?.[object.id],
            explicitCanonicalUrl: input.explicitCanonicalUrls?.[object.id],
            alternates: input.alternates?.[object.id],
            redirects: input.redirects?.[object.id],
            generatedAt,
        });
        if (entry) {
            routes.push(entry);
        }
        else {
            diagnostics.push({
                id: `route-diagnostic-${counter++}`,
                severity: "warning",
                code: "GC_ROUTE_SLUG_MISSING",
                message: `Cannot resolve route for object "${object.id}": missing slug.`,
                sourceId: object.id,
                recommendation: "Provide a slug on the object or its metadata, or pass an explicit path.",
            });
        }
    }
    const conflictDiagnostics = detectRouteConflicts(routes);
    diagnostics.push(...conflictDiagnostics);
    return {
        id: input.id,
        siteUrl: input.siteUrl,
        routes,
        generatedAt,
        diagnostics,
    };
}
/**
 * Re-export the filtering helper from the registry module so callers have a
 * single import surface for orchestration helpers.
 */
export { filterRouteObjects } from "./route-filter.js";
