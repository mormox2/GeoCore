import { cosineSimilarity } from "../math/vector-math.js";

export type VectorDocument = {
  id: string;
  objectId: string;
  chunkId?: string;
  text: string;
  vector: number[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
};

export type VectorSearchOptions = {
  limit?: number;
  minScore?: number;
  filter?: Record<string, unknown>;
};

export type VectorSearchResult = {
  document: VectorDocument;
  score: number;
  rank: number;
};

/**
 * Universal interface for vector database and index storage engines.
 */
export interface VectorStore {
  upsert(document: VectorDocument): Promise<void>;
  upsertBatch(documents: VectorDocument[]): Promise<void>;
  get(id: string): Promise<VectorDocument | null>;
  search(queryVector: number[], options?: VectorSearchOptions): Promise<VectorSearchResult[]>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
  clear(): Promise<void>;
}

/**
 * High-performance In-Memory Vector Store implementation with Cosine Similarity KNN search.
 */
export class MemoryVectorStore implements VectorStore {
  private documents = new Map<string, VectorDocument>();

  async upsert(document: VectorDocument): Promise<void> {
    this.documents.set(document.id, {
      ...document,
      createdAt: document.createdAt ?? new Date().toISOString(),
    });
  }

  async upsertBatch(documents: VectorDocument[]): Promise<void> {
    for (const doc of documents) {
      await this.upsert(doc);
    }
  }

  async get(id: string): Promise<VectorDocument | null> {
    return this.documents.get(id) ?? null;
  }

  async search(queryVector: number[], options: VectorSearchOptions = {}): Promise<VectorSearchResult[]> {
    const { limit = 10, minScore = 0.0, filter } = options;

    const scoredList: Array<{ document: VectorDocument; score: number }> = [];

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
        if (!match) continue;
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

  async delete(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  async count(): Promise<number> {
    return this.documents.size;
  }

  async clear(): Promise<void> {
    this.documents.clear();
  }
}
