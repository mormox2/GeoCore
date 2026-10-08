import { getAiContext } from "@mormo_mossaab/geocore";
import { buildPromptContext, verifyAnswerGrounding } from "@mormo_mossaab/geocore-ai";
import { searchHybrid, vectorizeDataset, MemoryVectorStore, DeterministicEmbeddingProvider, } from "@mormo_mossaab/geocore-vector";
import { appDataset } from "../../../data/dataset.js";
// Cached vector store for Next.js route handler
const vectorStore = new MemoryVectorStore();
const embeddingProvider = new DeterministicEmbeddingProvider(64);
let isVectorized = false;
async function ensureVectorized() {
    if (!isVectorized) {
        await vectorizeDataset(appDataset, vectorStore, embeddingProvider);
        isVectorized = true;
    }
}
/** Strips Markdown headings and emphasis so certified body text can be shown as an answer. */
function toPlainText(markdown) {
    return markdown
        .split("\n")
        .filter((line) => !/^\s*#/.test(line))
        .join(" ")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
/**
 * Next.js 14+ POST handler for AI / RAG conversational queries with Hybrid Semantic Search.
 */
export async function POST(req) {
    try {
        const body = (await req.json());
        const query = body.message || "";
        await ensureVectorized();
        // 1. Resolve relevant Knowledge Object via Hybrid Semantic Search (RRF) or explicit ID
        let targetObjectId = body.objectId;
        let matchType;
        let combinedScore;
        if (!targetObjectId && query) {
            const hybridRes = await searchHybrid(query, appDataset, vectorStore, embeddingProvider, { limit: 1 });
            if (hybridRes.results.length > 0) {
                targetObjectId = hybridRes.results[0].objectId;
                matchType = hybridRes.results[0].matchType;
                combinedScore = hybridRes.results[0].combinedScore;
            }
        }
        if (!targetObjectId) {
            return new Response(JSON.stringify({ error: "No relevant authoritative knowledge context found." }), { status: 404, headers: { "Content-Type": "application/json" } });
        }
        // 2. Fetch authoritative AI Context Package
        const contextRes = getAiContext(appDataset, { objectId: targetObjectId, visibility: "public" });
        if (contextRes.status !== "ok" || !contextRes.data) {
            return new Response(JSON.stringify({ error: "No relevant authoritative knowledge context found." }), { status: 404, headers: { "Content-Type": "application/json" } });
        }
        const aiPackage = contextRes.data;
        // 3. Build formatted LLM Prompt Context with citation guardrails
        const promptContext = buildPromptContext(aiPackage);
        // 4. Answer extractively from the certified knowledge object. A production app would
        //    send promptContext to an LLM here; the grounding check below applies either way.
        const answer = toPlainText(aiPackage.object.body);
        // 5. Verify Grounding & Guardrails
        const grounding = verifyAnswerGrounding(answer, aiPackage);
        const payload = {
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
    }
    catch (err) {
        console.error("[chat] request failed:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
