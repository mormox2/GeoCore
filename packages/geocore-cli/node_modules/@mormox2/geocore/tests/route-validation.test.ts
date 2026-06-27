import { describe, it, expect } from "vitest";
import { validateRouteEntry } from "../src/routing/validate-route-entry.js";
import { validateRouteRegistry } from "../src/routing/validate-route-registry.js";
import type { RouteEntry } from "../src/types/route-entry.js";
import type { RouteRegistry } from "../src/types/route.js";
import {
  sampleRouteEntry,
  duplicatePathRegistry,
  redirectLoopRegistry,
  warningOnlyRegistry,
} from "../src/fixtures/route.fixture.js";

describe("Route Validation Tests", () => {
  describe("validateRouteEntry", () => {
    it("passes for a valid route", () => {
      const result = validateRouteEntry(sampleRouteEntry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("fails for a missing path", () => {
      const result = validateRouteEntry({ ...sampleRouteEntry, path: "" });
      expect(result.valid).toBe(false);
      expect(result.publishable).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_ROUTE_PATH_MISSING")).toBe(true);
    });

    it("fails for an invalid path", () => {
      const result = validateRouteEntry({ ...sampleRouteEntry, path: "no-slash" });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_ROUTE_PATH_INVALID")).toBe(true);
    });

    it("fails for an invalid canonical URL", () => {
      const result = validateRouteEntry({
        ...sampleRouteEntry,
        canonicalUrl: "not-a-url",
      });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_ROUTE_CANONICAL_URL_INVALID")).toBe(true);
    });

    it("fails when a public route has non-public visibility", () => {
      const result = validateRouteEntry({
        ...sampleRouteEntry,
        visibility: "internal",
      });
      expect(result.valid).toBe(false);
      expect(
        result.issues.some((i) => i.code === "GC_ROUTE_PUBLIC_VISIBILITY_INVALID")
      ).toBe(true);
    });

    it("fails for a missing id", () => {
      const result = validateRouteEntry({ ...sampleRouteEntry, id: "" });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_ROUTE_ID_MISSING")).toBe(true);
    });

    it("fails for an invalid status", () => {
      const result = validateRouteEntry({
        ...sampleRouteEntry,
        status: "live" as RouteEntry["status"],
      });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_ROUTE_STATUS_INVALID")).toBe(true);
    });
  });

  describe("validateRouteRegistry", () => {
    const validRegistry: RouteRegistry = {
      id: "route-registry-1",
      siteUrl: "https://example.com",
      routes: [sampleRouteEntry],
      generatedAt: "2026-06-25T10:00:00Z",
      diagnostics: [],
    };

    it("passes for a valid registry", () => {
      const result = validateRouteRegistry(validRegistry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("fails for a duplicate path in registry", () => {
      const result = validateRouteRegistry(duplicatePathRegistry);
      expect(result.valid).toBe(false);
      expect(result.publishable).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_ROUTE_PATH_DUPLICATE")).toBe(true);
    });

    it("a redirect loop makes registry non-publishable", () => {
      const result = validateRouteRegistry(redirectLoopRegistry);
      expect(result.valid).toBe(false);
      expect(result.publishable).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_ROUTE_REDIRECT_LOOP")).toBe(true);
      expect(
        result.issues.some(
          (i) => i.code === "GC_ROUTE_REDIRECT_LOOP" && i.severity === "critical"
        )
      ).toBe(true);
    });

    it("a warning does not block publication", () => {
      const result = validateRouteRegistry(warningOnlyRegistry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("fails for a missing registry id", () => {
      const result = validateRouteRegistry({ ...validRegistry, id: "" });
      expect(result.valid).toBe(false);
      expect(
        result.issues.some((i) => i.code === "GC_ROUTE_REGISTRY_ID_MISSING")
      ).toBe(true);
    });

    it("fails when routes is not an array", () => {
      const result = validateRouteRegistry({
        ...validRegistry,
        routes: "not-an-array" as unknown as RouteEntry[],
      });
      expect(result.valid).toBe(false);
      expect(
        result.issues.some((i) => i.code === "GC_ROUTE_REGISTRY_ROUTES_INVALID")
      ).toBe(true);
    });
  });
});
