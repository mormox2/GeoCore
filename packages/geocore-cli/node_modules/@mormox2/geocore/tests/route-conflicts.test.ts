import { describe, it, expect } from "vitest";
import { detectRouteConflicts } from "../src/routing/route-conflicts.js";
import type { RouteEntry } from "../src/types/route-entry.js";
import { sampleRouteEntry } from "../src/fixtures/route.fixture.js";

describe("Route Conflict Tests", () => {
  describe("detectRouteConflicts", () => {
    it("returns no diagnostics for non-conflicting routes", () => {
      const diagnostics = detectRouteConflicts([sampleRouteEntry]);
      expect(diagnostics).toHaveLength(0);
    });

    it("produces an error for duplicate route ids", () => {
      const routes: RouteEntry[] = [
        sampleRouteEntry,
        { ...sampleRouteEntry, sourceId: "ko_other" },
      ];
      const diagnostics = detectRouteConflicts(routes);
      expect(
        diagnostics.some(
          (d) => d.code === "GC_ROUTE_ID_DUPLICATE" && d.severity === "error"
        )
      ).toBe(true);
    });

    it("produces an error for duplicate paths", () => {
      const routes: RouteEntry[] = [
        sampleRouteEntry,
        {
          ...sampleRouteEntry,
          id: "route_knowledge-object_ko_other",
          sourceId: "ko_other",
        },
      ];
      const diagnostics = detectRouteConflicts(routes);
      expect(
        diagnostics.some(
          (d) => d.code === "GC_ROUTE_PATH_DUPLICATE" && d.severity === "error"
        )
      ).toBe(true);
    });

    it("produces an error for duplicate canonical URLs", () => {
      const routes: RouteEntry[] = [
        sampleRouteEntry,
        {
          ...sampleRouteEntry,
          id: "route_knowledge-object_ko_other",
          sourceId: "ko_other",
          path: "/fr/other",
        },
      ];
      const diagnostics = detectRouteConflicts(routes);
      expect(
        diagnostics.some(
          (d) =>
            d.code === "GC_ROUTE_CANONICAL_URL_DUPLICATE" && d.severity === "error"
        )
      ).toBe(true);
    });

    it("produces an error for a self-redirect", () => {
      const routes: RouteEntry[] = [
        {
          ...sampleRouteEntry,
          redirects: [
            { from: "/fr/sample-slug", to: "/fr/sample-slug", statusCode: 301 },
          ],
        },
      ];
      const diagnostics = detectRouteConflicts(routes);
      expect(
        diagnostics.some(
          (d) => d.code === "GC_ROUTE_REDIRECT_SELF" && d.severity === "error"
        )
      ).toBe(true);
    });

    it("produces a critical issue for a redirect loop", () => {
      const routes: RouteEntry[] = [
        {
          ...sampleRouteEntry,
          redirects: [
            { from: "/fr/a", to: "/fr/b", statusCode: 301 },
            { from: "/fr/b", to: "/fr/a", statusCode: 301 },
          ],
        },
      ];
      const diagnostics = detectRouteConflicts(routes);
      expect(
        diagnostics.some(
          (d) => d.code === "GC_ROUTE_REDIRECT_LOOP" && d.severity === "critical"
        )
      ).toBe(true);
    });

    it("does not flag a non-looping redirect chain", () => {
      const routes: RouteEntry[] = [
        {
          ...sampleRouteEntry,
          redirects: [{ from: "/fr/old", to: "/fr/new", statusCode: 301 }],
        },
      ];
      const diagnostics = detectRouteConflicts(routes);
      expect(diagnostics.some((d) => d.code === "GC_ROUTE_REDIRECT_LOOP")).toBe(false);
    });
  });
});
