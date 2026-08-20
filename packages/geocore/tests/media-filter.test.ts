import { describe, it, expect } from "vitest";
import {
  filterMedia,
  filterPublicMedia,
  filterMediaForObject,
  filterMediaForEntity,
  filterImageMedia,
  filterVideoMedia,
} from "../src/media/media-filter.js";
import {
  implantDiagramMedia,
  scalingBeforeAfterMedia,
  dawajinDashboardScreenshotMedia,
  dawajinInternalDocMedia,
  allMediaFixture,
  allPublicMediaFixture,
} from "../src/fixtures/media.fixture.js";

describe("Media Filter", () => {
  describe("filterMedia — by visibility", () => {
    it("returns only public media", () => {
      const result = filterMedia(allMediaFixture, { visibility: "public" });
      expect(result).toHaveLength(3);
    });

    it("returns only internal media", () => {
      const result = filterMedia(allMediaFixture, { visibility: "internal" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("media_dawajin_internal_flowchart_001");
    });
  });

  describe("filterMedia — by type", () => {
    it("returns only diagram type", () => {
      const result = filterMedia(allMediaFixture, { type: "diagram" });
      expect(result).toHaveLength(1); // implant diagram only
    });

    it("returns only screenshot type", () => {
      const result = filterMedia(allMediaFixture, { type: "screenshot" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("media_dawajin_dashboard_screenshot_001");
    });
  });

  describe("filterPublicMedia", () => {
    it("returns only active+public media", () => {
      const result = filterPublicMedia(allMediaFixture);
      expect(result).toHaveLength(3);
      expect(result.every((a) => a.visibility === "public" && a.status === "active")).toBe(true);
    });
  });

  describe("filterMediaForObject", () => {
    it("returns media linked to a specific object", () => {
      const result = filterMediaForObject(allMediaFixture, "ko_detartrage_abime_dents");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("media_scaling_before_after_001");
    });

    it("returns empty for unknown object", () => {
      const result = filterMediaForObject(allMediaFixture, "ko_nonexistent");
      expect(result).toHaveLength(0);
    });
  });

  describe("filterMediaForEntity", () => {
    it("returns media linked to entity_scaling", () => {
      const result = filterMediaForEntity(allMediaFixture, "entity_scaling");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("media_scaling_before_after_001");
    });
  });

  describe("filterImageMedia", () => {
    it("returns image, diagram, screenshot, infographic", () => {
      const result = filterImageMedia(allMediaFixture);
      expect(result.length).toBe(3); // diagram (implant), image (scaling), screenshot (dawajin)
    });
  });

  describe("filterVideoMedia", () => {
    it("returns empty when no videos", () => {
      const result = filterVideoMedia(allMediaFixture);
      expect(result).toHaveLength(0);
    });
  });
});
