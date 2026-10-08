import { describe, it, expect } from "vitest";
import * as http from "node:http";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolveStaticPath, serveStaticFile } from "../src/commands/studio.command.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Studio static file server", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "geocore-studio-"));
  fs.writeFileSync(path.join(root, "index.html"), "<h1>studio</h1>");
  fs.mkdirSync(path.join(root, "tests"));

  it("resolves files inside the studio directory", () => {
    expect(resolveStaticPath(root, "/")).toBe(path.join(root, "index.html"));
    expect(resolveStaticPath(root, "/app.js?v=1")).toBe(path.join(root, "app.js"));
  });

  it("refuses paths that escape the studio directory", () => {
    expect(resolveStaticPath(root, "/../../etc/passwd")).toBeNull();
    expect(resolveStaticPath(root, "/%2e%2e/%2e%2e/etc/passwd")).toBeNull();
    expect(resolveStaticPath(root, "/..%2f..%2fetc%2fpasswd")).toBeNull();
    expect(resolveStaticPath(root, "/%E0%A4%A")).toBeNull();
  });

  it("serves files, rejects traversal and survives directory requests", async () => {
    const server = http.createServer((req, res) => void serveStaticFile(root, req.url || "/", res));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as { port: number };

    const raw = (requestPath: string) =>
      new Promise<number>((resolve, reject) => {
        http
          .get({ host: "127.0.0.1", port, path: requestPath }, (res) => {
            res.resume();
            resolve(res.statusCode ?? 0);
          })
          .on("error", reject);
      });

    try {
      expect(await raw("/")).toBe(200);
      expect(await raw("/../../../../etc/hostname")).toBe(400);
      expect(await raw("/tests")).toBe(404);
      // The server must still be alive after the directory request.
      expect(await raw("/index.html")).toBe(200);
    } finally {
      server.close();
    }
  });
});

describe("CLI binary keeps long-running servers alive", () => {
  it("geocore serve keeps answering requests after startup", async () => {
    const bin = path.resolve(__dirname, "../dist/bin.js");
    const config = path.resolve(__dirname, "../../../examples/rtimidental/geocore.config.json");
    const child = spawn(process.execPath, [bin, "serve", "--config", config, "--port", "0", "--host", "127.0.0.1", "--json"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    try {
      const url = await new Promise<string>((resolve, reject) => {
        let out = "";
        child.stdout.on("data", (chunk) => {
          out += chunk;
          const match = out.match(/"url": "([^"]+)"/);
          if (match) resolve(match[1]);
        });
        child.on("exit", (code) => reject(new Error(`serve exited early with code ${code}`)));
      });

      await new Promise((r) => setTimeout(r, 300));
      expect(child.exitCode).toBeNull();
      const res = await fetch(`${url}/api/health`);
      expect(res.status).toBe(200);
    } finally {
      child.kill("SIGTERM");
    }
  }, 20000);
});

describe("Studio packaging", () => {
  it("prefers the repository sources, then the copy bundled in the package", async () => {
    const { resolveStudioDir } = await import("../src/commands/studio.command.js");
    const repoRoot = path.resolve(__dirname, "../../..");
    expect(resolveStudioDir(repoRoot)).toBe(path.join(repoRoot, "apps/geocore-studio"));

    // Outside the repository (e.g. a user project), the bundled copy must be found.
    const elsewhere = fs.mkdtempSync(path.join(os.tmpdir(), "geocore-user-"));
    const resolved = resolveStudioDir(elsewhere);
    expect(resolved).toBe(path.resolve(__dirname, "../studio"));
    expect(fs.existsSync(path.join(resolved!, "engine.js"))).toBe(true);
  });

  it("ships the studio in the npm tarball", async () => {
    const { execFileSync } = await import("node:child_process");
    const out = execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: path.resolve(__dirname, ".."),
      encoding: "utf-8",
    });
    const files = (JSON.parse(out)[0].files as Array<{ path: string }>).map((f) => f.path);
    for (const file of ["studio/index.html", "studio/app.js", "studio/engine.js", "studio/styles.css"]) {
      expect(files).toContain(file);
    }
    expect(files.some((f) => f.startsWith("studio/tests"))).toBe(false);
  }, 60000);
});
