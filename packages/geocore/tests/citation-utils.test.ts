import { describe, it, expect } from "vitest";
import {
  isActiveSource,
  isPublicSource,
  isActiveCitation,
  isHighConfidenceCitation,
  hasResolvedSource,
  buildSourceMap,
  getCitationsForTarget,
  getCitationsForSource,
  extractSourceIds,
  extractTargetIds,
  createCitationId,
} from "../src/citation/citation-utils.js";
import {
  whoOralHealthSource,
  drMossaabProfessionalReview,
  dawajinInternalReleaseNotes,
  deprecatedSource,
  scalingCitation,
  professionalReviewCitation,
  dawajinInternalCitation,
  removedCitation,
  allSourcesFixture,
  allCitationsFixture,
} from "../src/fixtures/citation.fixture.js";

describe("Citation Utils", () => {
  describe("isActiveSource", () => {
    it("returns true for active sources", () => {
      expect(isActiveSource(whoOralHealthSource)).toBe(true);
    });

    it("returns false for deprecated sources", () => {
      expect(isActiveSource(deprecatedSource)).toBe(false);
    });
  });

  describe("isPublicSource", () => {
    it("returns true for public visibility", () => {
      expect(isPublicSource(whoOralHealthSource)).toBe(true);
    });

    it("returns false for internal visibility", () => {
      expect(isPublicSource(dawajinInternalReleaseNotes)).toBe(false);
    });
  });

  describe("isActiveCitation", () => {
    it("returns true for active citation", () => {
      expect(isActiveCitation(scalingCitation)).toBe(true);
    });

    it("returns false for removed citation", () => {
      expect(isActiveCitation(removedCitation)).toBe(false);
    });
  });

  describe("isHighConfidenceCitation", () => {
    it("returns true for authoritative confidence", () => {
      expect(isHighConfidenceCitation(scalingCitation)).toBe(true);
    });

    it("returns false for medium confidence", () => {
      expect(isHighConfidenceCitation(dawajinInternalCitation)).toBe(false);
    });
  });

  describe("buildSourceMap", () => {
    it("creates a map indexed by source id", () => {
      const map = buildSourceMap(allSourcesFixture);
      expect(map.size).toBe(3);
      expect(map.has("source_who_oral_health_2024")).toBe(true);
    });
  });

  describe("hasResolvedSource", () => {
    it("returns true if source exists in map", () => {
      const map = buildSourceMap(allSourcesFixture);
      expect(hasResolvedSource(scalingCitation, map)).toBe(true);
    });

    it("returns false if source does not exist in map", () => {
      const emptyMap = new Map();
      expect(hasResolvedSource(scalingCitation, emptyMap)).toBe(false);
    });
  });

  describe("getCitationsForTarget", () => {
    it("returns only citations matching the targetId", () => {
      const all = [...allCitationsFixture, removedCitation];
      const result = getCitationsForTarget(all, "ko_detartrage_abime_dents");
      expect(result).toHaveLength(3); // scaling, professional review, removed
      expect(result.every((c) => c.targetId === "ko_detartrage_abime_dents")).toBe(true);
    });
  });

  describe("getCitationsForSource", () => {
    it("returns citations for a specific sourceId", () => {
      const result = getCitationsForSource(allCitationsFixture, "source_who_oral_health_2024");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("citation_scaling_safety_001");
    });
  });

  describe("extractSourceIds", () => {
    it("returns unique source IDs used in citations", () => {
      const ids = extractSourceIds(allCitationsFixture);
      expect(ids).toHaveLength(3);
      expect(ids).toContain("source_who_oral_health_2024");
    });
  });

  describe("extractTargetIds", () => {
    it("returns unique target IDs from citations", () => {
      const ids = extractTargetIds(allCitationsFixture);
      expect(ids).toHaveLength(2); // detartrage + dawajin balance
    });
  });

  describe("createCitationId", () => {
    it("generates a deterministic citation ID", () => {
      const id = createCitationId("source_who_oral_health_2024", "ko_detartrage_abime_dents");
      expect(id).toBe("citation_source_who_oral_health_2024_to_ko_detartrage_abime_dents");
    });
  });
});
