import type { KnowledgeDataset } from "@mormox2/geocore";
import type { EmbeddingProvider } from "../embedding/embedding-provider.js";
import type { VectorStore } from "../store/vector-store.js";
export type HybridSearchOptions = {
    limit?: number;
    language?: string;
    rrfConstant?: number;
    lexicalWeight?: number;
    vectorWeight?: number;
    minVectorScore?: number;
};
export type HybridSearchResultItem = {
    id: string;
    objectId: string;
    title: string;
    slug?: string;
    language?: string;
    summary?: string;
    matchedChunkText?: string;
    combinedScore: number;
    lexicalRank?: number;
    vectorRank?: number;
    vectorSimilarity?: number;
    matchType: "both" | "lexical-only" | "semantic-only";
};
export type HybridSearchResponse = {
    query: string;
    totalHits: number;
    results: HybridSearchResultItem[];
    tookMs: number;
};
/**
 * Executes a hybrid search across a KnowledgeDataset combining BM25 keyword matching
 * and dense vector semantic search, blended with Reciprocal Rank Fusion (RRF).
 */
export declare function searchHybrid(query: string, dataset: KnowledgeDataset, store: VectorStore, provider: EmbeddingProvider, options?: HybridSearchOptions): Promise<HybridSearchResponse>;
