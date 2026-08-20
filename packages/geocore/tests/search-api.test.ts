import { describe, it, expect } from "vitest";
import { searchKnowledge } from "../src/api/search-api.js";
import { apiDatasetFixture } from "../src/fixtures/api.fixture.js";

describe("Search API", () => {
  it("searches across published objects by keyword", () => {
    const res = searchKnowledge(apiDatasetFixture, {
      query: "détartrage",
      visibility: "public",
    });
    expect(res.status).toBe("ok");
    expect(res.data?.length).toBeGreaterThan(0);
    expect(res.data?.[0].title).toContain("détartrage");
  });

  it("does not return draft objects to public callers", () => {
    const res = searchKnowledge(apiDatasetFixture, {
      query: "confidentielle",
      visibility: "public",
    });
    expect(res.status).toBe("ok");
    expect(res.data?.length).toBe(0);
  });

  it("returns internal objects to internal callers", () => {
    const res = searchKnowledge(apiDatasetFixture, {
      query: "confidentiel",
      visibility: "internal",
    });
    expect(res.status).toBe("ok");
    expect(res.data?.length).toBeGreaterThan(0);
  });

  it("filters search results by language", () => {
    const res = searchKnowledge(apiDatasetFixture, {
      query: "dents",
      language: "fr",
      visibility: "public",
    });
    expect(res.status).toBe("ok");
    expect(res.data?.every((d) => d.language === "fr")).toBe(true);
  });

  it("supports limit pagination on search results", () => {
    const res = searchKnowledge(apiDatasetFixture, {
      query: "dents",
      limit: 1,
      visibility: "public",
    });
    expect(res.status).toBe("ok");
    expect(res.data?.length).toBeLessThanOrEqual(1);
  });
});
