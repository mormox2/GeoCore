import { describe, it, expect } from "vitest";
import {
  isPublicMedia,
  isActiveMedia,
  isRenderableMedia,
  isImageMedia,
  isVideoMedia,
  isDocumentMedia,
  getMediaLabel,
  createMediaId,
  getMediaExtension,
  inferMimeType,
} from "../src/media/media-utils.js";
import {
  implantDiagramMedia,
  scalingBeforeAfterMedia,
  dawajinInternalDocMedia,
} from "../src/fixtures/media.fixture.js";

describe("Media Utils", () => {
  describe("isPublicMedia", () => {
    it("returns true for public visibility", () => {
      expect(isPublicMedia(implantDiagramMedia)).toBe(true);
    });

    it("returns false for internal visibility", () => {
      expect(isPublicMedia(dawajinInternalDocMedia)).toBe(false);
    });
  });

  describe("isActiveMedia", () => {
    it("returns true for active status", () => {
      expect(isActiveMedia(implantDiagramMedia)).toBe(true);
    });
  });

  describe("isRenderableMedia", () => {
    it("returns true for active+public", () => {
      expect(isRenderableMedia(scalingBeforeAfterMedia)).toBe(true);
    });

    it("returns false for internal", () => {
      expect(isRenderableMedia(dawajinInternalDocMedia)).toBe(false);
    });
  });

  describe("isImageMedia", () => {
    it("returns true for image type", () => {
      expect(isImageMedia(scalingBeforeAfterMedia)).toBe(true);
    });

    it("returns true for diagram type", () => {
      expect(isImageMedia(implantDiagramMedia)).toBe(true);
    });
  });

  describe("isVideoMedia", () => {
    it("returns false for image media", () => {
      expect(isVideoMedia(scalingBeforeAfterMedia)).toBe(false);
    });
  });

  describe("isDocumentMedia", () => {
    it("returns true for PDF type", () => {
      expect(isDocumentMedia(dawajinInternalDocMedia)).toBe(true);
    });
  });

  describe("getMediaLabel", () => {
    it("formats label as [type] title", () => {
      const label = getMediaLabel(implantDiagramMedia);
      expect(label).toBe("[diagram] Dental Implant Anatomy Diagram");
    });
  });

  describe("createMediaId", () => {
    it("generates a deterministic media ID", () => {
      const id = createMediaId("image", "scaling-before-after.jpg");
      expect(id).toBe("media_image_scaling-before-after_jpg");
    });
  });

  describe("getMediaExtension", () => {
    it("extracts the file extension", () => {
      expect(getMediaExtension("photo.jpg")).toBe("jpg");
      expect(getMediaExtension("diagram.svg")).toBe("svg");
    });

    it("returns undefined for no extension", () => {
      expect(getMediaExtension("noextension")).toBeUndefined();
    });
  });

  describe("inferMimeType", () => {
    it("returns the mimeType if already set", () => {
      expect(inferMimeType(implantDiagramMedia)).toBe("image/svg+xml");
    });

    it("infers image/* for image type without mimeType", () => {
      const asset = { ...scalingBeforeAfterMedia, mimeType: undefined };
      expect(inferMimeType(asset as any)).toBe("image/*");
    });
  });
});
