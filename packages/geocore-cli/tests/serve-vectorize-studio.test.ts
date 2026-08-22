import { describe, it, expect, vi } from "vitest";
import { runCli } from "../src/cli.js";
import { EXIT_CODES } from "../src/utils/exit-codes.js";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rtimiConfigPath = path.resolve(__dirname, "../../../examples/rtimidental/geocore.config.json");

describe("CLI Extended Commands: serve, vectorize, studio", () => {
  it("runs vectorize command in JSON mode", async () => {
    let captured = "";
    const originalLog = console.log;
    console.log = (msg: string) => {
      captured += msg;
    };

    try {
      const exitCode = await runCli(["vectorize", "--config", rtimiConfigPath, "--json", "--dim", "32"]);
      expect(exitCode).toBe(EXIT_CODES.SUCCESS);
      const parsed = JSON.parse(captured);
      expect(parsed.status).toBe("ok");
      expect(parsed.dimension).toBe(32);
      expect(parsed.objectsProcessed).toBeGreaterThan(0);
      expect(parsed.vectorsIndexed).toBeGreaterThan(0);
    } finally {
      console.log = originalLog;
    }
  });

  it("parses serve arguments and help menu accurately", async () => {
    let captured = "";
    const originalLog = console.log;
    console.log = (msg: string) => {
      captured += msg;
    };

    try {
      const exitCode = await runCli(["--help"]);
      expect(exitCode).toBe(EXIT_CODES.SUCCESS);
      expect(captured).toContain("geocore serve");
      expect(captured).toContain("geocore vectorize");
      expect(captured).toContain("geocore studio");
    } finally {
      console.log = originalLog;
    }
  });
});
