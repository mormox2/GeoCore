import { describe, it, expect } from "vitest";
import {
  generateStaticExport,
  filterStaticExportObjects,
  createRendererInputForExport,
} from "../src/export/static-exporter.js";
import {
  createStaticExportAssetId,
  createStaticExportBundleId,
  getMimeTypeForExportType,
  isPublicExportObject,
  dedupeStaticExportAssets,
} from "../src/export/export-utils.js";
import type { GenerateStaticExportInput } from "../src/types/static-export.js";
import type { KnowledgeObject } from "../src/types/knowledge-object.js";
import {
  rtimiDentalExportInput,
  rtimiDentalExpectedPaths,
} from "../src/fixtures/static-export.fixture.js";
import { rtimidentalFixture } from "../src/fixtures/rtimidental.fixture.js";

describe("Static Exporter Tests", () => {
  describe("export-utils", () => {
    it("creates a deterministic asset id", () => {
      const id = createStaticExportAssetId("markdown", "fr/article.md");
      expect(id).toBe("exportasset_markdown_fr-article-md");
      expect(createStaticExportAssetId("markdown", "fr/article.md")).toBe(id);
    });

    it("creates a deterministic bundle id", () => {
      expect(createStaticExportBundleId("RTimi Dental", "fr")).toBe("bundle_rtimi-dental_fr");
      expect(createStaticExportBundleId("RTimi Dental")).toBe("bundle_rtimi-dental");
    });

    it("returns correct mime types", () => {
      expect(getMimeTypeForExportType("markdown")).toBe("text/markdown");
      expect(getMimeTypeForExportType("json")).toBe("application/json");
      expect(getMimeTypeForExportType("json-ld")).toBe("application/ld+json");
      expect(getMimeTypeForExportType("llms")).toBe("text/plain");
      expect(getMimeTypeForExportType("sitemap")).toBe("application/xml");
      expect(getMimeTypeForExportType("manifest")).toBe("application/json");
    });

    it("detects public export objects", () => {
      expect(isPublicExportObject(rtimidentalFixture)).toBe(true);
    });

    it("deduplicates assets by id", () => {
      const asset = { id: "x" };
      const out = dedupeStaticExportAssets([asset, asset] as unknown as Parameters<typeof dedupeStaticExportAssets>[0]);
      expect(out).toHaveLength(1);
    });
  });

  describe("filterStaticExportObjects", () => {
    it("includes published public object", () => {
      expect(filterStaticExportObjects({ objects: [rtimidentalFixture] })).toHaveLength(1);
    });

    it("excludes draft in public mode", () => {
      expect(
        filterStaticExportObjects({ objects: [{ ...rtimidentalFixture, status: "draft" }] })
      ).toHaveLength(0);
    });

    it("includes draft in internal mode", () => {
      expect(
        filterStaticExportObjects({
          objects: [{ ...rtimidentalFixture, status: "draft" }],
          visibility: "internal",
        })
      ).toHaveLength(1);
    });

    it("filters by language", () => {
      expect(
        filterStaticExportObjects({
          objects: [
            { ...rtimidentalFixture, id: "a", language: "fr" },
            { ...rtimidentalFixture, id: "b", language: "en" },
          ],
          language: "fr",
        })
      ).toHaveLength(1);
    });

    it("does not mutate input", () => {
      const objects = [{ ...rtimidentalFixture }];
      const snapshot = JSON.parse(JSON.stringify(objects));
      filterStaticExportObjects({ objects });
      expect(JSON.parse(JSON.stringify(objects))).toEqual(snapshot);
    });
  });

  describe("createRendererInputForExport", () => {
    it("derives metadata from object when none provided", () => {
      const rendererInput = createRendererInputForExport({ object: rtimidentalFixture });
      expect(rendererInput.objectId).toBe(rtimidentalFixture.id);
      expect(rendererInput.metadata.id).toBe(rtimidentalFixture.id);
      expect(rendererInput.metadata.title).toBe(rtimidentalFixture.title);
    });

    it("uses provided metadata when available", () => {
      const rendererInput = createRendererInputForExport({
        object: rtimidentalFixture,
        metadata: {
          ...rtimidentalFixture,
          title: "Override",
        } as never,
      });
      expect(rendererInput.metadata.title).toBe("Override");
    });
  });

  describe("generateStaticExport", () => {
    it("generates a StaticExportBundle", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      expect(bundle.id).toBe("export_rtimidental");
      expect(bundle.siteName).toBe("RTimi Dental");
      expect(Array.isArray(bundle.assets)).toBe(true);
      expect(bundle.assets.length).toBeGreaterThan(0);
      expect(bundle.manifest).toBeDefined();
      expect(typeof bundle.generatedAt).toBe("string");
    });

    it("filters public objects (draft excluded)", () => {
      const input: GenerateStaticExportInput = {
        ...rtimiDentalExportInput,
        objects: [{ ...rtimidentalFixture, status: "draft" }],
      };
      const bundle = generateStaticExport(input);
      // No per-object markdown/json/json-ld assets, but info diagnostic for exclusion.
      expect(bundle.assets.filter((a) => a.type === "markdown")).toHaveLength(0);
      expect(bundle.diagnostics.some((d) => d.code === "GC_EXPORT_OBJECT_EXCLUDED")).toBe(true);
    });

    it("generates a Markdown asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const md = bundle.assets.find((a) => a.type === "markdown");
      expect(md).toBeDefined();
      expect(md!.path).toBe(rtimiDentalExpectedPaths.markdown);
      expect(md!.mimeType).toBe("text/markdown");
      expect(typeof md!.content).toBe("string");
      expect(md!.sourceIds).toContain(rtimidentalFixture.id);
    });

    it("generates a JSON asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const json = bundle.assets.find((a) => a.type === "json");
      expect(json).toBeDefined();
      expect(json!.path).toBe(rtimiDentalExpectedPaths.json);
      expect(json!.mimeType).toBe("application/json");
      expect(json!.sourceIds).toContain(rtimidentalFixture.id);
    });

    it("generates a JSON-LD asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const jsonLd = bundle.assets.find((a) => a.type === "json-ld");
      expect(jsonLd).toBeDefined();
      expect(jsonLd!.path).toBe(rtimiDentalExpectedPaths.jsonLd);
      expect(jsonLd!.mimeType).toBe("application/ld+json");
      expect(jsonLd!.sourceIds).toContain(rtimidentalFixture.id);
    });

    it("generates a search index asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const search = bundle.assets.find((a) => a.type === "search-index");
      expect(search).toBeDefined();
      expect(search!.path).toBe(rtimiDentalExpectedPaths.searchIndex);
      expect(search!.mimeType).toBe("application/json");
    });

    it("generates a llms.txt asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const llms = bundle.assets.find((a) => a.type === "llms");
      expect(llms).toBeDefined();
      expect(llms!.path).toBe(rtimiDentalExpectedPaths.llms);
      expect(llms!.mimeType).toBe("text/plain");
      expect(typeof llms!.content).toBe("string");
    });

    it("generates a llms-full.txt asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const llmsFull = bundle.assets.find((a) => a.type === "llms-full");
      expect(llmsFull).toBeDefined();
      expect(llmsFull!.path).toBe(rtimiDentalExpectedPaths.llmsFull);
      expect(llmsFull!.mimeType).toBe("text/plain");
    });

    it("generates a sitemap.xml asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const sitemap = bundle.assets.find((a) => a.type === "sitemap");
      expect(sitemap).toBeDefined();
      expect(sitemap!.path).toBe(rtimiDentalExpectedPaths.sitemap);
      expect(sitemap!.mimeType).toBe("application/xml");
      expect(typeof sitemap!.content).toBe("string");
    });

    it("generates a manifest asset", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const manifest = bundle.assets.find((a) => a.type === "manifest");
      expect(manifest).toBeDefined();
      expect(manifest!.path).toBe(rtimiDentalExpectedPaths.manifest);
      expect(manifest!.mimeType).toBe("application/json");
    });

    it("uses route path when available", () => {
      const input: GenerateStaticExportInput = {
        ...rtimiDentalExportInput,
        routes: {
          id: "x",
          routes: [
            {
              id: "route_ko",
              sourceId: rtimidentalFixture.id,
              sourceType: "knowledge-object",
              type: "knowledge-object",
              path: "/fr/custom-route",
              status: "published",
              visibility: "public",
              isCanonical: true,
              alternates: [],
              redirects: [],
              generatedAt: "2026-06-25T10:00:00Z",
            },
          ],
          generatedAt: "2026-06-25T10:00:00Z",
          diagnostics: [],
        },
      };
      const bundle = generateStaticExport(input);
      const md = bundle.assets.find((a) => a.type === "markdown")!;
      expect(md.path).toBe("fr/custom-route.md");
    });

    it("adds a warning when route is missing", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      expect(bundle.diagnostics.some((d) => d.code === "GC_EXPORT_ROUTE_MISSING")).toBe(true);
    });

    it("falls back to slug/language when route missing", () => {
      const bundle = generateStaticExport(rtimiDentalExportInput);
      const md = bundle.assets.find((a) => a.type === "markdown")!;
      expect(md.path).toBe(`fr/${rtimidentalFixture.slug}.md`);
    });

    it("does not mutate input", () => {
      const snapshot = JSON.parse(JSON.stringify(rtimiDentalExportInput));
      generateStaticExport(rtimiDentalExportInput);
      expect(JSON.parse(JSON.stringify(rtimiDentalExportInput))).toEqual(snapshot);
    });

    it("respects include flags", () => {
      const input: GenerateStaticExportInput = {
        ...rtimiDentalExportInput,
        includeJson: false,
        includeJsonLd: false,
        includeSearchIndex: false,
        includeLlmsTxt: false,
        includeLlmsFullTxt: false,
        includeSitemap: false,
      };
      const bundle = generateStaticExport(input);
      const types = bundle.assets.map((a) => a.type);
      expect(types).toContain("markdown");
      expect(types).toContain("manifest");
      expect(types).not.toContain("json");
      expect(types).not.toContain("sitemap");
    });

    it("emits a warning when no objects are provided", () => {
      const bundle = generateStaticExport({ ...rtimiDentalExportInput, objects: [] });
      expect(bundle.diagnostics.some((d) => d.code === "GC_EXPORT_NO_OBJECTS")).toBe(true);
    });
  });
});
