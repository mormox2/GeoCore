import { describe, it, expect } from "vitest";
import { readKnowledgeFiles } from "../src/fs/read-knowledge-files.js";
import * as fs from "fs";
import * as path from "path";

describe("CLI Read Knowledge Files Tests", () => {
  const testDir = "temp-read-test";

  it("reads markdown and json content correctly", async () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    const mdPath = path.join(testDir, "test.md");
    const jsonPath = path.join(testDir, "test.json");
    const invalidJsonPath = path.join(testDir, "invalid.json");

    fs.writeFileSync(mdPath, "# Hello Markdown", "utf8");
    fs.writeFileSync(jsonPath, JSON.stringify({ id: "ko_test", type: "entity", name: "concept" }), "utf8");
    fs.writeFileSync(invalidJsonPath, "{ malformed: ", "utf8");

    try {
      const inputs = await readKnowledgeFiles([mdPath, jsonPath]);

      expect(inputs.length).toBe(2);
      expect(inputs[0].type).toBe("markdown");
      expect(inputs[0].sourcePath).toBe(mdPath);
      expect(inputs[0].content).toBe("# Hello Markdown");

      expect(inputs[1].type).toBe("entity");
      expect(inputs[1].id).toBe("ko_test");
      expect(inputs[1].sourcePath).toBe(jsonPath);

      await expect(readKnowledgeFiles([invalidJsonPath])).rejects.toThrow();
    } finally {
      if (fs.existsSync(testDir)) {
        fs.readdirSync(testDir).forEach((file) => fs.unlinkSync(path.join(testDir, file)));
        fs.rmdirSync(testDir);
      }
    }
  });
});
