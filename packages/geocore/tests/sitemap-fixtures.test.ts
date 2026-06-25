import { describe, it, expect } from "vitest";
import { rtimiDentalSitemapInput, dawajinProSitemapInput } from "../src/fixtures/sitemap.fixture.js";
import { generateSitemap } from "../src/sitemap/sitemap-generator.js";

describe("Sitemap Fixtures Tests", () => {
  it("should define rtimiDentalSitemapInput with valid structure", () => {
    expect(rtimiDentalSitemapInput.id).toBe("sitemap_rtimi");
    expect(rtimiDentalSitemapInput.siteUrl).toBe("https://rtimidental.example.com");
    expect(rtimiDentalSitemapInput.language).toBe("fr");
    expect(rtimiDentalSitemapInput.objects.length).toBeGreaterThan(0);
    expect(rtimiDentalSitemapInput.defaultChangeFrequency).toBe("monthly");
    expect(rtimiDentalSitemapInput.defaultPriority).toBe(0.8);
  });

  it("should define dawajinProSitemapInput with valid structure", () => {
    expect(dawajinProSitemapInput.id).toBe("sitemap_dawajin");
    expect(dawajinProSitemapInput.siteUrl).toBe("https://dawajinpro.example.com");
    expect(dawajinProSitemapInput.objects.length).toBeGreaterThan(0);
  });

  it("should generate a sitemap from rtimiDentalSitemapInput", () => {
    const output = generateSitemap(rtimiDentalSitemapInput);
    expect(output.type).toBe("urlset");
    expect(output.entries.length).toBeGreaterThan(0);
    expect(output.xml).toContain("<urlset");
    expect(output.xml).toContain("rtimidental.example.com");
  });

  it("should generate a sitemap from dawajinProSitemapInput", () => {
    const output = generateSitemap(dawajinProSitemapInput);
    expect(output.type).toBe("urlset");
    expect(output.entries.length).toBeGreaterThan(0);
    expect(output.xml).toContain("dawajinpro.example.com");
  });

  it("should use explicit URL override for rtimi dental object", () => {
    const output = generateSitemap(rtimiDentalSitemapInput);
    const entry = output.entries.find((e) => e.sourceId === "ko_detartrage_abime_dents");
    expect(entry?.url).toBe(
      "https://rtimidental.example.com/fr/soins/detartrage-abime-t-il-les-dents"
    );
  });

  it("should include hreflang alternates for rtimi dental object", () => {
    const output = generateSitemap(rtimiDentalSitemapInput);
    const entry = output.entries.find((e) => e.sourceId === "ko_detartrage_abime_dents");
    expect(entry?.alternates.length).toBeGreaterThan(0);
    expect(entry?.alternates[0].language).toBe("ar");
    // XML should include hreflang
    expect(output.xml).toContain('hreflang="ar"');
  });

  it("should have no error-level diagnostics for valid fixture inputs", () => {
    const rtimiOutput = generateSitemap(rtimiDentalSitemapInput);
    const errorDiags = rtimiOutput.diagnostics.filter(
      (d) => d.severity === "error" || d.severity === "critical"
    );
    expect(errorDiags).toHaveLength(0);

    const dawajinOutput = generateSitemap(dawajinProSitemapInput);
    const dawajinErrors = dawajinOutput.diagnostics.filter(
      (d) => d.severity === "error" || d.severity === "critical"
    );
    expect(dawajinErrors).toHaveLength(0);
  });
});
