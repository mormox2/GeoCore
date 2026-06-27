import { describe, it, expect } from "vitest";
import { generateStaticExport } from "../src/export/static-exporter.js";
import { validateStaticExportBundle } from "../src/export/validate-static-export-bundle.js";
import {
  rtimiDentalExportInput,
  dawajinProExportInput,
  rtimiDentalExpectedPaths,
  dawajinProExpectedPaths,
} from "../src/fixtures/static-export.fixture.js";

describe("Static Export Fixture Tests", () => {
  describe("RTimi Dental", () => {
    const bundle = generateStaticExport(rtimiDentalExportInput);
    const paths = bundle.assets.map((a) => a.path);

    it("validates", () => {
      const result = validateStaticExportBundle(bundle);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("includes a Markdown asset at the expected path", () => {
      expect(paths).toContain(rtimiDentalExpectedPaths.markdown);
    });

    it("includes a JSON asset at the expected path", () => {
      expect(paths).toContain(rtimiDentalExpectedPaths.json);
    });

    it("includes a JSON-LD asset at the expected path", () => {
      expect(paths).toContain(rtimiDentalExpectedPaths.jsonLd);
    });

    it("includes a llms.txt asset", () => {
      expect(paths).toContain(rtimiDentalExpectedPaths.llms);
    });

    it("includes a sitemap.xml asset", () => {
      expect(paths).toContain(rtimiDentalExpectedPaths.sitemap);
    });

    it("includes a manifest.json asset", () => {
      expect(paths).toContain(rtimiDentalExpectedPaths.manifest);
    });
  });

  describe("Dawajin Pro", () => {
    const bundle = generateStaticExport(dawajinProExportInput);
    const paths = bundle.assets.map((a) => a.path);

    it("validates", () => {
      const result = validateStaticExportBundle(bundle);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("includes a Markdown asset at the expected path", () => {
      expect(paths).toContain(dawajinProExpectedPaths.markdown);
    });

    it("includes a JSON asset at the expected path", () => {
      expect(paths).toContain(dawajinProExpectedPaths.json);
    });

    it("includes a JSON-LD asset at the expected path", () => {
      expect(paths).toContain(dawajinProExpectedPaths.jsonLd);
    });

    it("includes a llms.txt asset", () => {
      expect(paths).toContain(dawajinProExpectedPaths.llms);
    });

    it("includes a sitemap.xml asset", () => {
      expect(paths).toContain(dawajinProExpectedPaths.sitemap);
    });

    it("includes a manifest.json asset", () => {
      expect(paths).toContain(dawajinProExpectedPaths.manifest);
    });
  });
});
