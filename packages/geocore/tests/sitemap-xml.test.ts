import { describe, it, expect } from "vitest";
import { escapeXml, generateSitemapXml, generateSitemapIndexXml } from "../src/sitemap/sitemap-xml.js";
import { SitemapEntry } from "../src/types/sitemap-entry.js";

describe("Sitemap XML Generator Tests", () => {
  const baseEntry: SitemapEntry = {
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

  describe("escapeXml", () => {
    it("should escape ampersand", () => {
      expect(escapeXml("a&b")).toBe("a&amp;b");
    });

    it("should escape less-than and greater-than", () => {
      expect(escapeXml("<tag>")).toBe("&lt;tag&gt;");
    });

    it("should escape double and single quotes", () => {
      expect(escapeXml('"hello"')).toBe("&quot;hello&quot;");
      expect(escapeXml("it's")).toBe("it&apos;s");
    });

    it("should not modify clean strings", () => {
      expect(escapeXml("https://example.com/slug")).toBe("https://example.com/slug");
    });
  });

  describe("generateSitemapXml", () => {
    it("should generate a valid urlset XML", () => {
      const xml = generateSitemapXml([baseEntry]);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain("<urlset");
      expect(xml).toContain("</urlset>");
      expect(xml).toContain("<loc>https://example.com/ko-1</loc>");
    });

    it("should include lastmod when present", () => {
      const xml = generateSitemapXml([baseEntry]);
      expect(xml).toContain("<lastmod>2026-06-25</lastmod>");
    });

    it("should include changefreq when present", () => {
      const xml = generateSitemapXml([baseEntry]);
      expect(xml).toContain("<changefreq>monthly</changefreq>");
    });

    it("should include priority when present", () => {
      const xml = generateSitemapXml([baseEntry]);
      expect(xml).toContain("<priority>0.8</priority>");
    });

    it("should exclude non-public entries", () => {
      const internal: SitemapEntry = { ...baseEntry, id: "e2", visibility: "internal", url: "https://example.com/internal" };
      const xml = generateSitemapXml([baseEntry, internal]);
      expect(xml).toContain("https://example.com/ko-1");
      expect(xml).not.toContain("https://example.com/internal");
    });

    it("should include hreflang alternates namespace when alternates are present", () => {
      const withAlternates: SitemapEntry = {
        ...baseEntry,
        alternates: [{ language: "ar", url: "https://example.com/ar/ko-1" }],
      };
      const xml = generateSitemapXml([withAlternates]);
      expect(xml).toContain("xmlns:xhtml");
      expect(xml).toContain('hreflang="ar"');
    });

    it("should include image namespace and elements when images are present", () => {
      const withImages: SitemapEntry = {
        ...baseEntry,
        images: [{ url: "https://example.com/img.jpg", title: "My Image", caption: "Caption text" }],
      };
      const xml = generateSitemapXml([withImages]);
      expect(xml).toContain("xmlns:image");
      expect(xml).toContain("<image:loc>https://example.com/img.jpg</image:loc>");
      expect(xml).toContain("<image:title>My Image</image:title>");
    });

    it("should produce empty urlset for empty input", () => {
      const xml = generateSitemapXml([]);
      expect(xml).toContain("<urlset");
      expect(xml).toContain("</urlset>");
      expect(xml).not.toContain("<url>");
    });
  });

  describe("generateSitemapIndexXml", () => {
    it("should generate a valid sitemap index", () => {
      const xml = generateSitemapIndexXml([
        { loc: "https://example.com/sitemap-1.xml", lastmod: "2026-06-25" },
      ]);
      expect(xml).toContain("<sitemapindex");
      expect(xml).toContain("</sitemapindex>");
      expect(xml).toContain("<loc>https://example.com/sitemap-1.xml</loc>");
      expect(xml).toContain("<lastmod>2026-06-25</lastmod>");
    });

    it("should omit lastmod when not provided", () => {
      const xml = generateSitemapIndexXml([{ loc: "https://example.com/sitemap-2.xml" }]);
      expect(xml).not.toContain("<lastmod>");
    });
  });
});
