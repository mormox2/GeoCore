import { describe, it, expect, vi, afterEach } from "vitest";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const listen = vi.fn(async (port: number, host: string) => ({ port, host, url: `http://${host}:${port}` }));
const createGeoCoreServer = vi.fn(() => ({ listen, close: vi.fn(async () => {}) }));
vi.mock("@mormo_mossaab/geocore-server", () => ({ createGeoCoreServer }));

const { serveCommand } = await import("../src/commands/serve.command.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = path.resolve(__dirname, "../../../examples/rtimidental/geocore.config.json");

describe("geocore serve host", () => {
  afterEach(() => {
    listen.mockClear();
    process.removeAllListeners("SIGINT");
    process.removeAllListeners("SIGTERM");
  });

  it("listens on the loopback interface unless --host is given", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await serveCommand({ config, json: true, port: 0 });
      expect(listen).toHaveBeenLastCalledWith(0, "127.0.0.1");

      await serveCommand({ config, json: true, port: 0, host: "0.0.0.0" });
      expect(listen).toHaveBeenLastCalledWith(0, "0.0.0.0");
    } finally {
      log.mockRestore();
    }
  });
});
