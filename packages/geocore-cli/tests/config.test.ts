import { describe, it, expect } from "vitest";
import { loadConfig } from "../src/config/load-config.js";
import { DEFAULT_CONFIG } from "../src/config/default-config.js";
import * as fs from "fs";

describe("CLI Config Loader Tests", () => {
  it("default config loads when no config exists", () => {
    const config = loadConfig(undefined);
    expect(config.siteName).toBe(DEFAULT_CONFIG.siteName);
    expect(config.knowledgeDir).toBe(DEFAULT_CONFIG.knowledgeDir);
    expect(config.outputDir).toBe(DEFAULT_CONFIG.outputDir);
  });

  it("config file merges with defaults", () => {
    const tempConfig = {
      siteName: "My Custom Site",
      knowledgeDir: "custom-knowledge",
    };
    const path = "temp-geocore-config.json";
    fs.writeFileSync(path, JSON.stringify(tempConfig), "utf8");

    try {
      const config = loadConfig(path);
      expect(config.siteName).toBe("My Custom Site");
      expect(config.knowledgeDir).toBe("custom-knowledge");
      expect(config.outputDir).toBe(DEFAULT_CONFIG.outputDir);
    } finally {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }
  });

  it("command flags override config", () => {
    const config = loadConfig(undefined, {
      siteUrl: "https://myflagurl.com",
      knowledgeDir: "flag-dir",
    });

    expect(config.siteUrl).toBe("https://myflagurl.com");
    expect(config.knowledgeDir).toBe("flag-dir");
  });

  it("invalid config path returns config error", () => {
    expect(() => loadConfig("non-existent-config.json")).toThrow();
  });

  it("missing required siteName falls back to default", () => {
    const tempConfig = {
      siteName: "",
    };
    const path = "temp-geocore-config-2.json";
    fs.writeFileSync(path, JSON.stringify(tempConfig), "utf8");

    try {
      const config = loadConfig(path);
      expect(config.siteName).toBe(DEFAULT_CONFIG.siteName);
    } finally {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }
  });
});

import { runCli } from "../src/cli.js";

describe("CLI Routing and Help Tests", () => {
  it("help command prints usage", async () => {
    const code = await runCli(["help"]);
    expect(code).toBe(0);
  });

  it("--help prints usage", async () => {
    const code = await runCli(["--help"]);
    expect(code).toBe(0);
  });

  it("unknown command returns command error code", async () => {
    const code = await runCli(["unknowncmd"]);
    expect(code).toBe(2);
  });
});

