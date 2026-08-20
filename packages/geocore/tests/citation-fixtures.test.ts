import { describe, it, expect } from "vitest";
import {
  allSourcesFixture,
  allCitationsFixture,
  whoOralHealthSource,
  deprecatedSource,
} from "../src/fixtures/citation.fixture.js";

describe("Citation Fixtures", () => {
  describe("allSourcesFixture", () => {
    it("has the expected number of sources", () => {
      expect(allSourcesFixture).toHaveLength(3);
    });

    it("all sources have required fields", () => {
      for (const source of allSourcesFixture) {
        expect(source.id).toBeTruthy();
        expect(source.type).toBeTruthy();
        expect(source.title).toBeTruthy();
        expect(source.status).toBeTruthy();
        expect(source.createdAt).toBeTruthy();
        expect(source.updatedAt).toBeTruthy();
      }
    });

    it("WHO source has authoritative trust level", () => {
      const who = allSourcesFixture.find((s) => s.id === "source_who_oral_health_2024");
      expect(who?.trustLevel).toBe("authoritative");
    });
  });

  describe("allCitationsFixture", () => {
    it("has the expected number of citations", () => {
      expect(allCitationsFixture).toHaveLength(3);
    });

    it("all citations have required fields", () => {
      for (const citation of allCitationsFixture) {
        expect(citation.id).toBeTruthy();
        expect(citation.sourceId).toBeTruthy();
        expect(citation.targetId).toBeTruthy();
        expect(citation.purpose).toBeTruthy();
        expect(citation.status).toBeTruthy();
        expect(citation.createdAt).toBeTruthy();
        expect(citation.updatedAt).toBeTruthy();
      }
    });

    it("scaling citation references WHO source", () => {
      const scaling = allCitationsFixture.find((c) => c.id === "citation_scaling_safety_001");
      expect(scaling?.sourceId).toBe("source_who_oral_health_2024");
      expect(scaling?.targetId).toBe("ko_detartrage_abime_dents");
    });
  });

  describe("deprecatedSource fixture", () => {
    it("has status deprecated", () => {
      expect(deprecatedSource.status).toBe("deprecated");
    });
  });
});
