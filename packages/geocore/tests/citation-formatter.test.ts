import { describe, it, expect } from "vitest";
import {
  formatSourceInline,
  formatSourceApa,
  formatCitationLabel,
  formatCitationWithSource,
  formatCitationListMarkdown,
  formatSourceTrustBadge,
} from "../src/citation/citation-formatter.js";
import {
  whoOralHealthSource,
  drMossaabProfessionalReview,
  dawajinInternalReleaseNotes,
  scalingCitation,
  allSourcesFixture,
  allCitationsFixture,
} from "../src/fixtures/citation.fixture.js";
import { buildSourceMap } from "../src/citation/citation-utils.js";

describe("Citation Formatter", () => {
  describe("formatSourceInline", () => {
    it("includes title, publisher and year", () => {
      const result = formatSourceInline(whoOralHealthSource);
      expect(result).toContain("WHO Oral Health Fact Sheet");
      expect(result).toContain("World Health Organization");
      expect(result).toContain("2024");
    });

    it("formats a source without publisher gracefully", () => {
      const result = formatSourceInline(drMossaabProfessionalReview);
      expect(result).toContain("Professional Dental Review");
    });
  });

  describe("formatSourceApa", () => {
    it("formats APA-style with authors, year, title, publisher, url", () => {
      const result = formatSourceApa(whoOralHealthSource);
      expect(result).toContain("Unknown Author"); // no explicit authors in fixture
      expect(result).toContain("2024");
      expect(result).toContain("WHO Oral Health Fact Sheet");
      expect(result).toContain("World Health Organization");
      expect(result).toContain("https://");
    });

    it("handles missing publication date as n.d.", () => {
      const result = formatSourceApa(drMossaabProfessionalReview);
      expect(result).toContain("n.d.");
    });
  });

  describe("formatCitationLabel", () => {
    it("includes purpose and IDs", () => {
      const result = formatCitationLabel(scalingCitation);
      expect(result).toContain("[supports]");
      expect(result).toContain("citation_scaling_safety_001");
      expect(result).toContain("source_who_oral_health_2024");
    });
  });

  describe("formatCitationWithSource", () => {
    it("includes paraphrase when present", () => {
      const result = formatCitationWithSource(scalingCitation, whoOralHealthSource);
      expect(result).toContain("[supports]");
      expect(result).toContain("Professional dental scaling does not damage");
    });

    it("shows label only when no quote or paraphrase", () => {
      const rawCitation = { ...scalingCitation, quote: undefined, paraphrase: undefined };
      const result = formatCitationWithSource(rawCitation as any, whoOralHealthSource);
      expect(result).toContain("[supports]");
      expect(result).not.toContain(":"); // no colon separator
    });
  });

  describe("formatCitationListMarkdown", () => {
    it("generates a markdown list of citations", () => {
      const sourceMap = buildSourceMap(allSourcesFixture);
      const result = formatCitationListMarkdown(allCitationsFixture, sourceMap);
      expect(result).toContain("- [");
      expect(result.split("\n").length).toBe(3);
    });

    it("returns empty string for empty citations", () => {
      const result = formatCitationListMarkdown([], new Map());
      expect(result).toBe("");
    });

    it("flags unknown sources", () => {
      const result = formatCitationListMarkdown(allCitationsFixture, new Map());
      expect(result).toContain("Source not found");
    });
  });

  describe("formatSourceTrustBadge", () => {
    it("returns green badge for authoritative sources", () => {
      const result = formatSourceTrustBadge(whoOralHealthSource);
      expect(result).toContain("🟢 Authoritative");
    });

    it("returns blue badge for high trust sources", () => {
      const result = formatSourceTrustBadge(drMossaabProfessionalReview);
      expect(result).toContain("🔵 High Trust");
    });

    it("returns medium badge for medium trust sources", () => {
      const result = formatSourceTrustBadge(dawajinInternalReleaseNotes);
      expect(result).toContain("🟡 Medium Trust");
    });
  });
});
