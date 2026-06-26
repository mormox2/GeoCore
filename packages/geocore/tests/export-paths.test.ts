import { describe, it, expect } from "vitest";
import { createExportPath } from "../src/export/export-paths.js";
import {
  isValidExportPath,
  normalizeExportPath,
} from "../src/export/export-utils.js";

describe("Export Path Tests", () => {
  describe("createExportPath", () => {
    it("creates a Markdown path from route path", () => {
      expect(
        createExportPath({ type: "markdown", routePath: "/fr/help/gestion-creances-clients" })
      ).toBe("fr/help/gestion-creances-clients.md");
    });

    it("creates a JSON path from route path", () => {
      expect(
        createExportPath({ type: "json", routePath: "/fr/help/article" })
      ).toBe("fr/help/article.json");
    });

    it("creates a JSON-LD schema path from route path", () => {
      expect(
        createExportPath({ type: "json-ld", routePath: "/fr/help/article" })
      ).toBe("fr/help/article.schema.json");
    });

    it("creates a path from slug and language", () => {
      expect(
        createExportPath({ type: "markdown", slug: "my-slug", language: "fr" })
      ).toBe("fr/my-slug.md");
    });

    it("uses fixed paths for special types", () => {
      expect(createExportPath({ type: "search-index" })).toBe("search-index.json");
      expect(createExportPath({ type: "llms" })).toBe("llms.txt");
      expect(createExportPath({ type: "llms-full" })).toBe("llms-full.txt");
      expect(createExportPath({ type: "sitemap" })).toBe("sitemap.xml");
      expect(createExportPath({ type: "manifest" })).toBe("manifest.json");
    });

    it("strips a leading slash", () => {
      expect(createExportPath({ type: "markdown", routePath: "/fr/x" })).toBe("fr/x.md");
    });

    it("preserves nested paths", () => {
      expect(
        createExportPath({ type: "markdown", routePath: "/a/b/c/d" })
      ).toBe("a/b/c/d.md");
    });
  });

  describe("isValidExportPath", () => {
    it("accepts a relative path", () => {
      expect(isValidExportPath("fr/article.md")).toBe(true);
    });

    it("accepts a nested relative path", () => {
      expect(isValidExportPath("fr/help/article.md")).toBe(true);
    });

    it("rejects an absolute path (leading slash)", () => {
      expect(isValidExportPath("/fr/article.md")).toBe(false);
    });

    it("rejects a path with ..", () => {
      expect(isValidExportPath("../fr/article.md")).toBe(false);
    });

    it("rejects a query string", () => {
      expect(isValidExportPath("fr/article.md?x=1")).toBe(false);
    });

    it("rejects a hash fragment", () => {
      expect(isValidExportPath("fr/article.md#section")).toBe(false);
    });

    it("rejects duplicate slashes", () => {
      expect(isValidExportPath("fr//article.md")).toBe(false);
    });

    it("rejects empty", () => {
      expect(isValidExportPath("")).toBe(false);
    });
  });

  describe("normalizeExportPath", () => {
    it("strips a leading slash", () => {
      expect(normalizeExportPath("/fr/x")).toBe("fr/x");
    });

    it("collapses duplicate slashes", () => {
      expect(normalizeExportPath("fr//x")).toBe("fr/x");
    });

    it("removes query and hash", () => {
      expect(normalizeExportPath("fr/x?a=1#b")).toBe("fr/x");
    });

    it("returns empty for empty input", () => {
      expect(normalizeExportPath("")).toBe("");
    });
  });
});
