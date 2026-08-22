import type { Server } from "node:http";
import type { KnowledgeDataset } from "@mormox2/geocore";
import type { VectorStore, EmbeddingProvider } from "@mormox2/geocore-vector";
import { CorsOptions } from "../middleware/cors.js";
import { AuthOptions } from "../middleware/auth.js";
export type GeoCoreServerOptions = {
    dataset: KnowledgeDataset;
    port?: number;
    host?: string;
    siteUrl?: string;
    cors?: CorsOptions;
    auth?: AuthOptions;
    vectorStore?: VectorStore;
    embeddingProvider?: EmbeddingProvider;
};
export type GeoCoreServerInstance = {
    server: Server;
    listen: (port?: number, host?: string) => Promise<{
        port: number;
        host: string;
        url: string;
    }>;
    close: () => Promise<void>;
};
/**
 * Creates a standalone HTTP server instance for GeoCore.
 */
export declare function createGeoCoreServer(options: GeoCoreServerOptions): GeoCoreServerInstance;
