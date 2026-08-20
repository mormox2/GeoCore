import { describe, it, expect } from "vitest";
import { getEntity, listEntities } from "../src/api/entity-api.js";
import { apiDatasetFixture } from "../src/fixtures/api.fixture.js";

describe("Entity API", () => {
  describe("getEntity", () => {
    it("returns published entity for public caller", () => {
      const res = getEntity(apiDatasetFixture, {
        id: "entity_scaling",
        visibility: "public",
      });
      expect(res.status).toBe("ok");
      expect(res.data?.canonicalName).toBe("Détartrage");
    });

    it("returns 404 for non-existent entity", () => {
      const res = getEntity(apiDatasetFixture, {
        id: "entity_missing",
      });
      expect(res.status).toBe("not-found");
    });

    it("returns forbidden for public request to draft entity", () => {
      const res = getEntity(apiDatasetFixture, {
        id: "entity_draft",
        visibility: "public",
      });
      expect(res.status).toBe("forbidden");
    });

    it("returns draft entity for internal caller", () => {
      const res = getEntity(apiDatasetFixture, {
        id: "entity_draft",
        visibility: "internal",
      });
      expect(res.status).toBe("ok");
      expect(res.data?.id).toBe("entity_draft");
    });
  });

  describe("listEntities", () => {
    it("returns published entities only for public caller", () => {
      const res = listEntities(apiDatasetFixture, { visibility: "public" });
      expect(res.status).toBe("ok");
      expect(res.data?.length).toBe(2);
      expect(res.data?.every((e) => e.status === "published")).toBe(true);
    });

    it("returns all entities for internal caller", () => {
      const res = listEntities(apiDatasetFixture, { visibility: "internal" });
      expect(res.data?.length).toBe(3);
    });

    it("supports pagination", () => {
      const res = listEntities(apiDatasetFixture, {
        visibility: "public",
        limit: 1,
      });
      expect(res.data?.length).toBe(1);
      expect(res.meta.total).toBe(2);
    });
  });
});
