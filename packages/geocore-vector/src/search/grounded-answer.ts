import type { KnowledgeDataset, WidgetAnswer } from "@mormo_mossaab/geocore";
import { getAiContext } from "@mormo_mossaab/geocore";
import { buildExtractiveAnswer, verifyAnswerGrounding } from "@mormo_mossaab/geocore-ai";
import type { EmbeddingProvider } from "../embedding/embedding-provider.js";
import type { VectorStore } from "../store/vector-store.js";
import { vectorizeDataset } from "../pipeline/vectorize-dataset.js";
import { searchHybrid, type HybridSearchResultItem } from "./hybrid-search.js";

/** Payload returned by `/answer` endpoints and consumed by `<geocore-widget>`. */
export type GroundedAnswer = WidgetAnswer & {
  matchType?: HybridSearchResultItem["matchType"];
};

export type FindGroundedAnswerOptions = {
  store: VectorStore;
  provider: EmbeddingProvider;
  language?: string;
  /** "public" (default) only answers from published, public objects. */
  visibility?: "public" | "internal";
  /** Number of hybrid search candidates to try (default 3). */
  candidates?: number;
};

const pendingVectorizations = new WeakMap<VectorStore, Promise<unknown>>();

/**
 * Vectorizes the dataset into an empty store, once, even when several requests
 * arrive concurrently.
 */
export async function ensureVectorized(
  dataset: KnowledgeDataset,
  store: VectorStore,
  provider: EmbeddingProvider
): Promise<void> {
  if ((await store.count()) > 0) return;
  let pending = pendingVectorizations.get(store);
  if (!pending) {
    pending = vectorizeDataset(dataset, store, provider).finally(() => pendingVectorizations.delete(store));
    pendingVectorizations.set(store, pending);
  }
  await pending;
}

/**
 * Answers a question from the knowledge base without generating text: finds the best
 * object with hybrid search, extracts its most relevant sentences and returns them only
 * when they pass the grounding check. Returns null rather than guessing when no
 * candidate shares terms with the question or none is grounded.
 */
export async function findGroundedAnswer(
  dataset: KnowledgeDataset,
  question: string,
  options: FindGroundedAnswerOptions
): Promise<GroundedAnswer | null> {
  const query = question.trim();
  if (!query) return null;

  await ensureVectorized(dataset, options.store, options.provider);
  const hits = await searchHybrid(query, dataset, options.store, options.provider, {
    language: options.language,
    limit: options.candidates ?? 3,
  });

  for (const hit of hits.results) {
    const contextRes = getAiContext(dataset, {
      objectId: hit.objectId,
      visibility: options.visibility ?? "public",
    });
    if (contextRes.status !== "ok" || !contextRes.data) continue;

    const context = contextRes.data;
    const extracted = buildExtractiveAnswer(query, context);
    if (extracted.matchedQueryTerms === 0 || !extracted.answer) continue;

    const grounding = verifyAnswerGrounding(extracted.answer, context);
    if (!grounding.isGrounded) continue;

    return {
      query,
      answer: extracted.answer,
      objectId: context.object.id,
      title: context.object.title,
      slug: context.object.slug,
      language: context.object.language,
      matchType: hit.matchType,
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
    };
  }
  return null;
}
