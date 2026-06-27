import { describe, it, expect } from "vitest";
import { writeExportBundle } from "../src/fs/write-export-bundle.js";
import { StaticExportBundle } from "@mormox2/geocore";
import * as fs from "fs";
import * as path from "path";

describe("CLI Write Export Bundle Tests", () => {
  const oDir = "temp-write-bundle-test";

  it("writes assets and prevents path traversal", async () => {
    if (!fs.existsSync(oDir)) {
      fs.mkdirSync(oDir);
    }

    const bundle: StaticExportBundle = {
      id: "test-bundle",
      siteName: "GeoCore Site",
      generatedAt: "2026-06-25T10:00:00Z",
      manifest: {
        id: "manifest-1",
        bundleId: "test-bundle",
        siteName: "GeoCore Site",
        assets: [],
        generatedAt: "2026-06-25T10:00:00Z",
      },
      diagnostics: [],
      assets: [
        {
          id: "asset-1",
          type: "markdown",
          path: "sub/test.md",
          content: "markdown content",
          mimeType: "text/markdown",
          encoding: "utf-8",
          sourceIds: [],
          visibility: "public",
          generatedAt: "2026-06-25T10:00:00Z",
          diagnostics: [],
        },
        {
          id: "asset-2",
          type: "json",
          path: "data.json",
          content: { key: "value" },
          mimeType: "application/json",
          encoding: "utf-8",
          sourceIds: [],
          visibility: "public",
          generatedAt: "2026-06-25T10:00:00Z",
          diagnostics: [],
        },
      ],
    };

    try {
      const result = await writeExportBundle({ bundle, outputDir: oDir });

      expect(result.writtenFiles.length).toBe(2);

      const path1 = path.join(oDir, "sub/test.md");
      const path2 = path.join(oDir, "data.json");

      expect(fs.existsSync(path1)).toBe(true);
      expect(fs.existsSync(path2)).toBe(true);

      expect(fs.readFileSync(path1, "utf8")).toBe("markdown content");
      const parsedJson = JSON.parse(fs.readFileSync(path2, "utf8"));
      expect(parsedJson.key).toBe("value");

      const maliciousBundle: StaticExportBundle = {
        ...bundle,
        assets: [
          {
            id: "asset-malicious",
            type: "markdown",
            path: "../outside.md",
            content: "malicious",
            mimeType: "text/markdown",
            encoding: "utf-8",
            sourceIds: [],
            visibility: "public",
            generatedAt: "2026-06-25T10:00:00Z",
            diagnostics: [],
          },
        ],
      };

      await expect(writeExportBundle({ bundle: maliciousBundle, outputDir: oDir })).rejects.toThrow();
    } finally {
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
