import { describe, it, expect } from "vitest";
import { buildSitemap } from "../src/api/sitemap-api.js";
import { apiDatasetFixture } from "../src/fixtures/api.fixture.js";

describe("Sitemap API", () => {
  it("builds a sitemap output from dataset", () => {
    const res = buildSitemap(apiDatasetFixture, "https://rtimidental.fr");
    expect(res.status).toBe("ok");
    expect(res.data).toBeDefined();
    expect(res.data?.entries.length).toBeGreaterThan(0);
    expect(res.data?.xml).toContain("<urlset");
  });

  it("handles errors gracefully", () => {
    const invalidDataset = { ...apiDatasetFixture, objects: null as any };
    const res = buildSitemap(invalidDataset);
    expect(res.status).toBe("error");
    expect(res.error).toBeTruthy();
  });
});
