import { describe, it, expect } from "vitest";
import {
  createKnowledgeDatasetId,
  createLoaderDiagnostic,
  isRecord,
  asString,
  asStringArray,
  normalizeLoadedStatus,
  createIsoTimestamp,
} from "../src/loader/loader-utils.js";
import {
  getAllDatasetIds,
  findKnowledgeObjectById,
  findEntityById,
  findCollectionById,
  mergeKnowledgeDatasets,
} from "../src/loader/dataset-utils.js";
import { detectDatasetDuplicates } from "../src/loader/knowledge-loader.js";
import type { KnowledgeDataset } from "../src/types/knowledge-dataset.js";

describe("Loader Utils Tests", () => {
  describe("loader-utils.ts", () => {
    it("createKnowledgeDatasetId returns deterministic id", () => {
      expect(createKnowledgeDatasetId("My Test Name")).toBe("dataset_my-test-name");
    });

    it("createLoaderDiagnostic returns diagnostic with deterministic id", () => {
      const diag = createLoaderDiagnostic({
        severity: "error",
        code: "TEST_CODE",
        message: "This is a test message.",
        inputId: "my_input",
        field: "my_field",
      });
      expect(diag.id).toContain("thisisatestmess");
      expect(diag.inputId).toBe("my_input");
    });

    it("isRecord validates objects", () => {
      expect(isRecord({})).toBe(true);
      expect(isRecord(null)).toBe(false);
      expect(isRecord([])).toBe(false);
      expect(isRecord("str")).toBe(false);
    });

    it("asString converts to string or undefined", () => {
      expect(asString("hello")).toBe("hello");
      expect(asString(123)).toBe("123");
      expect(asString(null)).toBeUndefined();
    });

    it("asStringArray parses comma-separated lists and arrays", () => {
      expect(asStringArray("one, two, three")).toEqual(["one", "two", "three"]);
      expect(asStringArray(["one", "two"])).toEqual(["one", "two"]);
      expect(asStringArray(null)).toEqual([]);
    });

    it("normalizeLoadedStatus normalizes status with default", () => {
      expect(normalizeLoadedStatus("PUBLISHED")).toBe("published");
      expect(normalizeLoadedStatus()).toBe("draft");
    });

    it("createIsoTimestamp returns ISO string", () => {
      expect(typeof createIsoTimestamp()).toBe("string");
    });
  });

  describe("dataset-utils.ts", () => {
    const dataset: KnowledgeDataset = {
      id: "ds_id",
      name: "ds_name",
      objects: [{ id: "ko_1", slug: "s", title: "t", summary: "s", body: "b", language: "en", status: "draft", version: "1.0.0", author: "a", createdAt: "now", updatedAt: "now" }],
      entities: [{ id: "ent_1", type: "concept", canonicalName: "c", definition: "d", language: "en", status: "draft", createdAt: "now", updatedAt: "now" }],
      relationships: [{ id: "rel_1", sourceId: "ko_1", targetId: "ent_1", type: "explains", strength: "medium", createdAt: "now", updatedAt: "now" }],
      collections: [{ id: "col_1", slug: "s", title: "t", summary: "s", type: "guide", language: "en", status: "draft", version: "1.0.0", items: [], createdAt: "now", updatedAt: "now" }],
      taxonomyTerms: [],
      glossaryEntries: [],
      sources: [],
      citations: [],
      media: [],
      loadedAt: "now",
      diagnostics: [],
    };

    it("getAllDatasetIds returns all IDs", () => {
      const ids = getAllDatasetIds(dataset);
      expect(ids).toContain("ko_1");
      expect(ids).toContain("ent_1");
      expect(ids).toContain("col_1");
      expect(ids).toContain("rel_1");
    });

    it("finds components by id", () => {
      expect(findKnowledgeObjectById(dataset, "ko_1")).toBeDefined();
      expect(findEntityById(dataset, "ent_1")).toBeDefined();
      expect(findCollectionById(dataset, "col_1")).toBeDefined();
    });

    it("mergeKnowledgeDatasets concatenates without mutating", () => {
      const left = { ...dataset, objects: [dataset.objects[0]] };
      const right = { ...dataset, objects: [{ ...dataset.objects[0], id: "ko_2" }] };
      const merged = mergeKnowledgeDatasets(left, right);
      expect(merged.objects).toHaveLength(2);
      expect(left.objects).toHaveLength(1);
      expect(right.objects).toHaveLength(1);
    });
  });

  describe("duplicates and collisions", () => {
    it("detects duplicates within the same category", () => {
      const dataset: KnowledgeDataset = {
        id: "ds_id",
        name: "ds_name",
        objects: [
          { id: "ko_1", slug: "s", title: "t", summary: "s", body: "b", language: "en", status: "draft", version: "1.0.0", author: "a", createdAt: "now", updatedAt: "now" },
          { id: "ko_1", slug: "s2", title: "t2", summary: "s2", body: "b2", language: "en", status: "draft", version: "1.0.0", author: "a", createdAt: "now", updatedAt: "now" },
        ],
        entities: [],
        relationships: [],
        collections: [],
        taxonomyTerms: [],
        glossaryEntries: [],
        sources: [],
        citations: [],
        media: [],
        loadedAt: "now",
        diagnostics: [],
      };
      const diags = detectDatasetDuplicates(dataset);
      expect(diags.some((d) => d.code === "GC_LOADER_DUPLICATE_ID" && d.severity === "error")).toBe(true);
    });

    it("detects cross-category collisions as warnings", () => {
      const dataset: KnowledgeDataset = {
        id: "ds_id",
        name: "ds_name",
        objects: [
          { id: "collision_id", slug: "s", title: "t", summary: "s", body: "b", language: "en", status: "draft", version: "1.0.0", author: "a", createdAt: "now", updatedAt: "now" },
        ],
        entities: [
          { id: "collision_id", type: "concept", canonicalName: "c", definition: "d", language: "en", status: "draft", createdAt: "now", updatedAt: "now" },
        ],
        relationships: [],
        collections: [],
        taxonomyTerms: [],
        glossaryEntries: [],
        sources: [],
        citations: [],
        media: [],
        loadedAt: "now",
        diagnostics: [],
      };
      const diags = detectDatasetDuplicates(dataset);
      expect(diags.some((d) => d.code === "GC_LOADER_CROSS_TYPE_ID_COLLISION" && d.severity === "warning")).toBe(true);
    });

    it("duplicate detection does not mutate dataset", () => {
      const dataset: KnowledgeDataset = {
        id: "ds_id",
        name: "ds_name",
        objects: [{ id: "ko_1", slug: "s", title: "t", summary: "s", body: "b", language: "en", status: "draft", version: "1.0.0", author: "a", createdAt: "now", updatedAt: "now" }],
        entities: [],
        relationships: [],
        collections: [],
        taxonomyTerms: [],
        glossaryEntries: [],
        sources: [],
        citations: [],
        media: [],
        loadedAt: "now",
        diagnostics: [],
      };
      const snapshot = JSON.stringify(dataset);
      detectDatasetDuplicates(dataset);
      expect(JSON.stringify(dataset)).toBe(snapshot);
    });
  });
});
