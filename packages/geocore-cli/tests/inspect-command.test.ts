import { describe, it, expect } from "vitest";
import { inspectCommand } from "../src/commands/inspect.command.js";
import * as fs from "fs";
import * as path from "path";

describe("CLI Inspect Command Tests", () => {
  const kDir = "temp-inspect-knowledge-dir";

  it("inspects dataset counts and supports JSON", async () => {
    if (!fs.existsSync(kDir)) {
      fs.mkdirSync(kDir);
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
      const dataset = await inspectCommand({
        knowledgeDir: kDir,
        json: true,
      });

      expect(dataset.objects.length).toBe(1);
      expect(dataset.objects[0].id).toBe("ko_dental_1");
    } finally {
      if (fs.existsSync(kDir)) {
        fs.readdirSync(kDir).forEach((file) => fs.unlinkSync(path.join(kDir, file)));
        fs.rmdirSync(kDir);
      }
    }
  });
});
