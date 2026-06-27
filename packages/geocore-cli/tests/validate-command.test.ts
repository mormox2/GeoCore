import { describe, it, expect } from "vitest";
import { validateCommand } from "../src/commands/validate.command.js";
import * as fs from "fs";
import * as path from "path";

describe("CLI Validate Command Tests", () => {
  const testDir = "temp-validate-cmd-test";

  it("validates files, accepts mode/fail-fast/json", async () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    const mdPath = path.join(testDir, "test.md");

    const content = `---
id: ko_dental_1
slug: dental-slug
title: Dental Title
summary: Dental summary
language: fr
status: published
version: 1.0.0
author: dr_rtimi
---
Le detartrage n'abime pas les dents.`;

    fs.writeFileSync(mdPath, content, "utf8");

    try {
      const report = await validateCommand({
        knowledgeDir: testDir,
        mode: "public",
        json: true,
      });

      expect(report.valid).toBe(true);
      expect(report.summary.stagesTotal).toBe(10);
    } finally {
      if (fs.existsSync(testDir)) {
        fs.readdirSync(testDir).forEach((file) => fs.unlinkSync(path.join(testDir, file)));
        fs.rmdirSync(testDir);
      }
    }
  });

  it("returns error exit code when validation errors exist", async () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    const mdPath = path.join(testDir, "test.md");

    const content = `---
id: ko_dental_invalid
slug: dental-slug
title: Dental Title
language: fr
status: published
version: 1.0.0
---
Le detartrage n'abime pas les dents.`;

    fs.writeFileSync(mdPath, content, "utf8");

    try {
      await expect(
        validateCommand({
          knowledgeDir: testDir,
          mode: "public",
        })
      ).rejects.toThrow();
    } finally {
      if (fs.existsSync(testDir)) {
        fs.readdirSync(testDir).forEach((file) => fs.unlinkSync(path.join(testDir, file)));
        fs.rmdirSync(testDir);
      }
    }
  });
});
