import { describe, it, expect } from "vitest";
import { validateSitemapEntry } from "../src/sitemap/validate-sitemap-entry.js";
import { validateSitemapOutput } from "../src/sitemap/validate-sitemap-output.js";
import { SitemapEntry } from "../src/types/sitemap-entry.js";
import { SitemapOutput } from "../src/types/sitemap.js";

describe("Sitemap Validation Tests", () => {
  const validEntry: SitemapEntry = {
    id: "sitemap_entry_ko_1",
    sourceId: "ko_1",
    sourceType: "knowledge-object",
    url: "https://example.com/ko-1",
    language: "en",
    lastModified: "2026-06-25",
    changeFrequency: "monthly",
    priority: 0.8,
    visibility: "public",
    status: "published",
    alternates: [],
    images: [],
    generatedAt: "2026-06-25T10:05:00Z",
  };

  describe("validateSitemapEntry", () => {
    it("should pass for a valid entry", () => {
      const result = validateSitemapEntry(validEntry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("should fail for missing ID", () => {
      const result = validateSitemapEntry({ ...validEntry, id: "" });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_ENTRY_ID_MISSING");
      expect(issue).toBeDefined();
    });

    it("should fail for missing URL", () => {
      const result = validateSitemapEntry({ ...validEntry, url: "" });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_URL_MISSING");
      expect(issue).toBeDefined();
    });

    it("should fail for invalid URL", () => {
      const result = validateSitemapEntry({ ...validEntry, url: "not-a-url" });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_URL_INVALID");
      expect(issue).toBeDefined();
    });

    it("should fail for priority out of range", () => {
      const result = validateSitemapEntry({ ...validEntry, priority: 1.5 });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_PRIORITY_INVALID");
      expect(issue).toBeDefined();
    });

    it("should fail for invalid visibility", () => {
      const result = validateSitemapEntry({ ...validEntry, visibility: "open" as any });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_VISIBILITY_INVALID");
      expect(issue).toBeDefined();
    });

    it("should return critical error for null input", () => {
      const result = validateSitemapEntry(null as any);
      expect(result.valid).toBe(false);
      expect(result.issues[0].severity).toBe("critical");
    });
  });

  describe("validateSitemapOutput", () => {
    const validOutput: SitemapOutput = {
      id: "sitemap_urlset_test",
      type: "urlset",
      siteUrl: "https://example.com",
      entries: [validEntry],
      xml: '<?xml version="1.0"?><urlset></urlset>',
      generatedAt: "2026-06-25T10:05:00Z",
      diagnostics: [],
    };

    it("should pass for a valid output", () => {
      const result = validateSitemapOutput(validOutput);
      expect(result.valid).toBe(true);
    });

    it("should fail for missing output ID", () => {
      const result = validateSitemapOutput({ ...validOutput, id: "" });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_OUTPUT_ID_MISSING");
      expect(issue).toBeDefined();
    });

    it("should fail for invalid output type", () => {
      const result = validateSitemapOutput({ ...validOutput, type: "wrong" as any });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_OUTPUT_TYPE_INVALID");
      expect(issue).toBeDefined();
    });

    it("should fail for missing XML", () => {
      const result = validateSitemapOutput({ ...validOutput, xml: "" });
      expect(result.valid).toBe(false);
      const issue = result.issues.find((i) => i.code === "GC_SITEMAP_XML_MISSING");
      expect(issue).toBeDefined();
    });

    it("should warn about duplicate entry IDs", () => {
      const result = validateSitemapOutput({
        ...validOutput,
        entries: [validEntry, { ...validEntry }],
      });
      const dupIssue = result.issues.find((i) => i.code === "GC_SITEMAP_ENTRY_ID_DUPLICATE");
      expect(dupIssue).toBeDefined();
      expect(dupIssue?.severity).toBe("warning");
    });

    it("should warn about duplicate URLs", () => {
      const result = validateSitemapOutput({
        ...validOutput,
        entries: [validEntry, { ...validEntry, id: "sitemap_entry_ko_1b" }],
      });
      const dupIssue = result.issues.find((i) => i.code === "GC_SITEMAP_URL_DUPLICATE");
      expect(dupIssue).toBeDefined();
    });

    it("should warn when sitemap has no public entries", () => {
      const result = validateSitemapOutput({
        ...validOutput,
        entries: [{ ...validEntry, visibility: "internal" }],
      });
      const emptyIssue = result.issues.find((i) => i.code === "GC_SITEMAP_EMPTY");
      expect(emptyIssue).toBeDefined();
      expect(emptyIssue?.severity).toBe("warning");
    });

    it("should return critical error for null input", () => {
      const result = validateSitemapOutput(null as any);
      expect(result.valid).toBe(false);
      expect(result.issues[0].severity).toBe("critical");
    });
  });
});
