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
export declare class MemoryVectorStore implements VectorStore {
    private documents;
    upsert(document: VectorDocument): Promise<void>;
    upsertBatch(documents: VectorDocument[]): Promise<void>;
    get(id: string): Promise<VectorDocument | null>;
    search(queryVector: number[], options?: VectorSearchOptions): Promise<VectorSearchResult[]>;
    delete(id: string): Promise<boolean>;
    count(): Promise<number>;
    clear(): Promise<void>;
}
