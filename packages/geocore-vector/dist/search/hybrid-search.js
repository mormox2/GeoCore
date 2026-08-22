import { searchKnowledge } from "@mormox2/geocore";
/**
 * Executes a hybrid search across a KnowledgeDataset combining BM25 keyword matching
 * and dense vector semantic search, blended with Reciprocal Rank Fusion (RRF).
 */
export async function searchHybrid(query, dataset, store, provider, options = {}) {
    const startTime = Date.now();
    const limit = options.limit ?? 10;
    const k = options.rrfConstant ?? 60;
    const wLex = options.lexicalWeight ?? 1.0;
    const wVec = options.vectorWeight ?? 1.0;
    // 1. Execute Lexical Search (BM25 / Full text index)
    const lexicalRes = searchKnowledge(dataset, {
        query,
        language: options.language,
        limit: limit * 2,
        visibility: "public",
    });
    const lexicalItems = lexicalRes.status === "ok" && lexicalRes.data ? lexicalRes.data : [];
    // 2. Execute Vector Semantic Search
    const queryVector = await provider.embedText(query);
    const vectorHits = await store.search(queryVector, {
        limit: limit * 2,
        minScore: options.minVectorScore ?? 0.1,
    });
    // 3. Compute Reciprocal Rank Fusion (RRF) Scores
    const itemMap = new Map();
    // Helper to resolve object details from dataset
    const objMap = new Map(dataset.objects.map((o) => [o.id, o]));
    // Lexical ranks
    for (let i = 0; i < lexicalItems.length; i++) {
        const item = lexicalItems[i];
        const objectId = item.sourceId || item.id;
        const rank = i + 1;
        const rrfContribution = wLex / (k + rank);
        const existing = itemMap.get(objectId);
        if (existing) {
            existing.lexicalRank = rank;
            existing.rrfScore += rrfContribution;
            if (!existing.summary)
                existing.summary = item.summary;
        }
        else {
            const obj = objMap.get(objectId);
            itemMap.set(objectId, {
                objectId,
                title: item.title,
                slug: item.slug ?? obj?.slug,
                language: item.language ?? obj?.language,
                summary: item.summary,
                lexicalRank: rank,
                rrfScore: rrfContribution,
            });
        }
    }
    // Vector ranks
    for (let i = 0; i < vectorHits.length; i++) {
        const hit = vectorHits[i];
        const rank = i + 1;
        const rrfContribution = wVec / (k + rank);
        const objectId = hit.document.objectId;
        const existing = itemMap.get(objectId);
        if (existing) {
            existing.vectorRank = rank;
            existing.vectorSimilarity = hit.score;
            existing.rrfScore += rrfContribution;
            if (!existing.matchedChunkText)
                existing.matchedChunkText = hit.document.text;
        }
        else {
            const obj = objMap.get(objectId);
            itemMap.set(objectId, {
                objectId,
                title: hit.document.metadata?.title || obj?.title || objectId,
                slug: hit.document.metadata?.slug || obj?.slug,
                language: hit.document.metadata?.language || obj?.language,
                matchedChunkText: hit.document.text,
                vectorRank: rank,
                vectorSimilarity: hit.score,
                rrfScore: rrfContribution,
            });
        }
    }
    // 4. Sort by combined RRF score descending
    const sorted = Array.from(itemMap.values()).sort((a, b) => b.rrfScore - a.rrfScore);
    // 5. Build results list
    const results = sorted.slice(0, limit).map((item) => {
        let matchType = "semantic-only";
        if (item.lexicalRank && item.vectorRank) {
            matchType = "both";
        }
        else if (item.lexicalRank) {
            matchType = "lexical-only";
        }
        return {
            id: item.objectId,
            objectId: item.objectId,
            title: item.title,
            slug: item.slug,
            language: item.language,
            summary: item.summary,
            matchedChunkText: item.matchedChunkText,
            combinedScore: Math.round(item.rrfScore * 10000) / 10000,
            lexicalRank: item.lexicalRank,
            vectorRank: item.vectorRank,
            vectorSimilarity: item.vectorSimilarity,
            matchType,
        };
    });
    return {
        query,
        totalHits: sorted.length,
        results,
        tookMs: Date.now() - startTime,
    };
}
