import { describe, it, expect, vi, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runCli } from "../src/cli.js";
import { EXIT_CODES } from "../src/utils/exit-codes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "geocore-init-"));

describe("geocore init", () => {
  afterEach(() => vi.restoreAllMocks());

  it("creates and initializes the requested directory", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const target = path.join(tmp(), "my-knowledge-base");

    expect(await runCli(["init", target])).toBe(EXIT_CODES.SUCCESS);
    expect(fs.existsSync(path.join(target, "geocore.config.json"))).toBe(true);
    expect(fs.statSync(path.join(target, "knowledge")).isDirectory()).toBe(true);
  });

  it("keeps an existing config unless --force is given", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const target = tmp();
    fs.writeFileSync(path.join(target, "geocore.config.json"), '{"custom":true}');

    await runCli(["init", target]);
    expect(fs.readFileSync(path.join(target, "geocore.config.json"), "utf8")).toBe('{"custom":true}');

    await runCli(["init", target, "--force"]);
    expect(fs.readFileSync(path.join(target, "geocore.config.json"), "utf8")).not.toBe('{"custom":true}');
  });

  it("refuses a target that is a file", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const file = path.join(tmp(), "not-a-dir");
    fs.writeFileSync(file, "x");
    expect(await runCli(["init", file])).not.toBe(EXIT_CODES.SUCCESS);
  });

  it("initializes the current directory when no directory is given", () => {
    const cwd = tmp();
    const bin = path.resolve(__dirname, "../dist/bin.js");
    const res = spawnSync(process.execPath, [bin, "init"], { cwd, encoding: "utf8" });
    expect(res.status).toBe(EXIT_CODES.SUCCESS);
    expect(fs.existsSync(path.join(cwd, "geocore.config.json"))).toBe(true);
  });

  it("rejects unknown arguments instead of silently ignoring them", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await runCli(["validate", "--confg", "x.json"])).toBe(EXIT_CODES.COMMAND_ERROR);
    expect(errors.mock.calls[0][0]).toContain("--confg");
    expect(await runCli(["init", path.join(tmp(), "a"), "extra"])).toBe(EXIT_CODES.COMMAND_ERROR);
  });
});
