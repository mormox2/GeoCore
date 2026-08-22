import { getKnowledgeObject, listKnowledgeObjects, getEntity, listEntities, searchKnowledge, getAiContext, getMedia, listMedia, getSource, listSources, getCitation, listCitations, generateLlmsTxt, generateLlmsFullTxt, generateSitemap, runValidationPipeline, } from "@mormox2/geocore";
import { buildPromptContext } from "@mormox2/geocore-ai";
import { generateOpenApiSpec } from "../openapi/openapi-generator.js";
import { authenticateRequest } from "../middleware/auth.js";
function sendJson(res, statusCode, data) {
    const json = JSON.stringify(data);
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(json);
}
function sendText(res, statusCode, text, contentType = "text/plain; charset=utf-8") {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", contentType);
    res.end(text);
}
/**
 * Main request router for GeoCore HTTP server.
 */
export function routeRequest(req, res, options) {
    const { dataset, siteUrl, auth } = options;
    const rawUrl = req.url || "/";
    const parsedUrl = new URL(rawUrl, "http://localhost");
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.searchParams;
    // 1. Health check
    if (pathname === "/api/health" || pathname === "/health") {
        return sendJson(res, 200, {
            status: "ok",
            datasetId: dataset.id,
            name: dataset.name,
            objectsCount: dataset.objects.length,
            timestamp: new Date().toISOString(),
        });
    }
    // 2. OpenAPI Spec
    if (pathname === "/api/openapi.json") {
        return sendJson(res, 200, generateOpenApiSpec({ title: dataset.name }));
    }
    // 3. llms.txt & llms-full.txt
    if (pathname === "/api/llms.txt" || pathname === "/llms.txt") {
        const llms = generateLlmsTxt({
            id: `llms_${dataset.id}`,
            siteName: dataset.name,
            siteUrl,
            objects: dataset.objects,
        });
        return sendText(res, 200, llms.content);
    }
    if (pathname === "/api/llms-full.txt" || pathname === "/llms-full.txt") {
        const llmsFull = generateLlmsFullTxt({
            id: `llms_full_${dataset.id}`,
            siteName: dataset.name,
            siteUrl,
            objects: dataset.objects,
        });
        return sendText(res, 200, llmsFull.content);
    }
    // 4. Sitemap.xml
    if (pathname === "/api/sitemap.xml" || pathname === "/sitemap.xml") {
        const sitemap = generateSitemap({
            id: `sitemap_${dataset.id}`,
            siteUrl,
            objects: dataset.objects,
            media: dataset.media,
            visibility: "public",
        });
        return sendText(res, 200, sitemap.xml, "application/xml; charset=utf-8");
    }
    // 5. Auth validation for internal/protected routes
    const authContext = authenticateRequest(req, auth);
    const requestedVisibility = query.get("visibility") || "public";
    const effectiveVisibility = authContext.authenticated ? requestedVisibility : "public";
    // 6. Search API: /api/search?q=...
    if (pathname === "/api/search") {
        const q = query.get("q") || query.get("query") || "";
        const language = query.get("language") || undefined;
        const limit = query.get("limit") ? parseInt(query.get("limit"), 10) : undefined;
        const result = searchKnowledge(dataset, {
            query: q,
            language,
            limit,
            visibility: effectiveVisibility,
        });
        return sendJson(res, 200, result);
    }
    // 7. Knowledge Objects: /api/objects and /api/objects/:id
    if (pathname === "/api/objects") {
        const language = query.get("language") || undefined;
        const status = query.get("status") || undefined;
        const limit = query.get("limit") ? parseInt(query.get("limit"), 10) : undefined;
        const offset = query.get("offset") ? parseInt(query.get("offset"), 10) : undefined;
        const result = listKnowledgeObjects(dataset, {
            visibility: effectiveVisibility,
            language,
            status,
            limit,
            offset,
        });
        return sendJson(res, 200, result);
    }
    const objectMatch = pathname.match(/^\/api\/objects\/([^/]+)$/);
    if (objectMatch) {
        const id = objectMatch[1];
        const result = getKnowledgeObject(dataset, { id, visibility: effectiveVisibility });
        const status = result.status === "ok" ? 200 : result.status === "not-found" ? 404 : 403;
        return sendJson(res, status, result);
    }
    // 8. Entities: /api/entities and /api/entities/:id
    if (pathname === "/api/entities") {
        const language = query.get("language") || undefined;
        const limit = query.get("limit") ? parseInt(query.get("limit"), 10) : undefined;
        const offset = query.get("offset") ? parseInt(query.get("offset"), 10) : undefined;
        const result = listEntities(dataset, {
            visibility: effectiveVisibility,
            language,
            limit,
            offset,
        });
        return sendJson(res, 200, result);
    }
    const entityMatch = pathname.match(/^\/api\/entities\/([^/]+)$/);
    if (entityMatch) {
        const id = entityMatch[1];
        const result = getEntity(dataset, { id, visibility: effectiveVisibility });
        const status = result.status === "ok" ? 200 : result.status === "not-found" ? 404 : 403;
        return sendJson(res, status, result);
    }
    // 9. AI Context: /api/context/:id
    const contextMatch = pathname.match(/^\/api\/context\/([^/]+)$/);
    if (contextMatch) {
        const objectId = contextMatch[1];
        const result = getAiContext(dataset, { objectId, visibility: effectiveVisibility });
        const status = result.status === "ok" ? 200 : result.status === "not-found" ? 404 : 403;
        return sendJson(res, status, result);
    }
    // 10. Formatted LLM Prompt Context: /api/prompt-context/:id
    const promptMatch = pathname.match(/^\/api\/prompt-context\/([^/]+)$/);
    if (promptMatch) {
        const objectId = promptMatch[1];
        const result = getAiContext(dataset, { objectId, visibility: effectiveVisibility });
        if (result.status !== "ok" || !result.data) {
            return sendJson(res, result.status === "not-found" ? 404 : 403, result);
        }
        const formatted = buildPromptContext(result.data);
        return sendText(res, 200, formatted);
    }
    // 11. Citations: /api/citations and /api/citations/:id
    if (pathname === "/api/citations") {
        const targetId = query.get("targetId") || undefined;
        const sourceId = query.get("sourceId") || undefined;
        const result = listCitations(dataset, { visibility: effectiveVisibility, targetId, sourceId });
        return sendJson(res, 200, result);
    }
    const citationMatch = pathname.match(/^\/api\/citations\/([^/]+)$/);
    if (citationMatch) {
        const id = citationMatch[1];
        const result = getCitation(dataset, { id, visibility: effectiveVisibility });
        return sendJson(res, result.status === "ok" ? 200 : 404, result);
    }
    // 12. Sources: /api/sources and /api/sources/:id
    if (pathname === "/api/sources") {
        const result = listSources(dataset, { visibility: effectiveVisibility });
        return sendJson(res, 200, result);
    }
    const sourceMatch = pathname.match(/^\/api\/sources\/([^/]+)$/);
    if (sourceMatch) {
        const id = sourceMatch[1];
        const result = getSource(dataset, { id, visibility: effectiveVisibility });
        return sendJson(res, result.status === "ok" ? 200 : 404, result);
    }
    // 13. Media: /api/media and /api/media/:id
    if (pathname === "/api/media") {
        const result = listMedia(dataset, { visibility: effectiveVisibility });
        return sendJson(res, 200, result);
    }
    const mediaMatch = pathname.match(/^\/api\/media\/([^/]+)$/);
    if (mediaMatch) {
        const id = mediaMatch[1];
        const result = getMedia(dataset, { id, visibility: effectiveVisibility });
        return sendJson(res, result.status === "ok" ? 200 : 404, result);
    }
    // 14. Validation report: /api/validate
    if (pathname === "/api/validate") {
        const mode = query.get("mode") || "public";
        const report = runValidationPipeline({ dataset, config: { mode } });
        return sendJson(res, 200, report);
    }
    // Fallback 404
    return sendJson(res, 404, {
        status: "not-found",
        error: `Route '${pathname}' not found. Check /api/openapi.json for documentation.`,
    });
}
