import { describe, it, expect } from "vitest";
import { validateSource } from "../src/citation/validate-source.js";
import { validateCitation } from "../src/citation/validate-citation.js";
import {
  whoOralHealthSource,
  drMossaabProfessionalReview,
  deprecatedSource,
  scalingCitation,
  removedCitation,
  allSourcesFixture,
} from "../src/fixtures/citation.fixture.js";
import { buildSourceMap } from "../src/citation/citation-utils.js";

describe("Citation Validation", () => {
  describe("validateSource", () => {
    it("validates a well-formed active source", () => {
      const result = validateSource(whoOralHealthSource);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
      expect(result.issues.filter((i) => i.severity === "error")).toHaveLength(0);
    });

    it("returns error for null input", () => {
      const result = validateSource(null);
      expect(result.valid).toBe(false);
      expect(result.issues).toHaveLength(1);
    });

    it("returns error for missing required fields", () => {
      const invalid = { id: "src_test", status: "active" };
      const result = validateSource(invalid);
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.severity === "error")).toBe(true);
    });

    it("emits a warning for deprecated source", () => {
      const result = validateSource(deprecatedSource);
      expect(result.valid).toBe(true); // deprecated is valid but warned
      const warnings = result.issues.filter((i) => i.severity === "warning");
      expect(warnings.length).toBeGreaterThan(0);
    });
  });

  describe("validateCitation", () => {
    it("validates a well-formed active citation", () => {
      const sourceMap = buildSourceMap(allSourcesFixture);
      const result = validateCitation(scalingCitation, sourceMap);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("returns error for null citation", () => {
      const result = validateCitation(null);
      expect(result.valid).toBe(false);
    });

    it("returns error for missing required fields", () => {
      const invalid = { id: "cit_test" };
      const result = validateCitation(invalid);
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.severity === "error")).toBe(true);
    });

    it("returns error for removed citation", () => {
      const result = validateCitation(removedCitation);
      expect(result.valid).toBe(false);
      const errors = result.issues.filter((i) => i.severity === "error");
      expect(errors.some((e) => e.code === "GC_CITATION_REMOVED")).toBe(true);
    });

    it("returns error if source is not found in source map", () => {
      const emptyMap = new Map();
      const result = validateCitation(scalingCitation, emptyMap);
      expect(result.valid).toBe(false);
      const errors = result.issues.filter((i) => i.severity === "error");
      expect(errors.some((e) => e.code === "GC_CITATION_SOURCE_NOT_FOUND")).toBe(true);
    });

    it("returns warning if target is not in known IDs", () => {
      const sourceMap = buildSourceMap(allSourcesFixture);
      const knownIds = new Set<string>(); // empty set
      const result = validateCitation(scalingCitation, sourceMap, knownIds);
      expect(result.valid).toBe(true); // target not found is a warning
      const warnings = result.issues.filter((i) => i.severity === "warning");
      expect(warnings.some((w) => w.code === "GC_CITATION_TARGET_NOT_FOUND")).toBe(true);
    });
  });
});
