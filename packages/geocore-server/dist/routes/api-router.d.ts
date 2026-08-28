import type { IncomingMessage, ServerResponse } from "node:http";
import type { KnowledgeDataset } from "@mormo_mossaab/geocore";
import { type VectorStore, type EmbeddingProvider } from "@mormo_mossaab/geocore-vector";
import { AuthOptions } from "../middleware/auth.js";
export type RouterOptions = {
    dataset: KnowledgeDataset;
    siteUrl?: string;
    auth?: AuthOptions;
    vectorStore?: VectorStore;
    embeddingProvider?: EmbeddingProvider;
};
/**
 * Main request router for GeoCore HTTP server.
 */
export declare function routeRequest(req: IncomingMessage, res: ServerResponse, options: RouterOptions): Promise<void>;
