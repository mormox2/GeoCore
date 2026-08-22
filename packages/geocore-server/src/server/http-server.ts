import * as http from "node:http";
import type { IncomingMessage, ServerResponse, Server } from "node:http";
import type { KnowledgeDataset } from "@mormox2/geocore";
import type { VectorStore, EmbeddingProvider } from "@mormox2/geocore-vector";
import { handleCors, CorsOptions } from "../middleware/cors.js";
import { routeRequest, RouterOptions } from "../routes/api-router.js";
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
  listen: (port?: number, host?: string) => Promise<{ port: number; host: string; url: string }>;
  close: () => Promise<void>;
};

/**
 * Creates a standalone HTTP server instance for GeoCore.
 */
export function createGeoCoreServer(options: GeoCoreServerOptions): GeoCoreServerInstance {
  const { dataset, port = 3000, host = "0.0.0.0", siteUrl, cors, auth, vectorStore, embeddingProvider } = options;

  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // 1. Handle CORS
    const isOptions = handleCors(req, res, cors);
    if (isOptions) {
      return;
    }

    // 2. Dispatch route
    try {
      await routeRequest(req, res, { dataset, siteUrl, auth, vectorStore, embeddingProvider });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ status: "error", error: message }));
    }
  });

  return {
    server,
    listen: (listenPort = port, listenHost = host) => {
      return new Promise((resolve, reject) => {
        server.listen(listenPort, listenHost, () => {
          const address = server.address();
          const actualPort = typeof address === "object" && address ? address.port : listenPort;
          const url = `http://${listenHost === "0.0.0.0" ? "localhost" : listenHost}:${actualPort}`;
          resolve({ port: actualPort, host: listenHost, url });
        });
        server.once("error", reject);
      });
    },
    close: () => {
      return new Promise((resolve, reject) => {
        server.close((err: Error | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
  };
}
