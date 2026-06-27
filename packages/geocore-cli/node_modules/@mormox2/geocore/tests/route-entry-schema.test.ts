import { describe, it, expect } from "vitest";
import { routeEntrySchema } from "../src/schemas/route-entry.schema.js";
import type { RouteEntry } from "../src/types/route-entry.js";
import { sampleRouteEntry } from "../src/fixtures/route.fixture.js";

describe("Route Entry Schema Tests", () => {
  describe("routeEntrySchema", () => {
    it("passes for a valid RouteEntry", () => {
      const result = routeEntrySchema.safeParse(sampleRouteEntry);
      expect(result.success).toBe(true);
    });

    it("fails for an invalid route type", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        type: "unknown-type",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid status", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        status: "live",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid visibility", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        visibility: "open",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid path (no leading slash)", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        path: "fr/sample-slug",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid path (full URL)", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        path: "https://example.com/fr/sample-slug",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid path (query string)", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        path: "/fr/sample-slug?x=1",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid path (hash fragment)", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        path: "/fr/sample-slug#section",
      });
      expect(result.success).toBe(false);
    });

    it("fails for duplicate slashes in path", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        path: "/fr//sample-slug",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid canonicalUrl", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        canonicalUrl: "not-a-url",
      });
      expect(result.success).toBe(false);
    });

    it("fails when required fields are missing", () => {
      // Omit id, sourceId, path, generatedAt entirely.
      const { id, sourceId, path, generatedAt, ...rest } = sampleRouteEntry;
      void id;
      void sourceId;
      void path;
      void generatedAt;
      const result = routeEntrySchema.safeParse(rest);
      expect(result.success).toBe(false);
    });

    it("preserves Arabic characters in path", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        path: "/ar/glossaire/زراعة-الأسنان",
      });
      expect(result.success).toBe(true);
    });

    it("fails when alternates is not an array", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        alternates: "not-an-array",
      });
      expect(result.success).toBe(false);
    });

    it("fails when redirects is not an array", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        redirects: "not-an-array",
      });
      expect(result.success).toBe(false);
    });

    it("fails for an invalid redirect statusCode", () => {
      const result = routeEntrySchema.safeParse({
        ...sampleRouteEntry,
        redirects: [{ from: "/a", to: "/b", statusCode: 200 }],
      });
      expect(result.success).toBe(false);
    });
  });
});
