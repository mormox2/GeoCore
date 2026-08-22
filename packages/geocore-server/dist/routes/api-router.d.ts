import type { IncomingMessage, ServerResponse } from "node:http";
import type { KnowledgeDataset } from "@mormox2/geocore";
import { type VectorStore, type EmbeddingProvider } from "@mormox2/geocore-vector";
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
