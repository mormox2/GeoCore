import { describe, it, expect } from "vitest";
import {
  createRouteId,
  isValidRoutePath,
  isValidCanonicalUrl,
  joinSiteUrlAndPath,
  applyRoutePattern,
  normalizeRoutePath,
  isPublicRouteObject,
  dedupeRouteEntries,
} from "../src/routing/route-utils.js";
import type { KnowledgeObject } from "../src/types/knowledge-object.js";
import { rtimidentalFixture } from "../src/fixtures/rtimidental.fixture.js";

describe("Route Utility Tests", () => {
  describe("createRouteId", () => {
    it("is deterministic — same inputs produce the same id", () => {
      const a = createRouteId("knowledge-object", "ko_1");
      const b = createRouteId("knowledge-object", "ko_1");
      expect(a).toBe(b);
      expect(a).toBe("route_knowledge-object_ko_1");
    });

    it("distinguishes different source types", () => {
      expect(createRouteId("collection", "ko_1")).not.toBe(
        createRouteId("knowledge-object", "ko_1")
      );
    });
  });

  describe("isValidRoutePath", () => {
    it("accepts a valid path", () => {
      expect(isValidRoutePath("/fr/questions/detartrage")).toBe(true);
    });

    it("accepts Arabic characters", () => {
      expect(isValidRoutePath("/ar/glossaire/زراعة-الأسنان")).toBe(true);
    });

    it("rejects a path without a leading slash", () => {
      expect(isValidRoutePath("fr/page")).toBe(false);
    });

    it("rejects an empty path", () => {
      expect(isValidRoutePath("")).toBe(false);
    });

    it("rejects a full URL as path", () => {
      expect(isValidRoutePath("https://example.com/page")).toBe(false);
    });

    it("rejects a path with a query string", () => {
      expect(isValidRoutePath("/fr/page?x=1")).toBe(false);
    });

    it("rejects a path with a hash fragment", () => {
      expect(isValidRoutePath("/fr/page#section")).toBe(false);
    });

    it("rejects duplicate slashes", () => {
      expect(isValidRoutePath("/fr//page")).toBe(false);
    });

    it("rejects whitespace", () => {
      expect(isValidRoutePath("/fr/page with space")).toBe(false);
    });
  });

  describe("isValidCanonicalUrl", () => {
    it("accepts an https URL", () => {
      expect(isValidCanonicalUrl("https://example.com/fr/page")).toBe(true);
    });

    it("accepts an http URL", () => {
      expect(isValidCanonicalUrl("http://example.com/fr/page")).toBe(true);
    });

    it("rejects a non-URL string", () => {
      expect(isValidCanonicalUrl("not-a-url")).toBe(false);
    });

    it("rejects a relative path", () => {
      expect(isValidCanonicalUrl("/fr/page")).toBe(false);
    });

    it("rejects empty", () => {
      expect(isValidCanonicalUrl("")).toBe(false);
    });
  });

  describe("joinSiteUrlAndPath", () => {
    it("joins a site URL and a path", () => {
      expect(joinSiteUrlAndPath("https://example.com", "/fr/page")).toBe(
        "https://example.com/fr/page"
      );
    });

    it("collapses a trailing slash on the site URL", () => {
      expect(joinSiteUrlAndPath("https://example.com/", "/fr/page")).toBe(
        "https://example.com/fr/page"
      );
    });

    it("collapses multiple trailing slashes", () => {
      expect(joinSiteUrlAndPath("https://example.com///", "/fr/page")).toBe(
        "https://example.com/fr/page"
      );
    });

    it("adds a leading slash to the path if missing", () => {
      expect(joinSiteUrlAndPath("https://example.com", "fr/page")).toBe(
        "https://example.com/fr/page"
      );
    });

    it("preserves https://", () => {
      expect(joinSiteUrlAndPath("https://rtimidental.tn", "/fr/x")).toBe(
        "https://rtimidental.tn/fr/x"
      );
    });
  });

  describe("applyRoutePattern", () => {
    it("applies language and slug", () => {
      expect(applyRoutePattern("/:language/:slug", { language: "fr", slug: "x" })).toBe("/fr/x");
    });

    it("applies language, slug, and type", () => {
      expect(
        applyRoutePattern("/:language/:type/:slug", {
          language: "fr",
          slug: "x",
          type: "docs",
        })
      ).toBe("/fr/docs/x");
    });

    it("returns undefined when a required value is missing", () => {
      expect(applyRoutePattern("/:language/:slug", { slug: "x" })).toBeUndefined();
    });

    it("returns undefined when language is empty", () => {
      expect(applyRoutePattern("/:language/:slug", { language: "", slug: "x" })).toBeUndefined();
    });

    it("returns undefined for an empty pattern", () => {
      expect(applyRoutePattern("", { language: "fr", slug: "x" })).toBeUndefined();
    });
  });

  describe("normalizeRoutePath", () => {
    it("preserves a leading slash", () => {
      expect(normalizeRoutePath("/fr/page")).toBe("/fr/page");
    });

    it("adds a leading slash when missing", () => {
      expect(normalizeRoutePath("fr/page")).toBe("/fr/page");
    });

    it("collapses duplicate slashes", () => {
      expect(normalizeRoutePath("/fr//page")).toBe("/fr/page");
    });

    it("returns / for an empty path", () => {
      expect(normalizeRoutePath("")).toBe("/");
    });

    it("strips a full URL down to its pathname", () => {
      expect(normalizeRoutePath("https://example.com/fr/page")).toBe("/fr/page");
    });
  });

  describe("isPublicRouteObject", () => {
    it("returns true for a published object", () => {
      expect(isPublicRouteObject(rtimidentalFixture)).toBe(true);
    });

    it("returns false for a draft object", () => {
      const draft: KnowledgeObject = { ...rtimidentalFixture, status: "draft" };
      expect(isPublicRouteObject(draft)).toBe(false);
    });

    it("returns false for a null object", () => {
      expect(isPublicRouteObject(null as unknown as KnowledgeObject)).toBe(false);
    });
  });

  describe("dedupeRouteEntries", () => {
    it("removes duplicate ids keeping the first", () => {
      const a = { id: "route_x" };
      const b = { id: "route_y" };
      const aDup = { id: "route_x" };
      const out = dedupeRouteEntries([a, b, aDup] as Array<{ id: string }>);
      expect(out).toHaveLength(2);
      expect(out.map((r) => r.id)).toEqual(["route_x", "route_y"]);
    });

    it("does not mutate the input", () => {
      const input = [{ id: "route_x" }, { id: "route_x" }];
      const snapshot = input.map((r) => r.id);
      dedupeRouteEntries(input as Array<{ id: string }>);
      expect(input.map((r) => r.id)).toEqual(snapshot);
    });
  });
});
