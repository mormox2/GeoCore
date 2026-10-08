import * as http from "node:http";
/**
 * Resolves a request URL to a file path inside rootDir.
 * Returns null when the URL is malformed or escapes rootDir (path traversal).
 */
export declare function resolveStaticPath(rootDir: string, requestUrl: string): string | null;
export declare function serveStaticFile(rootDir: string, requestUrl: string, res: http.ServerResponse): Promise<void>;
/**
 * Locates the Studio app: the monorepo sources when running from the repository root
 * (live edits), otherwise the copy bundled in this package at build time.
 */
export declare function resolveStudioDir(cwd?: string): string | null;
export type StudioCommandOptions = {
    port?: number;
    host?: string;
    json?: boolean;
};
export declare function studioCommand(options?: StudioCommandOptions): Promise<void>;
