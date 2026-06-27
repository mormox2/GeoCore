import { describe, it, expect } from "vitest";
import { resolveRoutes } from "../src/routing/route-registry.js";
import { resolveRoutePatterns, DEFAULT_ROUTE_PATTERNS } from "../src/routing/route-patterns.js";
import type { ResolveRoutesInput } from "../src/types/route.js";
import type { KnowledgeObject } from "../src/types/knowledge-object.js";
import { rtimidentalFixture } from "../src/fixtures/rtimidental.fixture.js";
import { rtimiDentalSiteUrl } from "../src/fixtures/rtimidental.fixture.js";

describe("Route Registry Tests", () => {
  describe("DEFAULT_ROUTE_PATTERNS", () => {
    it("exposes the documented default patterns", () => {
      expect(DEFAULT_ROUTE_PATTERNS.knowledgeObject).toBe("/:language/:slug");
      expect(DEFAULT_ROUTE_PATTERNS.collection).toBe("/:language/collections/:slug");
      expect(DEFAULT_ROUTE_PATTERNS.glossaryEntry).toBe("/:language/glossary/:slug");
      expect(DEFAULT_ROUTE_PATTERNS.documentation).toBe("/:language/docs/:slug");
      expect(DEFAULT_ROUTE_PATTERNS.media).toBe("/:language/media/:slug");
    });
  });

  describe("resolveRoutePatterns", () => {
    it("returns all defaults when no override provided", () => {
      const patterns = resolveRoutePatterns();
      expect(patterns.knowledgeObject).toBe("/:language/:slug");
      expect(patterns.collection).toBe("/:language/collections/:slug");
    });

    it("overrides only the provided pattern", () => {
      const patterns = resolveRoutePatterns({ knowledgeObject: "/:language/q/:slug" });
      expect(patterns.knowledgeObject).toBe("/:language/q/:slug");
      expect(patterns.collection).toBe("/:language/collections/:slug");
    });
  });

  describe("resolveRoutes registry output", () => {
    it("produces a registry with id, siteUrl, routes, generatedAt, diagnostics", () => {
      const input: ResolveRoutesInput = {
        id: "reg-test",
        siteUrl: rtimiDentalSiteUrl,
        objects: [rtimidentalFixture],
      };
      const registry = resolveRoutes(input);
      expect(registry.id).toBe("reg-test");
      expect(registry.siteUrl).toBe(rtimiDentalSiteUrl);
      expect(registry.routes).toHaveLength(1);
      expect(typeof registry.generatedAt).toBe("string");
      expect(Array.isArray(registry.diagnostics)).toBe(true);
    });

    it("emits info diagnostics for objects excluded by the filter", () => {
      const draft: KnowledgeObject = { ...rtimidentalFixture, id: "ko_draft", status: "draft" };
      const input: ResolveRoutesInput = {
        id: "reg-test",
        siteUrl: rtimiDentalSiteUrl,
        objects: [draft],
      };
      const registry = resolveRoutes(input);
      expect(
        registry.diagnostics.some((d) => d.code === "GC_ROUTE_OBJECT_EXCLUDED")
      ).toBe(true);
      expect(registry.routes).toHaveLength(0);
    });

    it("uses the knowledgeObject pattern for knowledge objects", () => {
      const input: ResolveRoutesInput = {
        id: "reg-test",
        siteUrl: rtimiDentalSiteUrl,
        objects: [rtimidentalFixture],
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].path).toBe(
        `/fr/${rtimidentalFixture.slug}`
      );
    });

    it("accepts a custom knowledgeObject pattern override", () => {
      const input: ResolveRoutesInput = {
        id: "reg-test",
        siteUrl: rtimiDentalSiteUrl,
        objects: [rtimidentalFixture],
        patterns: { knowledgeObject: "/:language/questions/:slug" },
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].path).toBe(
        `/fr/questions/${rtimidentalFixture.slug}`
      );
    });
  });
});
