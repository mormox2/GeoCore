import type { IncomingMessage, ServerResponse } from "node:http";
import type { KnowledgeDataset } from "@mormo_mossaab/geocore";
import {
  getKnowledgeObject,
  listKnowledgeObjects,
  getEntity,
  listEntities,
  searchKnowledge,
  getAiContext,
  getMedia,
  listMedia,
  getSource,
  listSources,
  getCitation,
  listCitations,
  generateLlmsTxt,
  generateLlmsFullTxt,
  generateSitemap,
  runValidationPipeline,
} from "@mormo_mossaab/geocore";
import { buildPromptContext } from "@mormo_mossaab/geocore-ai";
import {
  searchHybrid,
  vectorizeDataset,
  MemoryVectorStore,
  DeterministicEmbeddingProvider,
  type VectorStore,
  type EmbeddingProvider,
} from "@mormo_mossaab/geocore-vector";
import { generateOpenApiSpec } from "../openapi/openapi-generator.js";
import { authenticateRequest, AuthOptions } from "../middleware/auth.js";

export type RouterOptions = {
  dataset: KnowledgeDataset;
  siteUrl?: string;
  auth?: AuthOptions;
  vectorStore?: VectorStore;
  embeddingProvider?: EmbeddingProvider;
};

function sendJson(res: ServerResponse, statusCode: number, data: unknown): void {
  const json = JSON.stringify(data);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(json);
}

function sendText(res: ServerResponse, statusCode: number, text: string, contentType = "text/plain; charset=utf-8"): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", contentType);
  res.end(text);
}

/**
 * Parses an optional non-negative integer query parameter.
 * Returns undefined when absent and null when present but invalid.
 */
function parseNonNegativeInt(value: string | null): number | undefined | null {
  if (value === null || value === "") return undefined;
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : null;
}

function sendBadParam(res: ServerResponse, name: string): void {
  sendJson(res, 400, { status: "error", error: `Query parameter '${name}' must be a non-negative integer.` });
}

// Fallback vector stores are scoped to their dataset so that two datasets served
// from the same process can never read each other's vectors.
const fallbackStores = new WeakMap<KnowledgeDataset, { store: VectorStore; provider: EmbeddingProvider }>();
const pendingVectorizations = new WeakMap<VectorStore, Promise<unknown>>();

function resolveVectorBackend(options: RouterOptions): { store: VectorStore; provider: EmbeddingProvider } {
  if (options.vectorStore && options.embeddingProvider) {
    return { store: options.vectorStore, provider: options.embeddingProvider };
  }
  let fallback = fallbackStores.get(options.dataset);
  if (!fallback) {
    fallback = { store: new MemoryVectorStore(), provider: new DeterministicEmbeddingProvider(64) };
    fallbackStores.set(options.dataset, fallback);
  }
  return {
    store: options.vectorStore ?? fallback.store,
    provider: options.embeddingProvider ?? fallback.provider,
  };
}

async function ensureVectorized(dataset: KnowledgeDataset, store: VectorStore, provider: EmbeddingProvider): Promise<void> {
  if ((await store.count()) > 0) return;
  let pending = pendingVectorizations.get(store);
  if (!pending) {
    pending = vectorizeDataset(dataset, store, provider).finally(() => pendingVectorizations.delete(store));
    pendingVectorizations.set(store, pending);
  }
  await pending;
}

/**
 * Main request router for GeoCore HTTP server.
 */
