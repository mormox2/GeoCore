import type { IncomingMessage, ServerResponse } from "node:http";
import type { KnowledgeDataset } from "@mormox2/geocore";
import { AuthOptions } from "../middleware/auth.js";
export type RouterOptions = {
    dataset: KnowledgeDataset;
    siteUrl?: string;
    auth?: AuthOptions;
};
/**
 * Main request router for GeoCore HTTP server.
 */
export declare function routeRequest(req: IncomingMessage, res: ServerResponse, options: RouterOptions): void;
