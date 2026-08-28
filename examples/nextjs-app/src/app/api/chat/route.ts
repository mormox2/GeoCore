import { getAiContext } from "@mormo_mossaab/geocore";
import { buildPromptContext, verifyAnswerGrounding } from "@mormo_mossaab/geocore-ai";
import {
  searchHybrid,
  vectorizeDataset,
  MemoryVectorStore,
  DeterministicEmbeddingProvider,
} from "@mormo_mossaab/geocore-vector";
import { appDataset } from "../../../data/dataset.js";

// Cached vector store for Next.js route handler
const vectorStore = new MemoryVectorStore();
const embeddingProvider = new DeterministicEmbeddingProvider(64);
let isVectorized = false;

async function ensureVectorized(): Promise<void> {
  if (!isVectorized) {
    await vectorizeDataset(appDataset, vectorStore, embeddingProvider);
    isVectorized = true;
  }
}

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

    await ensureVectorized();

    // 1. Resolve relevant Knowledge Object via Hybrid Semantic Search (RRF) or explicit ID
    let targetObjectId = body.objectId;
    let matchType: "both" | "lexical-only" | "semantic-only" | undefined;
    let combinedScore: number | undefined;

    if (!targetObjectId && query) {
      const hybridRes = await searchHybrid(query, appDataset, vectorStore, embeddingProvider, { limit: 1 });
      if (hybridRes.results.length > 0) {
        targetObjectId = hybridRes.results[0].objectId;
        matchType = hybridRes.results[0].matchType;
        combinedScore = hybridRes.results[0].combinedScore;
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
      matchedObjectId: targetObjectId,
      matchType,
      combinedScore,
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
