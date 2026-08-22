import * as http from "node:http";
import { handleCors } from "../middleware/cors.js";
import { routeRequest } from "../routes/api-router.js";
/**
 * Creates a standalone HTTP server instance for GeoCore.
 */
export function createGeoCoreServer(options) {
    const { dataset, port = 3000, host = "0.0.0.0", siteUrl, cors, auth } = options;
    const server = http.createServer((req, res) => {
        // 1. Handle CORS
        const isOptions = handleCors(req, res, cors);
        if (isOptions) {
            return;
        }
        // 2. Dispatch route
        try {
            routeRequest(req, res, { dataset, siteUrl, auth });
        }
        catch (err) {
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
