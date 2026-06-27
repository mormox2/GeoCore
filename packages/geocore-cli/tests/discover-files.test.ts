import { describe, it, expect } from "vitest";
import { discoverKnowledgeFiles } from "../src/fs/discover-files.js";
import * as fs from "fs";
import * as path from "path";

describe("CLI File Discovery Tests", () => {
  const testDir = "temp-discovery-test";

  it("handles missing knowledge directory", async () => {
    await expect(discoverKnowledgeFiles({ knowledgeDir: "non-existent-dir" })).rejects.toThrow();
  });

  it("discovers, filters and sorts files", async () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    fs.writeFileSync(path.join(testDir, "a.md"), "content");
    fs.writeFileSync(path.join(testDir, "b.json"), "content");
    fs.writeFileSync(path.join(testDir, ".hidden.md"), "content");
    fs.writeFileSync(path.join(testDir, "draft.draft.md"), "content");

    try {
      const files = await discoverKnowledgeFiles({
        knowledgeDir: testDir,
        include: ["**/*.md", "**/*.json"],
        exclude: ["**/*.draft.md"],
      });

      const basenames = files.map((f) => path.basename(f));
      expect(basenames).toEqual(["a.md", "b.json"]);
    } finally {
      if (fs.existsSync(testDir)) {
        fs.readdirSync(testDir).forEach((file) => fs.unlinkSync(path.join(testDir, file)));
        fs.rmdirSync(testDir);
      }
    }
  });
});
