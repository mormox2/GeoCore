import { describe, it, expect } from "vitest";
import { getKnowledgeObject, listKnowledgeObjects } from "../src/api/knowledge-api.js";
import { apiDatasetFixture } from "../src/fixtures/api.fixture.js";

describe("Knowledge Object API", () => {
  describe("getKnowledgeObject", () => {
    it("returns public published object by ID", () => {
      const res = getKnowledgeObject(apiDatasetFixture, {
        id: "ko_detartrage_abime_dents",
        visibility: "public",
      });
      expect(res.status).toBe("ok");
      expect(res.data?.id).toBe("ko_detartrage_abime_dents");
      expect(res.meta.visibility).toBe("public");
    });

    it("returns 404 not-found for unknown ID", () => {
      const res = getKnowledgeObject(apiDatasetFixture, {
        id: "ko_unknown_id",
      });
      expect(res.status).toBe("not-found");
      expect(res.error).toContain("ko_unknown_id");
    });

    it("returns forbidden when public request accesses internal draft object", () => {
      const res = getKnowledgeObject(apiDatasetFixture, {
        id: "ko_draft_internal_note",
        visibility: "public",
      });
      expect(res.status).toBe("forbidden");
      expect(res.data).toBeUndefined();
    });

    it("returns internal draft object when requested with internal visibility", () => {
      const res = getKnowledgeObject(apiDatasetFixture, {
        id: "ko_draft_internal_note",
        visibility: "internal",
      });
      expect(res.status).toBe("ok");
      expect(res.data?.id).toBe("ko_draft_internal_note");
    });
  });

  describe("listKnowledgeObjects", () => {
    it("returns only public published objects for public caller", () => {
      const res = listKnowledgeObjects(apiDatasetFixture, { visibility: "public" });
      expect(res.status).toBe("ok");
      expect(res.data?.length).toBe(2);
      expect(res.data?.every((o) => o.status === "published")).toBe(true);
    });

    it("returns all objects for internal caller", () => {
      const res = listKnowledgeObjects(apiDatasetFixture, { visibility: "internal" });
      expect(res.status).toBe("ok");
      expect(res.data?.length).toBe(4);
    });

    it("filters objects by language", () => {
      const res = listKnowledgeObjects(apiDatasetFixture, {
        language: "fr",
        visibility: "public",
      });
      expect(res.status).toBe("ok");
      expect(res.data?.every((o) => o.language === "fr")).toBe(true);
    });

    it("supports pagination limit and offset", () => {
      const res = listKnowledgeObjects(apiDatasetFixture, {
        visibility: "public",
        limit: 1,
        offset: 0,
      });
      expect(res.data?.length).toBe(1);
      expect(res.meta.total).toBe(2);
    });
  });
});
