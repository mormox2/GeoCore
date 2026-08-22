import { describe, it, expect } from "vitest";
import { MemoryKnowledgeRepository } from "../src/adapters/memory-repository.js";
import { syncDatasetToRepository } from "../src/sync/dataset-sync.js";
import { GEOCORE_SQL_SCHEMA } from "../src/adapters/sqlite-repository.js";
import { apiDatasetFixture, rtimidentalFixture } from "@mormox2/geocore";

describe("GeoCore Persistence & Repository Layer", () => {
  describe("MemoryKnowledgeRepository", () => {
    it("imports a complete dataset into memory", async () => {
      const repo = new MemoryKnowledgeRepository(apiDatasetFixture);
      const objects = await repo.listObjects();
      expect(objects.length).toBe(apiDatasetFixture.objects.length);

      const obj = await repo.getObject("ko_detartrage_abime_dents");
      expect(obj).not.toBeNull();
      expect(obj?.title).toBe("Le détartrage abîme-t-il les dents ?");
    });

    it("performs CRUD operations on Knowledge Objects", async () => {
      const repo = new MemoryKnowledgeRepository();
      expect(await repo.getObject("ko_test")).toBeNull();

      // Create
      await repo.saveObject(rtimidentalFixture);
      expect(await repo.getObject("ko_detartrage_abime_dents")).not.toBeNull();

      // Update
      const updated = { ...rtimidentalFixture, title: "Nouveau titre" };
      await repo.saveObject(updated);
      const retrieved = await repo.getObject("ko_detartrage_abime_dents");
      expect(retrieved?.title).toBe("Nouveau titre");

      // Delete
      const deleted = await repo.deleteObject("ko_detartrage_abime_dents");
      expect(deleted).toBe(true);
      expect(await repo.getObject("ko_detartrage_abime_dents")).toBeNull();
    });

    it("performs CRUD on Entities, Citations, Sources and Media", async () => {
      const repo = new MemoryKnowledgeRepository(apiDatasetFixture);

      // Entities
      const entities = await repo.listEntities();
      expect(entities.length).toBeGreaterThan(0);
      const entity = await repo.getEntity("entity_scaling");
      expect(entity?.canonicalName).toBe("Détartrage");

      // Citations
      const citations = await repo.listCitations();
      expect(citations.length).toBeGreaterThan(0);

      // Sources
      const sources = await repo.listSources();
      expect(sources.length).toBeGreaterThan(0);

      // Media
      const media = await repo.listMedia();
      expect(media.length).toBeGreaterThan(0);
    });

    it("exports repository state back to a KnowledgeDataset", async () => {
      const repo = new MemoryKnowledgeRepository(apiDatasetFixture);
      const exported = await repo.exportDataset("exported_1", "Export Test");

      expect(exported.id).toBe("exported_1");
      expect(exported.name).toBe("Export Test");
      expect(exported.objects.length).toBe(apiDatasetFixture.objects.length);
      expect(exported.entities.length).toBe(apiDatasetFixture.entities.length);
    });
  });

  describe("Dataset Synchronization", () => {
    it("synchronizes updates and new objects into repository", async () => {
      const repo = new MemoryKnowledgeRepository();
      const sync1 = await syncDatasetToRepository(apiDatasetFixture, repo);

      expect(sync1.objectsAdded).toBe(apiDatasetFixture.objects.length);
      expect(sync1.objectsUpdated).toBe(0);

      // Subsequent sync with no changes
      const sync2 = await syncDatasetToRepository(apiDatasetFixture, repo);
      expect(sync2.objectsAdded).toBe(0);
      expect(sync2.objectsUpdated).toBe(0);

      // Modify one object
      const modifiedDataset = {
        ...apiDatasetFixture,
        objects: [
          {
            ...apiDatasetFixture.objects[0],
            version: "2.0.0",
            updatedAt: "2026-08-22T00:00:00Z",
          },
          ...apiDatasetFixture.objects.slice(1),
        ],
      };

      const sync3 = await syncDatasetToRepository(modifiedDataset, repo);
      expect(sync3.objectsUpdated).toBe(1);
    });
  });

  describe("SQL Schema", () => {
    it("defines valid relational tables for all GeoCore models", () => {
      expect(GEOCORE_SQL_SCHEMA).toContain("CREATE TABLE IF NOT EXISTS geocore_objects");
      expect(GEOCORE_SQL_SCHEMA).toContain("CREATE TABLE IF NOT EXISTS geocore_entities");
      expect(GEOCORE_SQL_SCHEMA).toContain("CREATE TABLE IF NOT EXISTS geocore_citations");
      expect(GEOCORE_SQL_SCHEMA).toContain("CREATE TABLE IF NOT EXISTS geocore_sources");
      expect(GEOCORE_SQL_SCHEMA).toContain("CREATE TABLE IF NOT EXISTS geocore_media");
      expect(GEOCORE_SQL_SCHEMA).toContain("CREATE TABLE IF NOT EXISTS geocore_relationships");
    });
  });
});
