import type { KnowledgeDataset } from "@mormo_mossaab/geocore";
import type { EmbeddingProvider } from "../embedding/embedding-provider.js";
import type { VectorStore } from "../store/vector-store.js";
export type VectorizeDatasetOptions = {
    chunkSize?: number;
    overlap?: number;
    batchSize?: number;
};
export type VectorizeDatasetReport = {
    objectsProcessed: number;
    chunksGenerated: number;
    vectorsIndexed: number;
    durationMs: number;
};
/**
 * Splits all published objects in a KnowledgeDataset into semantic chunks,
 * embeds them using the provided EmbeddingProvider, and indexes them into the VectorStore.
 */
export declare function vectorizeDataset(dataset: KnowledgeDataset, store: VectorStore, provider: EmbeddingProvider, options?: VectorizeDatasetOptions): Promise<VectorizeDatasetReport>;
