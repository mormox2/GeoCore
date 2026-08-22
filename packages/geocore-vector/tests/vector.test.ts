import { describe, it, expect, beforeEach } from "vitest";
import {
  dotProduct,
  vectorMagnitude,
  cosineSimilarity,
  normalizeVector,
  euclideanDistance,
  DeterministicEmbeddingProvider,
  CustomEmbeddingProvider,
  MemoryVectorStore,
  vectorizeDataset,
  searchHybrid,
} from "../src/index.js";
import { apiDatasetFixture, rtimidentalFixture } from "@mormox2/geocore";

describe("GeoCore Vector & Hybrid Search Engine", () => {
  describe("Vector Math Operations", () => {
    it("computes dot product of two vectors", () => {
      const a = [1, 2, 3];
      const b = [4, 5, 6];
      expect(dotProduct(a, b)).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });

    it("computes vector magnitude and normalization", () => {
      const v = [3, 4];
      expect(vectorMagnitude(v)).toBe(5);
      const norm = normalizeVector(v);
      expect(norm[0]).toBeCloseTo(0.6);
      expect(norm[1]).toBeCloseTo(0.8);
      expect(vectorMagnitude(norm)).toBeCloseTo(1.0);
    });

    it("computes cosine similarity accurately", () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      const c = [0, 1, 0];
      const d = [-1, 0, 0];

      expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
      expect(cosineSimilarity(a, c)).toBeCloseTo(0.0);
      expect(cosineSimilarity(a, d)).toBeCloseTo(-1.0);
    });

    it("computes euclidean distance", () => {
      const a = [0, 0];
      const b = [3, 4];
      expect(euclideanDistance(a, b)).toBe(5);
    });
  });

  describe("Embedding Providers", () => {
    it("generates deterministic normalized embeddings", async () => {
      const provider = new DeterministicEmbeddingProvider(64);
      expect(provider.getDimension()).toBe(64);

      const emb1 = await provider.embedText("Détartrage dentaire");
      const emb2 = await provider.embedText("Détartrage dentaire");
      const emb3 = await provider.embedText("Plaque dentaire et tartre");

      expect(emb1.length).toBe(64);
      expect(vectorMagnitude(emb1)).toBeCloseTo(1.0);
      // Same text yields identical embedding
      expect(cosineSimilarity(emb1, emb2)).toBeCloseTo(1.0);
      // Semantically related text yields positive similarity
      expect(cosineSimilarity(emb1, emb3)).toBeGreaterThan(0.3);
    });

    it("supports custom embedding provider functions", async () => {
      const custom = new CustomEmbeddingProvider(3, async () => [0.6, 0.8, 0.0]);
      const res = await custom.embedText("custom test");
      expect(res).toEqual([0.6, 0.8, 0.0]);
    });
  });

  describe("MemoryVectorStore", () => {
    let store: MemoryVectorStore;

    beforeEach(() => {
      store = new MemoryVectorStore();
    });

    it("upserts and retrieves documents", async () => {
      await store.upsert({
        id: "doc_1",
        objectId: "ko_1",
        text: "Document text",
        vector: [1, 0, 0],
        metadata: { category: "dental" },
      });

      expect(await store.count()).toBe(1);
      const doc = await store.get("doc_1");
      expect(doc?.text).toBe("Document text");
      expect(doc?.metadata?.category).toBe("dental");
    });

    it("executes nearest neighbor vector search with filtering", async () => {
      await store.upsertBatch([
        { id: "d1", objectId: "ko_1", text: "Dental care", vector: [1, 0, 0], metadata: { lang: "fr" } },
        { id: "d2", objectId: "ko_2", text: "Poultry care", vector: [0, 1, 0], metadata: { lang: "fr" } },
        { id: "d3", objectId: "ko_3", text: "General health", vector: [0.7, 0.7, 0], metadata: { lang: "en" } },
      ]);

      // Query close to d1
      const results = await store.search([0.9, 0.1, 0], { limit: 2 });
      expect(results.length).toBe(2);
      expect(results[0].document.id).toBe("d1");
      expect(results[0].rank).toBe(1);
      expect(results[0].score).toBeGreaterThan(0.9);

      // Search with metadata filter
      const filtered = await store.search([1, 0, 0], { filter: { lang: "en" } });
      expect(filtered.length).toBe(1);
      expect(filtered[0].document.id).toBe("d3");
    });
  });

  describe("Dataset Vectorization Pipeline", () => {
    it("vectorizes all published objects from a KnowledgeDataset", async () => {
      const store = new MemoryVectorStore();
      const provider = new DeterministicEmbeddingProvider(32);

      const report = await vectorizeDataset(apiDatasetFixture, store, provider, {
        chunkSize: 400,
      });

      expect(report.objectsProcessed).toBe(2); // 2 published objects in apiDatasetFixture
      expect(report.chunksGenerated).toBeGreaterThan(0);
      expect(report.vectorsIndexed).toBe(report.chunksGenerated);
      expect(await store.count()).toBe(report.vectorsIndexed);
    });
  });

  describe("Hybrid Search with Reciprocal Rank Fusion", () => {
    it("combines lexical BM25 and vector semantic search with RRF scores", async () => {
      const store = new MemoryVectorStore();
      const provider = new DeterministicEmbeddingProvider(64);

      // Index dataset into vector store
      await vectorizeDataset(apiDatasetFixture, store, provider);

      // Execute Hybrid Search
      const searchRes = await searchHybrid("détartrage", apiDatasetFixture, store, provider, {
        limit: 5,
      });

      expect(searchRes.totalHits).toBeGreaterThan(0);
      expect(searchRes.results.length).toBeGreaterThan(0);

      const topHit = searchRes.results[0];
      expect(topHit.objectId).toBe("ko_detartrage_abime_dents");
      expect(topHit.title).toContain("détartrage");
      expect(topHit.combinedScore).toBeGreaterThan(0);
      expect(topHit.matchType).toBe("both"); // Matched in both lexical and semantic channels
    });
  });
});
