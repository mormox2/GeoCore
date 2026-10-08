import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { CliError } from "../utils/cli-error.js";
const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
};
/**
 * Resolves a request URL to a file path inside rootDir.
 * Returns null when the URL is malformed or escapes rootDir (path traversal).
 */
export function resolveStaticPath(rootDir, requestUrl) {
    let pathname;
    try {
        pathname = decodeURIComponent(requestUrl.split(/[?#]/)[0]);
    }
    catch {
        return null;
    }
    if (pathname.includes("\0") || pathname.split(/[\\/]/).includes(".."))
        return null;
    if (pathname === "/" || pathname === "")
        pathname = "/index.html";
    const root = path.resolve(rootDir);
    const filePath = path.resolve(root, "." + path.posix.normalize("/" + pathname));
    // Defence in depth: the resolved path must stay inside the studio directory.
    return filePath.startsWith(root + path.sep) ? filePath : null;
}
function sendPlain(res, statusCode, text) {
    if (!res.headersSent) {
        res.statusCode = statusCode;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
    }
    res.end(text);
}
export async function serveStaticFile(rootDir, requestUrl, res) {
    const filePath = resolveStaticPath(rootDir, requestUrl);
    if (!filePath) {
        sendPlain(res, 400, "400 Bad Request");
        return;
    }
    let stat;
    try {
        stat = await fs.promises.stat(filePath);
    }
    catch {
        sendPlain(res, 404, "404 Not Found");
        return;
    }
    if (!stat.isFile()) {
        sendPlain(res, 404, "404 Not Found");
        return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
    res.setHeader("X-Content-Type-Options", "nosniff");
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => sendPlain(res, 500, "500 Internal Server Error"));
    stream.pipe(res);
}
/**
 * Locates the Studio app: the monorepo sources when running from the repository root
 * (live edits), otherwise the copy bundled in this package at build time.
 */
export function resolveStudioDir(cwd = process.cwd()) {
    const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
    const candidates = [
        path.resolve(cwd, "apps/geocore-studio"),
        path.join(packageDir, "studio"),
        path.resolve(packageDir, "../../apps/geocore-studio"),
    ];
    return candidates.find((dir) => fs.existsSync(path.join(dir, "index.html"))) ?? null;
}
export async function studioCommand(options = {}) {
    const port = options.port ?? 4200;
    const host = options.host ?? "127.0.0.1";
    const targetDir = resolveStudioDir();
    if (!targetDir) {
        throw new CliError("COMMAND_ERROR", "GeoCore Studio files were not found. Reinstall @mormo_mossaab/geocore-cli or run from the GeoCore repository root.");
    }
    const server = http.createServer((req, res) => {
        void serveStaticFile(targetDir, req.url || "/", res);
    });
    await new Promise((resolve) => {
        server.listen(port, host, () => {
            resolve();
        });
    });
    const url = `http://${host}:${port}`;
    if (options.json) {
        console.log(JSON.stringify({
            status: "running",
            url,
            port,
            host,
            studioDir: targetDir,
        }, null, 2));
    }
    else {
        console.log(`\n🎨 GeoCore Visual Studio running!`);
        console.log(`--------------------------------------------------`);
        console.log(`🌐 URL:          ${url}`);
        console.log(`📂 Studio Path:  ${targetDir}`);
        console.log(`✨ Features:     2D Graph, Live Editor & RAG Grounding`);
        console.log(`--------------------------------------------------\n`);
    }
    // Graceful shutdown handlers
    const shutdown = () => {
        server.close();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
