import { describe, it, expect, vi, afterEach } from "vitest";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const listen = vi.fn(async (port: number, host: string) => ({ port, host, url: `http://${host}:${port}` }));
const createGeoCoreServer = vi.fn((_options: unknown) => ({ listen, close: vi.fn(async () => {}) }));
vi.mock("@mormo_mossaab/geocore-server", () => ({ createGeoCoreServer }));

const { serveCommand } = await import("../src/commands/serve.command.js");
const { parseArgs } = await import("../src/utils/parse-args.js");
const { CliError } = await import("../src/utils/cli-error.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = path.resolve(__dirname, "../../../examples/rtimidental/geocore.config.json");

describe("geocore serve --api-key", () => {
  afterEach(() => {
    listen.mockClear();
    createGeoCoreServer.mockClear();
    process.removeAllListeners("SIGINT");
    process.removeAllListeners("SIGTERM");
  });

  it.each([["an empty key", ""], ["a blank key", "   "]])("refuses %s instead of serving without auth", async (_label, apiKey) => {
    const result = serveCommand({ config, json: true, port: 0, apiKey });
    await expect(result).rejects.toBeInstanceOf(CliError);
    await expect(result).rejects.toThrow(/--api-key is empty/);
    expect(createGeoCoreServer).not.toHaveBeenCalled();
  });

  it("passes a real key to the server", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await serveCommand({ config, json: true, port: 0, apiKey: "secret" });
      expect(createGeoCoreServer).toHaveBeenCalledWith(
        expect.objectContaining({ auth: { apiKeys: ["secret"] } })
      );
    } finally {
      log.mockRestore();
    }
  });

  it("still serves without auth when --api-key is left out", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await serveCommand({ config, json: true, port: 0 });
      expect(createGeoCoreServer).toHaveBeenCalledWith(expect.objectContaining({ auth: undefined }));
    } finally {
      log.mockRestore();
    }
  });
});

describe("parseArgs --api-key", () => {
  it("reads the value that follows the flag", () => {
    expect(parseArgs(["serve", "--api-key", "secret"]).flags.apiKey).toBe("secret");
  });

  it("turns a flag without a value into an empty key so serve can reject it", () => {
    expect(parseArgs(["serve", "--api-key"]).flags.apiKey).toBe("");
  });

  it("leaves the key undefined when the flag is absent", () => {
    expect(parseArgs(["serve"]).flags.apiKey).toBeUndefined();
  });
});
