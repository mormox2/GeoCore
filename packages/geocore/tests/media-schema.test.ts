import { describe, it, expect } from "vitest";
import { generateMediaSchema, generateImageObjectSchema, generateVideoObjectSchema } from "../src/media/media-schema.js";
import { toSitemapImage, toSitemapVideo, generateMediaSitemapXmlExtension } from "../src/media/media-sitemap.js";
import {
  formatImageHtml,
  formatImageMarkdown,
  formatMediaAttribution,
  formatMediaSummary,
  getMediaAltText,
  getMediaCaption,
} from "../src/media/media-formatter.js";
import {
  implantDiagramMedia,
  scalingBeforeAfterMedia,
  dawajinDashboardScreenshotMedia,
} from "../src/fixtures/media.fixture.js";

describe("Media Schema Generator", () => {
  it("generates an ImageObject schema for a diagram asset", () => {
    const schema = generateImageObjectSchema(implantDiagramMedia);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("ImageObject");
    expect(schema.name).toBe("Dental Implant Anatomy Diagram");
    expect(schema.encodingFormat).toBe("image/svg+xml");
    expect(schema.width).toBe("800px");
    expect(schema.height).toBe("600px");
  });

  it("generates an ImageObject schema via generateMediaSchema for image types", () => {
    const schema = generateMediaSchema(scalingBeforeAfterMedia);
    expect(schema?.["@type"]).toBe("ImageObject");
  });

  it("generates a MediaObject for non-image, non-video types", () => {
    const schema = generateMediaSchema({
      ...implantDiagramMedia,
      type: "pdf" as any,
      id: "media_pdf_test",
    });
    expect(schema?.["@type"]).toBe("MediaObject");
  });
});

describe("Media Sitemap Generator", () => {
  it("converts an image asset to a sitemap image entry", () => {
    const entry = toSitemapImage(scalingBeforeAfterMedia);
    expect(entry?.url).toBe("https://rtimidental.fr/media/scaling-before-after.jpg");
    expect(entry?.title).toBe("Dental Scaling Before and After");
  });

  it("returns undefined if no URL is available", () => {
    const noUrl = { ...scalingBeforeAfterMedia, canonicalUrl: undefined, source: "" };
    const entry = toSitemapImage(noUrl as any);
    expect(entry).toBeUndefined();
  });

  it("generates XML extension for images", () => {
    const image = toSitemapImage(scalingBeforeAfterMedia)!;
    const xml = generateMediaSitemapXmlExtension([image], []);
    expect(xml).toContain("<image:image>");
    expect(xml).toContain("<image:loc>");
    expect(xml).toContain("scaling-before-after.jpg");
  });
});

describe("Media Formatter", () => {
  it("getMediaAltText falls back to title if no altText", () => {
    const noAlt = { ...scalingBeforeAfterMedia, altText: undefined };
    expect(getMediaAltText(noAlt as any)).toBe("Dental Scaling Before and After");
  });

  it("getMediaAltText returns altText when present", () => {
    expect(getMediaAltText(implantDiagramMedia)).toContain("Diagram showing");
  });

  it("formatImageHtml generates an img tag", () => {
    const html = formatImageHtml(scalingBeforeAfterMedia);
    expect(html).toContain("<img");
    expect(html).toContain("scaling-before-after.jpg");
    expect(html).toContain('alt="');
  });

  it("formatImageMarkdown generates a markdown image", () => {
    const md = formatImageMarkdown(scalingBeforeAfterMedia);
    expect(md).toContain("![");
    expect(md).toContain("scaling-before-after.jpg");
  });

  it("formatMediaAttribution formats credit and copyright", () => {
    const attribution = formatMediaAttribution(implantDiagramMedia);
    expect(attribution).toContain("RTimi Dental 2026");
  });

  it("formatMediaSummary includes key fields", () => {
    const summary = formatMediaSummary(implantDiagramMedia);
    expect(summary).toContain("ID: media_implant_diagram_001");
    expect(summary).toContain("Type: diagram");
    expect(summary).toContain("Visibility: public");
  });
});
