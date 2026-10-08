import { buildPromptContext } from "@mormo_mossaab/geocore-ai";
import { answerFromObject, answerQuestion } from "../../../data/answer.js";

export type ChatRequestBody = {
  message: string;
  objectId?: string;
};

export type ChatResponsePayload = {
  answer: string;
  matchedObjectId: string;
  matchType?: "both" | "lexical-only" | "semantic-only";
  combinedScore?: number;
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
 * Next.js 14+ POST handler for AI / RAG conversational queries with Hybrid Semantic Search.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const query = body.message || "";

    // 1. Answer from the requested object, or find the best one via hybrid search (RRF).
    //    Answers are extracted from certified content and must pass the grounding check.
    const result = body.objectId ? answerFromObject(query, body.objectId) : await answerQuestion(query);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "No relevant authoritative knowledge context found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { answer, context: aiPackage, grounding, matchType, combinedScore } = result;
    const targetObjectId = aiPackage.object.id;

    // 2. Formatted LLM prompt context, ready to hand to a model in a production app.
    const promptContext = buildPromptContext(aiPackage);

    const payload: ChatResponsePayload = {
      answer,
      matchedObjectId: targetObjectId,
      matchType,
      combinedScore,
      groundingScore: grounding.score,
      hallucinationRisk: grounding.hallucinationRisk,
      groundedEntities: grounding.matchedEntities,
      sourcesCited: aiPackage.sources.map((s) => ({
        title: s.title,
        trustLevel: s.trustLevel ?? "unknown",
        url: s.url,
      })),
      promptContextPreview: promptContext.slice(0, 300) + "...",
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[chat] request failed:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
