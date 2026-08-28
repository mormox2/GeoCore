import type { KnowledgeObject, ResolvedMetadata } from "@mormo_mossaab/geocore";
export type KnowledgeChunk = {
    id: string;
    objectId: string;
    title: string;
    chunkIndex: number;
    totalChunks: number;
    content: string;
    heading?: string;
    language: string;
    entityIds: string[];
    citationIds: string[];
    charCount: number;
};
export type ChunkOptions = {
    maxChunkSize?: number;
    minChunkSize?: number;
    overlap?: number;
    entityIds?: string[];
    citationIds?: string[];
};
/**
 * Splits a Knowledge Object into semantic chunks suitable for vector embeddings / search indexing.
 * Preserves heading context and attaches metadata to each chunk.
 */
export declare function chunkKnowledgeObject(object: KnowledgeObject, metadata?: Partial<ResolvedMetadata>, options?: ChunkOptions): KnowledgeChunk[];
