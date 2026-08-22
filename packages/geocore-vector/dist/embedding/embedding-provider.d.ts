/**
 * Universal interface for vector embedding generation.
 */
export interface EmbeddingProvider {
    /**
     * Generates a dense embedding vector for a single text.
     */
    embedText(text: string): Promise<number[]>;
    /**
     * Generates dense embedding vectors for a batch of texts.
     */
    embedBatch(texts: string[]): Promise<number[][]>;
    /**
     * Returns the dimension of the embedding space.
     */
    getDimension(): number;
}
/**
 * High-performance deterministic embedding provider for offline testing and fast local execution.
 * Maps n-grams, tokens, and character hashes to a normalized float vector.
 */
export declare class DeterministicEmbeddingProvider implements EmbeddingProvider {
    private dimension;
    constructor(dimension?: number);
    getDimension(): number;
    embedText(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}
export type OpenAiEmbeddingOptions = {
    apiKey: string;
    model?: "text-embedding-3-small" | "text-embedding-3-large" | "text-embedding-ada-002" | string;
    dimensions?: number;
    baseUrl?: string;
};
/**
 * Production OpenAI Embeddings Provider calling the /v1/embeddings endpoint.
 */
export declare class OpenAiEmbeddingProvider implements EmbeddingProvider {
    private apiKey;
    private model;
    private dimension;
    private baseUrl;
    constructor(options: OpenAiEmbeddingOptions);
    getDimension(): number;
    embedText(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}
/**
 * Custom function-driven embedding provider.
 */
export declare class CustomEmbeddingProvider implements EmbeddingProvider {
    private dimension;
    private embedFn;
    constructor(dimension: number, embedFn: (text: string) => Promise<number[]>);
    getDimension(): number;
    embedText(text: string): Promise<number[]>;
    embedBatch(texts: string[]): Promise<number[][]>;
}
