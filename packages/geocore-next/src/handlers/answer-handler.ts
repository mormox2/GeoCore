import type { KnowledgeDataset } from "@mormo_mossaab/geocore";
import {
  findGroundedAnswer,
  MemoryVectorStore,
  DeterministicEmbeddingProvider,
  type VectorStore,
  type EmbeddingProvider,
} from "@mormo_mossaab/geocore-vector";

export type AnswerApiOptions = {
  /** Vector index to search; defaults to an in-memory index scoped to the dataset. */
  store?: VectorStore;
  /** Embedding provider matching `store`; defaults to the local deterministic provider. */
  provider?: EmbeddingProvider;
  /** Maximum accepted question length (default 500 characters). */
  maxQueryLength?: number;
};

// Default indexes are keyed by dataset so two datasets in one app never share vectors.
const defaultBackends = new WeakMap<KnowledgeDataset, { store: VectorStore; provider: EmbeddingProvider }>();

function resolveBackend(dataset: KnowledgeDataset, options: AnswerApiOptions) {
  if (options.store && options.provider) return { store: options.store, provider: options.provider };
  let backend = defaultBackends.get(dataset);
  if (!backend) {
    backend = { store: new MemoryVectorStore(), provider: new DeterministicEmbeddingProvider(64) };
    defaultBackends.set(dataset, backend);
  }
  return { store: options.store ?? backend.store, provider: options.provider ?? backend.provider };
}

/**
 * Route handler for the grounded answer endpoint used by `<geocore-widget>`
 * (same contract as `GET /api/answer` of geocore-server). Reads `q` and optional
 * `language` from the URL and only ever answers from public, published objects.
 *
 * @example
 * // app/api/geocore/answer/route.ts
 * export const GET = (req: Request) => handleAnswerApi(dataset, req);
 */
export async function handleAnswerApi(
  dataset: KnowledgeDataset,
  request: Request | URL,
  options: AnswerApiOptions = {}
): Promise<Response> {
  const url = request instanceof URL ? request : new URL(request.url);
  const question = (url.searchParams.get("q") ?? url.searchParams.get("query") ?? "").trim();
  const maxLength = options.maxQueryLength ?? 500;

  if (!question || question.length > maxLength) {
    return Response.json(
      { status: "error", error: `Query parameter 'q' is required (max ${maxLength} characters).` },
      { status: 400 }
    );
  }

  try {
    const { store, provider } = resolveBackend(dataset, options);
    const answer = await findGroundedAnswer(dataset, question, {
      store,
      provider,
      language: url.searchParams.get("language") ?? undefined,
      visibility: "public",
    });
    return Response.json(answer ? { status: "ok", data: answer } : { status: "no-answer", data: null });
  } catch (err) {
    console.error("[geocore-next] answer handler failed:", err);
    return Response.json({ status: "error", error: "Internal Server Error" }, { status: 500 });
  }
}
