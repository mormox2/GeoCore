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

  describe("public visibility filtering", () => {
    const now = "2026-01-01T00:00:00Z";
    const baseObject = {
      slug: "x",
      summary: "s",
      body: "b",
      language: "fr",
      version: "1",
      createdAt: now,
      updatedAt: now,
      author: "a",
    };
    const dataset = {
      ...apiDatasetFixture,
      objects: [
        { ...baseObject, id: "ko_pub", title: "Public", status: "published" as const },
        { ...baseObject, id: "ko_secret", title: "Secret", status: "draft" as const },
      ],
      entities: [
        { id: "ent_pub", type: "concept", canonicalName: "Pub", definition: "d", language: "fr", status: "published", createdAt: now, updatedAt: now },
        { id: "ent_draft", type: "concept", canonicalName: "Draft", definition: "d", language: "fr", status: "draft", createdAt: now, updatedAt: now },
      ] as typeof apiDatasetFixture.entities,
      relationships: [
        { id: "r1", sourceId: "ko_pub", targetId: "ent_pub", type: "mentions" as const, strength: "weak" as const, createdAt: now, updatedAt: now },
        { id: "r2", sourceId: "ko_pub", targetId: "ent_draft", type: "mentions" as const, strength: "weak" as const, createdAt: now, updatedAt: now },
        { id: "r3", sourceId: "ko_secret", targetId: "ko_pub", type: "related_to" as const, strength: "weak" as const, createdAt: now, updatedAt: now },
      ],
      sources: [
        { id: "src_public", type: "website", title: "Public Source", status: "active", visibility: "public", createdAt: now, updatedAt: now },
        { id: "src_private", type: "internal", title: "Confidential Memo", status: "active", visibility: "private", createdAt: now, updatedAt: now },
      ] as typeof apiDatasetFixture.sources,
      citations: [
        { id: "c_pub", sourceId: "src_public", targetId: "ko_pub", purpose: "supports", status: "active", createdAt: now, updatedAt: now },
        { id: "c_priv", sourceId: "src_private", targetId: "ko_pub", purpose: "supports", status: "active", createdAt: now, updatedAt: now },
      ] as typeof apiDatasetFixture.citations,
    };

    it("never exposes private sources, draft entities or unpublished objects to public callers", () => {
      const ctx = getAiContext(dataset, { objectId: "ko_pub", visibility: "public" }).data!;
      expect(ctx.sources.map((s) => s.id)).toEqual(["src_public"]);
      expect(ctx.citations.map((c) => c.id)).toEqual(["c_pub"]);
      expect(ctx.entities.map((e) => e.id)).toEqual(["ent_pub"]);
      expect(ctx.relatedObjectIds).toEqual(["ent_pub"]);
      expect(ctx.relationships.map((r) => r.id)).toEqual(["r1"]);
    });

    it("keeps internal nodes for internal callers but still hides private sources", () => {
      const ctx = getAiContext(dataset, { objectId: "ko_pub", visibility: "internal" }).data!;
      expect(ctx.sources.map((s) => s.id)).toEqual(["src_public"]);
      expect(ctx.entities.map((e) => e.id).sort()).toEqual(["ent_draft", "ent_pub"]);
      expect(ctx.relatedObjectIds.sort()).toEqual(["ent_draft", "ent_pub", "ko_secret"]);
    });
  });
});
