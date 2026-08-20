import { generateLlmsTxt, generateLlmsFullTxt, generateSitemap, searchKnowledge, getAiContext, } from "@mormox2/geocore";
/**
 * Returns a Response object containing the llms.txt summary file for AI crawlers.
 */
export function handleLlmsTxt(dataset, options = {}) {
    const { siteUrl, siteName = dataset.name, cacheControl = "public, max-age=3600, s-maxage=86400" } = options;
    const result = generateLlmsTxt({
        id: `llms_${dataset.id}`,
        siteName,
        siteUrl,
        objects: dataset.objects,
    });
    return new Response(result.content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": cacheControl,
        },
    });
}
/**
 * Returns a Response object containing the full llms-full.txt file for deep AI ingestion.
 */
export function handleLlmsFullTxt(dataset, options = {}) {
    const { siteUrl, siteName = dataset.name, cacheControl = "public, max-age=3600, s-maxage=86400" } = options;
    const result = generateLlmsFullTxt({
        id: `llms_full_${dataset.id}`,
        siteName,
        siteUrl,
        objects: dataset.objects,
    });
    return new Response(result.content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": cacheControl,
        },
    });
}
/**
 * Returns a Response object containing the sitemap.xml.
 */
export function handleSitemapXml(dataset, options = {}) {
    const { siteUrl, cacheControl = "public, max-age=3600, s-maxage=86400" } = options;
    const result = generateSitemap({
        id: `sitemap_${dataset.id}`,
        siteUrl,
        objects: dataset.objects,
        media: dataset.media,
        visibility: "public",
    });
    return new Response(result.xml, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": cacheControl,
        },
    });
}
/**
 * JSON API Route Handler for full-text search.
 */
export function handleSearchApi(dataset, query, options = {}) {
    const result = searchKnowledge(dataset, {
        query,
        limit: options.limit,
        language: options.language,
        visibility: "public",
    });
    return Response.json(result, {
        status: result.status === "ok" ? 200 : 400,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    });
}
/**
 * JSON API Route Handler for AI context bundle retrieval.
 */
export function handleContextApi(dataset, objectId) {
    const result = getAiContext(dataset, {
        objectId,
        visibility: "public",
    });
    const statusCode = result.status === "ok"
        ? 200
        : result.status === "not-found"
            ? 404
            : result.status === "forbidden"
                ? 403
                : 500;
    return Response.json(result, {
        status: statusCode,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    });
}
