import { describe, it, expect } from "vitest";
import {
  filterCitations,
  filterActiveCitations,
  filterSources,
  filterPublicSources,
} from "../src/citation/citation-filter.js";
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

describe("Citation Filter", () => {
  describe("filterCitations — by status", () => {
    it("returns only citations with matching status", () => {
      const result = filterCitations([...allCitationsFixture, removedCitation], { status: "active" });
      expect(result).toHaveLength(3);
      expect(result.every((c) => c.status === "active")).toBe(true);
    });

    it("returns removed citations when filtering by removed", () => {
      const result = filterCitations([...allCitationsFixture, removedCitation], { status: "removed" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("citation_removed_001");
    });
  });

  describe("filterCitations — by targetId", () => {
    it("returns only citations for matching target", () => {
      const result = filterCitations(allCitationsFixture, { targetId: "ko_detartrage_abime_dents" });
      expect(result).toHaveLength(2);
    });
  });

  describe("filterCitations — by sourceId", () => {
    it("returns only citations for matching source", () => {
      const result = filterCitations(allCitationsFixture, { sourceId: "source_who_oral_health_2024" });
      expect(result).toHaveLength(1);
    });
  });

  describe("filterCitations — by purpose", () => {
    it("returns only citations with matching purpose", () => {
      const result = filterCitations(allCitationsFixture, { purpose: "supports" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("citation_scaling_safety_001");
    });
  });

  describe("filterActiveCitations", () => {
    it("excludes removed and deprecated citations", () => {
      const result = filterActiveCitations([...allCitationsFixture, removedCitation]);
      expect(result).toHaveLength(3);
      expect(result.every((c) => c.status === "active")).toBe(true);
    });
  });

  describe("filterSources — by status", () => {
    it("filters by status correctly", () => {
      const result = filterSources([...allSourcesFixture, deprecatedSource], { status: "deprecated" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("source_deprecated_001");
    });
  });

  describe("filterSources — by trustLevel", () => {
    it("returns only authoritative sources", () => {
      const result = filterSources(allSourcesFixture, { trustLevel: "authoritative" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("source_who_oral_health_2024");
    });
  });

  describe("filterPublicSources", () => {
    it("excludes internal and deprecated sources", () => {
      const result = filterPublicSources([...allSourcesFixture, deprecatedSource]);
      expect(result).toHaveLength(2); // WHO + Dr Mossaab (both active+public)
      expect(result.every((s) => s.status === "active")).toBe(true);
    });
  });
});
