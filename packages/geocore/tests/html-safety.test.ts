import { describe, it, expect } from "vitest";
import { escapeHtml, sanitizeUrl } from "../src/renderer/html-safety.js";
import { formatImageHtml, formatVideoHtml } from "../src/media/media-formatter.js";
import { generateMediaSitemapXmlExtension } from "../src/media/media-sitemap.js";
import { scalingBeforeAfterMedia } from "../src/fixtures/media.fixture.js";

describe("HTML safety helpers", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(640)).toBe("640");
  });

  it("allows relative and http(s)/mailto URLs only", () => {
    expect(sanitizeUrl("https://www.who.int/x?a=1&b=2")).toBe("https://www.who.int/x?a=1&b=2");
    expect(sanitizeUrl("/media/img.jpg")).toBe("/media/img.jpg");
    expect(sanitizeUrl("mailto:contact@example.com")).toBe("mailto:contact@example.com");
    expect(sanitizeUrl("javascript:alert(1)")).toBeUndefined();
    expect(sanitizeUrl(" JaVaScRiPt:alert(1)")).toBeUndefined();
    expect(sanitizeUrl("java\tscript:alert(1)")).toBeUndefined();
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(sanitizeUrl(undefined)).toBeUndefined();
  });

  it("formatImageHtml cannot be broken out of its attributes", () => {
    const html = formatImageHtml({
      ...scalingBeforeAfterMedia,
      canonicalUrl: undefined,
      source: '" onerror="alert(1)',
      altText: '"><script>alert(1)</script>',
    });
    expect(html).not.toContain('" onerror="');
    expect(html).not.toContain("<script>");
  });

  it("formatImageHtml and formatVideoHtml drop javascript: URLs", () => {
    const img = formatImageHtml({ ...scalingBeforeAfterMedia, canonicalUrl: "javascript:alert(1)" });
    expect(img).toContain('src=""');
    const video = formatVideoHtml({
      ...scalingBeforeAfterMedia,
      type: "video",
      canonicalUrl: "javascript:alert(1)",
      thumbnailId: "javascript:alert(2)",
    });
    expect(video).not.toContain("javascript:");
  });

  it("escapes media URLs in sitemap extensions", () => {
    const xml = generateMediaSitemapXmlExtension(
      [{ url: "https://cdn.example/a.jpg?w=1&h=2", title: "A" }],
      [{ contentUrl: "https://cdn.example/v.mp4?a=1&b=2", thumbnailUrl: "https://cdn.example/t.jpg?a=1&b=2", title: "V" }]
    );
    expect(xml).toContain("a.jpg?w=1&amp;h=2");
    expect(xml).toContain("v.mp4?a=1&amp;b=2");
    expect(xml).toContain("t.jpg?a=1&amp;b=2");
    expect(xml).not.toMatch(/&(?!amp;)/);
  });
});
