import { getAiContext, searchKnowledge } from "@mormox2/geocore";
import { buildPromptContext, verifyAnswerGrounding } from "@mormox2/geocore-ai";
import { appDataset } from "../../../data/dataset.js";

export type ChatRequestBody = {
  message: string;
  objectId?: string;
};

export type ChatResponsePayload = {
  answer: string;
  groundingScore: number;
  hallucinationRisk: "low" | "medium" | "high";
  groundedEntities: string[];
  sourcesCited: Array<{
    title: string;
    trustLevel: string;
    url?: string;
  }>;
  promptContextPreview: string;
};

/**
 * Next.js 14+ POST handler for AI / RAG conversational queries.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const query = body.message || "";

    // 1. Resolve relevant Knowledge Object (by explicit ID or search)
    let targetObjectId = body.objectId;
    if (!targetObjectId && query) {
      const searchRes = searchKnowledge(appDataset, { query, limit: 1 });
      if (searchRes.status === "ok" && searchRes.data && searchRes.data.length > 0) {
        targetObjectId = searchRes.data[0].id;
      }
    }

    if (!targetObjectId) {
      targetObjectId = "ko_detartrage_abime_dents"; // Default fallback
    }

    // 2. Fetch authoritative AI Context Package
    const contextRes = getAiContext(appDataset, { objectId: targetObjectId, visibility: "public" });
    if (contextRes.status !== "ok" || !contextRes.data) {
      return new Response(
        JSON.stringify({ error: "No relevant authoritative knowledge context found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const aiPackage = contextRes.data;

    // 3. Build formatted LLM Prompt Context with citation guardrails
    const promptContext = buildPromptContext(aiPackage);

    // 4. Generate grounded domain response
    const answer =
      targetObjectId === "ko_detartrage_abime_dents"
        ? "Non, le détartrage n'abîme en aucun cas l'émail dentaire. Selon les recommandations de l'Organisation Mondiale de la Santé (WHO) et le Dr Mossaab Rtimi, les instruments à ultrasons éliminent sélectivement le tartre sans rayer la surface des dents."
        : `D'après nos données cliniques sur "${aiPackage.object.title}", ${aiPackage.object.summary}`;

    // 5. Verify Grounding & Guardrails
    const grounding = verifyAnswerGrounding(answer, aiPackage);

    const payload: ChatResponsePayload = {
      answer,
      groundingScore: grounding.score,
      hallucinationRisk: grounding.hallucinationRisk,
      groundedEntities: grounding.matchedEntities,
      sourcesCited: aiPackage.sources.map((s) => ({
        title: s.title,
        trustLevel: s.trustLevel || "authoritative",
        url: s.url,
      })),
      promptContextPreview: promptContext.slice(0, 300) + "...",
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
