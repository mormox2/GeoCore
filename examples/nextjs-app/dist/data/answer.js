import { getAiContext } from "@mormo_mossaab/geocore";
import { buildExtractiveAnswer, verifyAnswerGrounding, } from "@mormo_mossaab/geocore-ai";
import { searchHybrid, vectorizeDataset, MemoryVectorStore, DeterministicEmbeddingProvider, } from "@mormo_mossaab/geocore-vector";
import { appDataset } from "./dataset.js";
// Cached vector index shared by the chat and widget routes of this app.
const vectorStore = new MemoryVectorStore();
const embeddingProvider = new DeterministicEmbeddingProvider(64);
let vectorizing = null;
async function ensureVectorized() {
    vectorizing ??= vectorizeDataset(appDataset, vectorStore, embeddingProvider);
    await vectorizing;
}
/** Answers from one known object, or null when nothing in it relates to the question. */
export function answerFromObject(question, objectId) {
    const contextRes = getAiContext(appDataset, { objectId, visibility: "public" });
    if (contextRes.status !== "ok" || !contextRes.data)
        return null;
    const context = contextRes.data;
    const extracted = buildExtractiveAnswer(question || context.object.title, context);
    if (!extracted.answer)
        return null;
    const grounding = verifyAnswerGrounding(extracted.answer, context);
    return grounding.isGrounded ? { answer: extracted.answer, context, grounding } : null;
}
/**
 * Finds the best published object for a question with hybrid search and answers with
 * sentences extracted from it. Returns null rather than guessing when nothing relevant
 * and grounded is found.
 */
export async function answerQuestion(question, language) {
    if (!question.trim())
        return null;
    await ensureVectorized();
    const hits = await searchHybrid(question, appDataset, vectorStore, embeddingProvider, { language, limit: 3 });
    for (const hit of hits.results) {
        const contextRes = getAiContext(appDataset, { objectId: hit.objectId, visibility: "public" });
        if (contextRes.status !== "ok" || !contextRes.data)
            continue;
        const extracted = buildExtractiveAnswer(question, contextRes.data);
        if (extracted.matchedQueryTerms === 0 || !extracted.answer)
            continue;
        const grounding = verifyAnswerGrounding(extracted.answer, contextRes.data);
        if (!grounding.isGrounded)
            continue;
        return {
            answer: extracted.answer,
            context: contextRes.data,
            grounding,
            matchType: hit.matchType,
            combinedScore: hit.combinedScore,
        };
    }
    return null;
}