export async function routeRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: RouterOptions
): Promise<void> {
  const { dataset, siteUrl, auth } = options;
  const rawUrl = req.url || "/";
  const parsedUrl = new URL(rawUrl, "http://localhost");
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.searchParams;

  const { store, provider } = resolveVectorBackend(options);

  // 1. Health check
  if (pathname === "/api/health" || pathname === "/health") {
    const vectorCount = await store.count();
    return sendJson(res, 200, {
      status: "ok",
      datasetId: dataset.id,
      name: dataset.name,
      objectsCount: dataset.objects.length,
      vectorsCount: vectorCount,
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
  const requestedVisibility = query.get("visibility") === "internal" ? "internal" : "public";
  const effectiveVisibility = authContext.authenticated ? requestedVisibility : "public";

  // 6. Search API: /api/search?q=...
  if (pathname === "/api/search") {
    const q = query.get("q") || query.get("query") || "";
    const language = query.get("language") || undefined;
    const limit = parseNonNegativeInt(query.get("limit"));
    if (limit === null) return sendBadParam(res, "limit");

    const result = searchKnowledge(dataset, {
      query: q,
      language,
      limit,
      visibility: effectiveVisibility,
    });
    return sendJson(res, 200, result);
  }

  // 7. Hybrid Search API: /api/search/hybrid?q=...
  if (pathname === "/api/search/hybrid") {
    const q = query.get("q") || query.get("query") || "";
    const language = query.get("language") || undefined;
    const limit = parseNonNegativeInt(query.get("limit"));
    if (limit === null) return sendBadParam(res, "limit");

    // If vector store is empty, vectorize automatically (once, even under concurrent requests)
    await ensureVectorized(dataset, store, provider);

    const result = await searchHybrid(q, dataset, store, provider, {
      language,
      limit,
    });
    return sendJson(res, 200, { status: "ok", data: result.results, totalHits: result.totalHits, tookMs: result.tookMs });
  }

  // 8. Vectorize Dataset: POST /api/vectorize
  if (pathname === "/api/vectorize" && req.method === "POST") {
    if (!authContext.isAdmin) {
      return sendJson(res, authContext.authenticated ? 403 : 401, {
        status: "error",
        error: "Re-indexing the vector store requires an admin API key.",
      });
    }
    const report = await vectorizeDataset(dataset, store, provider);
    return sendJson(res, 200, { status: "ok", report });
  }

  // 9. Knowledge Objects: /api/objects and /api/objects/:id
  if (pathname === "/api/objects") {
    const language = query.get("language") || undefined;
    const status = query.get("status") || undefined;
    const limit = parseNonNegativeInt(query.get("limit"));
    if (limit === null) return sendBadParam(res, "limit");
    const offset = parseNonNegativeInt(query.get("offset"));
    if (offset === null) return sendBadParam(res, "offset");

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

  // 10. Entities: /api/entities and /api/entities/:id
  if (pathname === "/api/entities") {
    const language = query.get("language") || undefined;
    const limit = parseNonNegativeInt(query.get("limit"));
    if (limit === null) return sendBadParam(res, "limit");
    const offset = parseNonNegativeInt(query.get("offset"));
    if (offset === null) return sendBadParam(res, "offset");

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

  // 11. AI Context: /api/context/:id
  const contextMatch = pathname.match(/^\/api\/context\/([^/]+)$/);
  if (contextMatch) {
    const objectId = contextMatch[1];
    const result = getAiContext(dataset, { objectId, visibility: effectiveVisibility });
    const status = result.status === "ok" ? 200 : result.status === "not-found" ? 404 : 403;
    return sendJson(res, status, result);
  }

  // 12. Formatted LLM Prompt Context: /api/prompt-context/:id
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

  // 13. Citations: /api/citations and /api/citations/:id
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

  // 14. Sources: /api/sources and /api/sources/:id
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

  // 15. Media: /api/media and /api/media/:id
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

  // 16. Validation report: /api/validate
  if (pathname === "/api/validate") {
    // Validation reports list every object, including drafts, so they are never public.
    if (!authContext.authenticated) {
      return sendJson(res, 401, { status: "error", error: "The validation report requires an API key." });
    }
    const mode = query.get("mode") === "internal" ? "internal" : "public";
    const report = runValidationPipeline({ dataset, config: { mode } });
    return sendJson(res, 200, report);
  }

  // Fallback 404
  return sendJson(res, 404, {
    status: "not-found",
    error: `Route '${pathname}' not found. Check /api/openapi.json for documentation.`,
  });
}
