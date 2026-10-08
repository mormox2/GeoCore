import * as http from "node:http";
import { handleCors } from "../middleware/cors.js";
import { routeRequest } from "../routes/api-router.js";
import { MemoryVectorStore, DeterministicEmbeddingProvider } from "@mormo_mossaab/geocore-vector";
/**
 * Creates a standalone HTTP server instance for GeoCore.
 */
export function createGeoCoreServer(options) {
    const { dataset, port = 3000, host = "0.0.0.0", siteUrl, cors, auth } = options;
    // Each server instance owns its vector index unless one is injected.
    const vectorStore = options.vectorStore ?? new MemoryVectorStore();
    const embeddingProvider = options.embeddingProvider ?? new DeterministicEmbeddingProvider(64);
    const server = http.createServer(async (req, res) => {
        // 1. Handle CORS
        const isOptions = handleCors(req, res, cors);
        if (isOptions) {
            return;
        }
        // 2. Dispatch route
        try {
            await routeRequest(req, res, { dataset, siteUrl, auth, vectorStore, embeddingProvider });
        }
        catch (err) {
            // Internal error details stay in the server logs, never in the response body.
            console.error("[geocore-server] Unhandled request error:", err);
            if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
            }
            res.end(JSON.stringify({ status: "error", error: "Internal Server Error" }));
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
                server.close((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        },
    };
}
