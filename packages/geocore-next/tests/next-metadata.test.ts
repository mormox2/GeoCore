import { describe, it, expect } from "vitest";
import { generateNextMetadata } from "../src/metadata/next-metadata.js";
import { apiDatasetFixture, rtimidentalFixture } from "../../geocore/src/index.js";

describe("Next.js Metadata Generator", () => {
  it("generates complete Next.js App Router metadata for a published object", () => {
    const metadata = generateNextMetadata(rtimidentalFixture, apiDatasetFixture, {
      siteName: "RTimi Dental",
      fallbackSiteUrl: "https://rtimidental.tn",
    });

    expect(metadata.title).toBe("Le détartrage abîme-t-il les dents ?");
    expect(metadata.description).toContain("Réponse claire");
    expect(metadata.openGraph?.siteName).toBe("RTimi Dental");
    expect(metadata.openGraph?.type).toBe("article");
    expect(metadata.robots?.index).toBe(true);
    expect(metadata.robots?.follow).toBe(true);
    expect(metadata.authors?.[0].name).toBe("author_dr_mossaab_rtimi");
  });

  it("sets robots index=false for non-published objects", () => {
    const draftObject = {
      ...rtimidentalFixture,
      status: "draft" as const,
    };
    const metadata = generateNextMetadata(draftObject, apiDatasetFixture);
    expect(metadata.robots?.index).toBe(false);
    expect(metadata.robots?.follow).toBe(false);
  });

  it("populates OpenGraph images from attached media in dataset", () => {
    const metadata = generateNextMetadata(rtimidentalFixture, apiDatasetFixture);
    expect(metadata.openGraph?.images).toBeDefined();
    expect(metadata.openGraph?.images?.length).toBeGreaterThan(0);
    expect(metadata.openGraph?.images?.[0].url).toContain("scaling-before-after.jpg");
  });
});
