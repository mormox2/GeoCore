import { describe, it, expect } from "vitest";
import { validateMediaAsset } from "../src/media/validate-media-asset.js";
import {
  implantDiagramMedia,
  scalingBeforeAfterMedia,
  dawajinInternalDocMedia,
  missingAltTextMedia,
} from "../src/fixtures/media.fixture.js";

describe("Media Validation", () => {
  describe("validateMediaAsset", () => {
    it("validates a well-formed active public image", () => {
      const result = validateMediaAsset(scalingBeforeAfterMedia);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
      expect(result.issues.filter((i) => i.severity === "error")).toHaveLength(0);
    });

    it("validates an internal media asset", () => {
      const result = validateMediaAsset(dawajinInternalDocMedia);
      expect(result.valid).toBe(true);
    });

    it("returns error for null input", () => {
      const result = validateMediaAsset(null);
      expect(result.valid).toBe(false);
      expect(result.issues).toHaveLength(1);
    });

    it("returns error for missing required fields", () => {
      const invalid = { id: "media_test", type: "image" };
      const result = validateMediaAsset(invalid);
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.severity === "error")).toBe(true);
    });

    it("emits a warning for missing alt text on public image", () => {
      const result = validateMediaAsset(missingAltTextMedia);
      expect(result.valid).toBe(true); // missing alt text is a warning, not an error
      const warnings = result.issues.filter((i) => i.severity === "warning");
      expect(warnings.some((w) => w.code === "GC_MEDIA_ALT_TEXT_MISSING")).toBe(true);
    });

    it("emits an error for private media with a canonicalUrl", () => {
      const privateWithUrl = {
        ...scalingBeforeAfterMedia,
        id: "media_private_url_test",
        visibility: "private" as const,
        canonicalUrl: "https://example.com/private.jpg",
      };
      const result = validateMediaAsset(privateWithUrl);
      expect(result.valid).toBe(false);
      const errors = result.issues.filter((i) => i.severity === "error");
      expect(errors.some((e) => e.code === "GC_MEDIA_PRIVATE_EXPOSED")).toBe(true);
    });

    it("emits a warning for consent-required public media", () => {
      const consentRequired = {
        ...scalingBeforeAfterMedia,
        id: "media_consent_test",
        consentStatus: "required" as const,
      };
      const result = validateMediaAsset(consentRequired);
      expect(result.valid).toBe(true);
      const warnings = result.issues.filter((i) => i.severity === "warning");
      expect(warnings.some((w) => w.code === "GC_MEDIA_CONSENT_REQUIRED")).toBe(true);
    });
  });
});
