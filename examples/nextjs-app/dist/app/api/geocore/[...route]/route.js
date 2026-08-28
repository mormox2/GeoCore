import { handleLlmsTxt, handleLlmsFullTxt, handleSitemapXml, handleSearchApi, handleContextApi, } from "@mormo_mossaab/geocore-next";
import { appDataset } from "../../../../data/dataset.js";
/**
 * Universal Next.js 14+ App Router Catch-All Route Handler.
 */
export async function GET(req, { params }) {
    const route = params.route || [];
    const path = route.join("/");
    const url = new URL(req.url);
    if (path === "llms.txt") {
        return handleLlmsTxt(appDataset, { siteUrl: "https://rtimidental.tn" });
    }
    if (path === "llms-full.txt") {
        return handleLlmsFullTxt(appDataset, { siteUrl: "https://rtimidental.tn" });
    }
    if (path === "sitemap.xml") {
        return handleSitemapXml(appDataset, { siteUrl: "https://rtimidental.tn" });
    }
    if (path === "search") {
        const q = url.searchParams.get("q") || "";
        return handleSearchApi(appDataset, q);
    }
    if (route[0] === "context" && route[1]) {
        return handleContextApi(appDataset, route[1]);
    }
    return new Response(JSON.stringify({ error: `Unknown route /api/geocore/${path}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
    });
}
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
    });
}
