import { describe, it, expect } from "vitest";
import { resolveRoutes } from "../src/routing/route-registry.js";
import { createRouteEntryFromKnowledgeObject, resolveCanonicalUrl } from "../src/routing/route-resolver.js";
import { filterRouteObjects } from "../src/routing/route-filter.js";
import type { ResolveRoutesInput } from "../src/types/route.js";
import type { KnowledgeObject } from "../src/types/knowledge-object.js";
import type { ResolvedMetadata } from "../src/types/metadata.js";
import type { RouteAlternate, RouteRedirect } from "../src/types/route-entry.js";
import { rtimidentalFixture } from "../src/fixtures/rtimidental.fixture.js";
import { rtimiDentalSiteUrl } from "../src/fixtures/rtimidental.fixture.js";

const baseObject: KnowledgeObject = {
  ...rtimidentalFixture,
  id: "ko_test",
  slug: "test-slug",
  language: "fr",
};

describe("Route Resolver Tests", () => {
  describe("createRouteEntryFromKnowledgeObject", () => {
    it("resolves a route from the object slug", () => {
      const entry = createRouteEntryFromKnowledgeObject({
        object: baseObject,
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
      });
      expect(entry).not.toBeNull();
      expect(entry!.path).toBe("/fr/test-slug");
      expect(entry!.slug).toBe("test-slug");
      expect(entry!.language).toBe("fr");
    });

    it("resolves a route from metadata slug when object slug is absent", () => {
      const metadata = {
        slug: "metadata-slug",
        language: "fr",
        status: "published",
      } as ResolvedMetadata;
      const entry = createRouteEntryFromKnowledgeObject({
        object: { ...baseObject, slug: "" },
        metadata,
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
      });
      expect(entry).not.toBeNull();
      expect(entry!.slug).toBe("metadata-slug");
      expect(entry!.path).toBe("/fr/metadata-slug");
    });

    it("explicit path overrides pattern path", () => {
      const entry = createRouteEntryFromKnowledgeObject({
        object: baseObject,
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
        explicitPath: "/custom/path",
      });
      expect(entry!.path).toBe("/custom/path");
    });

    it("published object defaults to public visibility", () => {
      const entry = createRouteEntryFromKnowledgeObject({
        object: baseObject,
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
      });
      expect(entry!.visibility).toBe("public");
      expect(entry!.status).toBe("published");
    });

    it("non-published object defaults to internal visibility", () => {
      const entry = createRouteEntryFromKnowledgeObject({
        object: { ...baseObject, status: "draft" },
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
      });
      expect(entry!.visibility).toBe("internal");
    });

    it("returns null when object has no slug and no explicit path", () => {
      const entry = createRouteEntryFromKnowledgeObject({
        object: { ...baseObject, slug: "" },
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
      });
      expect(entry).toBeNull();
    });

    it("includes alternates when provided", () => {
      const alternates: RouteAlternate[] = [
        { language: "en", path: "/en/test-slug" },
      ];
      const entry = createRouteEntryFromKnowledgeObject({
        object: baseObject,
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
        alternates,
      });
      expect(entry!.alternates).toEqual(alternates);
    });

    it("includes redirects when provided", () => {
      const redirects: RouteRedirect[] = [
        { from: "/fr/old", to: "/fr/test-slug", statusCode: 301 },
      ];
      const entry = createRouteEntryFromKnowledgeObject({
        object: baseObject,
        siteUrl: rtimiDentalSiteUrl,
        pattern: "/:language/:slug",
        redirects,
      });
      expect(entry!.redirects).toEqual(redirects);
    });
  });

  describe("resolveCanonicalUrl precedence", () => {
    it("uses explicit canonical URL first", () => {
      expect(
        resolveCanonicalUrl({
          siteUrl: "https://a.com",
          path: "/fr/x",
          explicitCanonicalUrl: "https://explicit.com/fr/x",
          metadataCanonicalUrl: "https://meta.com/fr/x",
        })
      ).toBe("https://explicit.com/fr/x");
    });

    it("uses metadata canonical URL over siteUrl + path", () => {
      expect(
        resolveCanonicalUrl({
          siteUrl: "https://a.com",
          path: "/fr/x",
          metadataCanonicalUrl: "https://meta.com/fr/x",
        })
      ).toBe("https://meta.com/fr/x");
    });

    it("falls back to siteUrl + path", () => {
      expect(
        resolveCanonicalUrl({
          siteUrl: "https://a.com",
          path: "/fr/x",
        })
      ).toBe("https://a.com/fr/x");
    });

    it("returns undefined when nothing is available", () => {
      expect(resolveCanonicalUrl({})).toBeUndefined();
    });

    it("missing siteUrl does not invent a canonical URL", () => {
      expect(resolveCanonicalUrl({ path: "/fr/x" })).toBeUndefined();
    });
  });

  describe("resolveRoutes integration", () => {
    it("resolves a route from object slug with siteUrl", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
      };
      const registry = resolveRoutes(input);
      expect(registry.routes).toHaveLength(1);
      expect(registry.routes[0].path).toBe("/fr/test-slug");
      expect(registry.routes[0].canonicalUrl).toBe(
        `${rtimiDentalSiteUrl}/fr/test-slug`
      );
    });

    it("explicit path overrides pattern path", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
        explicitPaths: { ko_test: "/custom/path" },
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].path).toBe("/custom/path");
    });

    it("explicit canonical URL overrides metadata canonical URL", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
        metadata: {
          ko_test: {
            slug: "test-slug",
            language: "fr",
            status: "published",
            canonicalUrl: "https://meta.com/fr/test-slug",
          } as ResolvedMetadata,
        },
        explicitCanonicalUrls: { ko_test: "https://explicit.com/fr/test-slug" },
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].canonicalUrl).toBe(
        "https://explicit.com/fr/test-slug"
      );
    });

    it("metadata canonical URL overrides siteUrl + path", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
        metadata: {
          ko_test: {
            slug: "test-slug",
            language: "fr",
            status: "published",
            canonicalUrl: "https://meta.com/fr/test-slug",
          } as ResolvedMetadata,
        },
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].canonicalUrl).toBe(
        "https://meta.com/fr/test-slug"
      );
    });

    it("siteUrl + path creates canonical URL", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].canonicalUrl).toBe(
        `${rtimiDentalSiteUrl}/fr/test-slug`
      );
    });

    it("missing siteUrl does not invent a canonical URL", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        objects: [baseObject],
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].canonicalUrl).toBeUndefined();
    });

    it("object without slug and without explicit path returns null (no route)", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [{ ...baseObject, slug: "" }],
      };
      const registry = resolveRoutes(input);
      expect(registry.routes).toHaveLength(0);
      // a warning diagnostic should be emitted
      expect(
        registry.diagnostics.some((d) => d.code === "GC_ROUTE_SLUG_MISSING")
      ).toBe(true);
    });

    it("route includes alternates when provided", () => {
      const alternates: RouteAlternate[] = [{ language: "en", path: "/en/test-slug" }];
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
        alternates: { ko_test: alternates },
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].alternates).toEqual(alternates);
    });

    it("route includes redirects when provided", () => {
      const redirects: RouteRedirect[] = [
        { from: "/fr/old", to: "/fr/test-slug", statusCode: 301 },
      ];
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
        redirects: { ko_test: redirects },
      };
      const registry = resolveRoutes(input);
      expect(registry.routes[0].redirects).toEqual(redirects);
    });

    it("does not mutate input", () => {
      const input: ResolveRoutesInput = {
        id: "reg-1",
        siteUrl: rtimiDentalSiteUrl,
        objects: [baseObject],
        explicitPaths: { ko_test: "/immutable" },
      };
      const snapshot = JSON.parse(JSON.stringify(input));
      resolveRoutes(input);
      expect(JSON.parse(JSON.stringify(input))).toEqual(snapshot);
    });
  });

  describe("filterRouteObjects", () => {
    it("includes published public object in public mode", () => {
      expect(filterRouteObjects({ id: "x", objects: [baseObject] })).toHaveLength(1);
    });

    it("excludes draft object in public mode", () => {
      expect(
        filterRouteObjects({
          id: "x",
          objects: [{ ...baseObject, status: "draft" }],
        })
      ).toHaveLength(0);
    });

    it("excludes review object in public mode", () => {
      expect(
        filterRouteObjects({
          id: "x",
          objects: [{ ...baseObject, status: "review" }],
        })
      ).toHaveLength(0);
    });

    it("excludes archived object in public mode", () => {
      expect(
        filterRouteObjects({
          id: "x",
          objects: [{ ...baseObject, status: "archived" }],
        })
      ).toHaveLength(0);
    });

    it("internal mode includes draft/review/published/archived", () => {
      const objects: KnowledgeObject[] = [
        { ...baseObject, id: "a", status: "draft" },
        { ...baseObject, id: "b", status: "review" },
        { ...baseObject, id: "c", status: "published" },
        { ...baseObject, id: "d", status: "archived" },
      ];
      const out = filterRouteObjects({ id: "x", objects, visibility: "internal" });
      expect(out).toHaveLength(4);
    });

    it("language filter works", () => {
      const objects: KnowledgeObject[] = [
        { ...baseObject, id: "a", language: "fr" },
        { ...baseObject, id: "b", language: "en" },
      ];
      expect(filterRouteObjects({ id: "x", objects, language: "fr" })).toHaveLength(1);
    });

    it("excludes private object via metadata visibility hint", () => {
      const objects: KnowledgeObject[] = [
        { ...baseObject, metadata: { visibility: "private" } },
      ];
      expect(filterRouteObjects({ id: "x", objects })).toHaveLength(0);
    });

    it("excludes hidden object via metadata visibility hint", () => {
      const objects: KnowledgeObject[] = [
        { ...baseObject, metadata: { visibility: "hidden" } },
      ];
      expect(filterRouteObjects({ id: "x", objects })).toHaveLength(0);
    });
  });
});
