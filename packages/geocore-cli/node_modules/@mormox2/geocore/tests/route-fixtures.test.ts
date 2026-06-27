import { describe, it, expect } from "vitest";
import { resolveRoutes } from "../src/routing/route-registry.js";
import { validateRouteRegistry } from "../src/routing/validate-route-registry.js";
import {
  rtimiDentalRouteInput,
  rtimiDentalRouteRegistry,
  dawajinProRouteInput,
  dawajinProRouteRegistry,
} from "../src/fixtures/route.fixture.js";
import {
  rtimiDentalExpectedRoute,
  rtimiDentalSiteUrl,
} from "../src/fixtures/rtimidental.fixture.js";
import {
  dawajinProExpectedRoute,
  dawajinProSiteUrl,
} from "../src/fixtures/dawajinpro.fixture.js";

describe("Route Fixture Tests", () => {
  describe("RTimi Dental", () => {
    it("static fixture registry validates", () => {
      const result = validateRouteRegistry(rtimiDentalRouteRegistry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("static fixture has the expected path", () => {
      const route = rtimiDentalRouteRegistry.routes[0];
      expect(route.path).toBe(rtimiDentalExpectedRoute.path);
    });

    it("static fixture has the expected canonical URL", () => {
      const route = rtimiDentalRouteRegistry.routes[0];
      expect(route.canonicalUrl).toBe(rtimiDentalExpectedRoute.canonicalUrl);
    });

    it("resolved registry validates", () => {
      const registry = resolveRoutes(rtimiDentalRouteInput);
      const result = validateRouteRegistry(registry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("resolved route has the expected path", () => {
      const registry = resolveRoutes(rtimiDentalRouteInput);
      expect(registry.routes[0].path).toBe(rtimiDentalExpectedRoute.path);
    });

    it("resolved route has the expected canonical URL", () => {
      const registry = resolveRoutes(rtimiDentalRouteInput);
      expect(registry.routes[0].canonicalUrl).toBe(rtimiDentalExpectedRoute.canonicalUrl);
    });

    it("resolved route is public and published", () => {
      const registry = resolveRoutes(rtimiDentalRouteInput);
      expect(registry.routes[0].status).toBe("published");
      expect(registry.routes[0].visibility).toBe("public");
    });

    it("resolved route uses the rtimidental site URL", () => {
      const registry = resolveRoutes(rtimiDentalRouteInput);
      expect(registry.siteUrl).toBe(rtimiDentalSiteUrl);
    });
  });

  describe("Dawajin Pro", () => {
    it("static fixture registry validates", () => {
      const result = validateRouteRegistry(dawajinProRouteRegistry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("static fixture has the expected path", () => {
      const route = dawajinProRouteRegistry.routes[0];
      expect(route.path).toBe(dawajinProExpectedRoute.path);
    });

    it("static fixture has the expected canonical URL", () => {
      const route = dawajinProRouteRegistry.routes[0];
      expect(route.canonicalUrl).toBe(dawajinProExpectedRoute.canonicalUrl);
    });

    it("resolved registry validates", () => {
      const registry = resolveRoutes(dawajinProRouteInput);
      const result = validateRouteRegistry(registry);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("resolved route has the expected path", () => {
      const registry = resolveRoutes(dawajinProRouteInput);
      expect(registry.routes[0].path).toBe(dawajinProExpectedRoute.path);
    });

    it("resolved route has the expected canonical URL", () => {
      const registry = resolveRoutes(dawajinProRouteInput);
      expect(registry.routes[0].canonicalUrl).toBe(dawajinProExpectedRoute.canonicalUrl);
    });

    it("resolved route is public and published", () => {
      const registry = resolveRoutes(dawajinProRouteInput);
      expect(registry.routes[0].status).toBe("published");
      expect(registry.routes[0].visibility).toBe("public");
    });

    it("resolved route uses the dawajinpro site URL", () => {
      const registry = resolveRoutes(dawajinProRouteInput);
      expect(registry.siteUrl).toBe(dawajinProSiteUrl);
    });
  });
});
