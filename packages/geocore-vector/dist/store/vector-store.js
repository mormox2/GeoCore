import { cosineSimilarity } from "../math/vector-math.js";
/**
 * High-performance In-Memory Vector Store implementation with Cosine Similarity KNN search.
 */
export class MemoryVectorStore {
    documents = new Map();
    async upsert(document) {
        this.documents.set(document.id, {
            ...document,
            createdAt: document.createdAt ?? new Date().toISOString(),
        });
    }
    async upsertBatch(documents) {
        for (const doc of documents) {
            await this.upsert(doc);
        }
    }
    async get(id) {
        return this.documents.get(id) ?? null;
    }
    async search(queryVector, options = {}) {
        const { limit = 10, minScore = 0.0, filter } = options;
        const scoredList = [];
        for (const doc of this.documents.values()) {
            // 1. Check metadata filter if specified
            if (filter && doc.metadata) {
                let match = true;
                for (const [key, val] of Object.entries(filter)) {
                    if (doc.metadata[key] !== val) {
                        match = false;
                        break;
                    }
                }
                if (!match)
                    continue;
            }
            // 2. Compute similarity
            const score = cosineSimilarity(queryVector, doc.vector);
            if (score >= minScore) {
                scoredList.push({ document: doc, score });
            }
        }
        // Sort descending by similarity score
        scoredList.sort((a, b) => b.score - a.score);
        const results = scoredList.slice(0, limit).map((item, index) => ({
            document: item.document,
            score: Math.round(item.score * 10000) / 10000,
            rank: index + 1,
        }));
        return results;
    }
    async delete(id) {
        return this.documents.delete(id);
    }
    async count() {
        return this.documents.size;
    }
    async clear() {
        this.documents.clear();
    }
}
