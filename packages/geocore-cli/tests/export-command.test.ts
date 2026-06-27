import { describe, it, expect } from "vitest";
import { exportCommand } from "../src/commands/export.command.js";
import * as fs from "fs";
import * as path from "path";

describe("CLI Export Command Tests", () => {
  const kDir = "temp-export-knowledge-dir";
  const oDir = "temp-export-output-dir";

  it("exports valid files and produces static outputs", async () => {
    if (!fs.existsSync(kDir)) {
      fs.mkdirSync(kDir);
    }
    if (!fs.existsSync(oDir)) {
      fs.mkdirSync(oDir);
    }

    const mdPath = path.join(kDir, "test.md");

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
      const result = await exportCommand({
        knowledgeDir: kDir,
        outputDir: oDir,
        mode: "public",
      });

      expect(result.writtenFiles.length).toBeGreaterThan(0);

      const manifestPath = path.join(oDir, "manifest.json");
      expect(fs.existsSync(manifestPath)).toBe(true);

      const llmsPath = path.join(oDir, "llms.txt");
      expect(fs.existsSync(llmsPath)).toBe(true);
    } finally {
      if (fs.existsSync(kDir)) {
        fs.readdirSync(kDir).forEach((file) => fs.unlinkSync(path.join(kDir, file)));
        fs.rmdirSync(kDir);
      }
      if (fs.existsSync(oDir)) {
        fs.readdirSync(oDir).forEach((file) => {
          const p = path.join(oDir, file);
          if (fs.statSync(p).isDirectory()) {
            fs.readdirSync(p).forEach((f) => fs.unlinkSync(path.join(p, f)));
            fs.rmdirSync(p);
          } else {
            fs.unlinkSync(p);
          }
        });
        fs.rmdirSync(oDir);
      }
    }
  });

  it("refuses export when not publishable unless forced", async () => {
    if (!fs.existsSync(kDir)) {
      fs.mkdirSync(kDir);
    }
    if (!fs.existsSync(oDir)) {
      fs.mkdirSync(oDir);
    }

    const mdPath = path.join(kDir, "test.md");

    const content = `---
id: ko_dental_invalid
slug: dental-slug
title: Dental Title
summary: Dental summary
language: fr
status: published
version: 1.0.0
---
Le detartrage n'abime pas les dents.`;

    fs.writeFileSync(mdPath, content, "utf8");

    try {
      await expect(
        exportCommand({
          knowledgeDir: kDir,
          outputDir: oDir,
          mode: "public",
        })
      ).rejects.toThrow();

      const result = await exportCommand({
        knowledgeDir: kDir,
        outputDir: oDir,
        mode: "public",
        force: true,
      });

      expect(result.writtenFiles.length).toBeGreaterThan(0);
    } finally {
      if (fs.existsSync(kDir)) {
        fs.readdirSync(kDir).forEach((file) => fs.unlinkSync(path.join(kDir, file)));
        fs.rmdirSync(kDir);
      }
      if (fs.existsSync(oDir)) {
        fs.readdirSync(oDir).forEach((file) => {
          const p = path.join(oDir, file);
          if (fs.statSync(p).isDirectory()) {
            fs.readdirSync(p).forEach((f) => fs.unlinkSync(path.join(p, f)));
            fs.rmdirSync(p);
          } else {
            fs.unlinkSync(p);
          }
        });
        fs.rmdirSync(oDir);
      }
    }
  });
});
