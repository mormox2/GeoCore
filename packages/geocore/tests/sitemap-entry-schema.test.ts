import { describe, it, expect } from "vitest";
import { sitemapEntrySchema, sitemapChangeFrequencySchema, sitemapVisibilitySchema } from "../src/schemas/sitemap-entry.schema.js";

describe("SitemapEntry Schema Tests", () => {
  const validEntry = {
    id: "sitemap_entry_ko_1",
    sourceId: "ko_1",
    sourceType: "knowledge-object",
    url: "https://example.com/ko-1",
    language: "en",
    lastModified: "2026-06-25T10:00:00Z",
    changeFrequency: "monthly",
    priority: 0.8,
    visibility: "public",
    status: "published",
    alternates: [],
    images: [],
    generatedAt: "2026-06-25T10:05:00Z",
  };

  it("should accept a valid sitemap entry", () => {
    const result = sitemapEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it("should reject an entry without an ID", () => {
    const result = sitemapEntrySchema.safeParse({ ...validEntry, id: "" });
    expect(result.success).toBe(false);
  });

  it("should reject an entry with an invalid URL", () => {
    const result = sitemapEntrySchema.safeParse({ ...validEntry, url: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("should reject an entry with priority > 1", () => {
    const result = sitemapEntrySchema.safeParse({ ...validEntry, priority: 1.5 });
    expect(result.success).toBe(false);
  });

  it("should reject an entry with priority < 0", () => {
    const result = sitemapEntrySchema.safeParse({ ...validEntry, priority: -0.1 });
    expect(result.success).toBe(false);
  });

  it("should accept entry without optional fields", () => {
    const { language, lastModified, changeFrequency, priority, ...minimal } = validEntry;
    const result = sitemapEntrySchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("should reject an entry with invalid visibility", () => {
    const result = sitemapEntrySchema.safeParse({ ...validEntry, visibility: "open" });
    expect(result.success).toBe(false);
  });

  it("should validate all valid changeFrequency values", () => {
    const freqs = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const;
    for (const freq of freqs) {
      const result = sitemapChangeFrequencySchema.safeParse(freq);
      expect(result.success).toBe(true);
    }
  });

  it("should validate all valid visibility values", () => {
    const vis = ["public", "internal", "private", "hidden"] as const;
    for (const v of vis) {
      const result = sitemapVisibilitySchema.safeParse(v);
      expect(result.success).toBe(true);
    }
  });

  it("should accept an entry with alternates and images", () => {
    const withExtras = {
      ...validEntry,
      alternates: [{ language: "ar", url: "https://example.com/ar/ko-1" }],
      images: [{ url: "https://example.com/img.jpg", title: "Image", caption: "Caption" }],
    };
    const result = sitemapEntrySchema.safeParse(withExtras);
    expect(result.success).toBe(true);
  });
});
