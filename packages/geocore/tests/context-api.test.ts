import { describe, it, expect } from "vitest";
import { getAiContext } from "../src/api/context-api.js";
import { apiDatasetFixture } from "../src/fixtures/api.fixture.js";

describe("AI Context API", () => {
  it("builds a rich AI context package for a public object", () => {
    const res = getAiContext(apiDatasetFixture, {
      objectId: "ko_detartrage_abime_dents",
      visibility: "public",
    });

    expect(res.status).toBe("ok");
    expect(res.data).toBeDefined();

    const ctx = res.data!;
    expect(ctx.object.id).toBe("ko_detartrage_abime_dents");
    expect(ctx.metadata).toBeDefined();
    expect(ctx.relationships.length).toBeGreaterThan(0);
    expect(ctx.citations.length).toBeGreaterThan(0);
    expect(ctx.sources.length).toBeGreaterThan(0);
    expect(ctx.generatedAt).toBeTruthy();
  });

  it("returns 404 for unknown objectId", () => {
    const res = getAiContext(apiDatasetFixture, {
      objectId: "ko_nonexistent",
    });
    expect(res.status).toBe("not-found");
  });

  it("returns forbidden when public request accesses internal draft object", () => {
    const res = getAiContext(apiDatasetFixture, {
      objectId: "ko_draft_internal_note",
      visibility: "public",
    });
    expect(res.status).toBe("forbidden");
  });

  it("returns context package for internal caller requesting draft object", () => {
    const res = getAiContext(apiDatasetFixture, {
      objectId: "ko_draft_internal_note",
      visibility: "internal",
    });
    expect(res.status).toBe("ok");
    expect(res.data?.object.id).toBe("ko_draft_internal_note");
  });
});
