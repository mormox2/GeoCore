import {
  handleLlmsTxt,
  handleLlmsFullTxt,
  handleSitemapXml,
  handleSearchApi,
  handleContextApi,
} from "@mormo_mossaab/geocore-next";
import { appDataset } from "../../../../data/dataset.js";
import { answerQuestion } from "../../../../data/answer.js";

export type RouteParams = {
  params: {
    route?: string[];
  };
};

/**
 * Universal Next.js 14+ App Router Catch-All Route Handler.
 */
export async function GET(req: Request, { params }: RouteParams): Promise<Response> {
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

  // Grounded answer endpoint consumed by the <geocore-widget> (data-api-url="/api/geocore").
  if (path === "answer") {
    const q = (url.searchParams.get("q") || "").trim();
    if (!q || q.length > 500) {
      return Response.json({ status: "error", error: "Query parameter 'q' is required (max 500 characters)." }, { status: 400 });
    }
    const result = await answerQuestion(q, url.searchParams.get("language") || undefined);
    if (!result) {
      return Response.json({ status: "no-answer", data: null });
    }
    const { context, grounding } = result;
    return Response.json({
      status: "ok",
      data: {
        query: q,
        answer: result.answer,
        objectId: context.object.id,
        title: context.object.title,
        slug: context.object.slug,
        language: context.object.language,
        matchType: result.matchType,
        grounding: {
          score: grounding.score,
          hallucinationRisk: grounding.hallucinationRisk,
          isGrounded: grounding.isGrounded,
          unsupportedClaims: grounding.unsupportedClaims,
          matchedEntities: grounding.matchedEntities,
        },
        sources: context.sources.map((s) => ({
          id: s.id,
          title: s.title,
          url: s.url,
          publisher: s.publisher,
          trustLevel: s.trustLevel ?? "unknown",
        })),
      },
    });
  }

  if (route[0] === "context" && route[1]) {
    return handleContextApi(appDataset, route[1]);
  }

  return new Response(JSON.stringify({ error: `Unknown route /api/geocore/${path}` }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
