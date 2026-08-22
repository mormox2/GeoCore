import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

export type StudioCommandOptions = {
  port?: number;
  host?: string;
  json?: boolean;
};

export async function studioCommand(options: StudioCommandOptions = {}): Promise<void> {
  const port = options.port ?? 4200;
  const host = options.host ?? "127.0.0.1";

  // Resolve studio directory relative to package or workspace
  const studioDir = path.resolve(process.cwd(), "apps/geocore-studio");
  const fallbackDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../apps/geocore-studio");
  const targetDir = fs.existsSync(studioDir) ? studioDir : fallbackDir;

  const server = http.createServer((req, res) => {
    let reqPath = (req.url || "/").split("?")[0];
    if (reqPath === "/" || reqPath === "") {
      reqPath = "/index.html";
    }

    const filePath = path.join(targetDir, reqPath);

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise<void>((resolve) => {
    server.listen(port, host, () => {
      resolve();
    });
  });

  const url = `http://${host}:${port}`;

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          status: "running",
          url,
          port,
          host,
          studioDir: targetDir,
        },
        null,
        2
      )
    );
  } else {
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
