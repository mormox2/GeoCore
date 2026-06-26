import { describe, it, expect } from "vitest";
import { DEFAULT_VALIDATION_PIPELINE_CONFIG } from "../src/pipeline/pipeline-config.js";
import { runValidationPipeline } from "../src/pipeline/validation-pipeline.js";
import { KnowledgeDataset } from "../src/types/knowledge-dataset.js";

const mockDataset: KnowledgeDataset = {
  id: "test-ds",
  name: "Test Dataset",
  objects: [
    {
      id: "ko_test",
      slug: "test-slug",
      title: "Test Title",
      summary: "Test Summary",
      body: "Test Body",
      language: "en",
      status: "published",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "test-author",
    },
  ],
  entities: [],
  relationships: [],
  collections: [],
  taxonomyTerms: [],
  glossaryEntries: [],
  sources: [],
  citations: [],
  media: [],
  loadedAt: "2026-06-25T10:00:00Z",
  diagnostics: [],
};

describe("Validation Pipeline Config Tests", () => {
  it("default config uses public mode", () => {
    expect(DEFAULT_VALIDATION_PIPELINE_CONFIG.mode).toBe("public");
  });

  it("default config enables all stages", () => {
    const stages = DEFAULT_VALIDATION_PIPELINE_CONFIG.stages;
    expect(stages["dataset"]).toBe(true);
    expect(stages["knowledge-objects"]).toBe(true);
    expect(stages["relationships"]).toBe(true);
    expect(stages["metadata"]).toBe(true);
    expect(stages["routes"]).toBe(true);
    expect(stages["search"]).toBe(true);
    expect(stages["schema"]).toBe(true);
    expect(stages["llms"]).toBe(true);
    expect(stages["sitemap"]).toBe(true);
    expect(stages["static-export"]).toBe(true);
  });

  it("config can disable optional stages", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
      config: {
        stages: {
          sitemap: false,
          "static-export": false,
        },
      },
    });

    const sitemapStage = report.stages.find((s) => s.id === "sitemap");
    const exportStage = report.stages.find((s) => s.id === "static-export");

    expect(sitemapStage?.status).toBe("skipped");
    expect(exportStage?.status).toBe("skipped");
  });

  it("required stage skipped produces error", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
      config: {
        stages: {
          metadata: false,
        },
      },
    });

    const metadataStage = report.stages.find((s) => s.id === "metadata");
    expect(metadataStage?.status).toBe("failed");
    expect(metadataStage?.valid).toBe(false);
    expect(metadataStage?.issues.some((i) => i.code === "GC_PIPELINE_STAGE_REQUIRED_SKIPPED")).toBe(true);
    expect(report.valid).toBe(false);
  });

  it("failFast stops after first failed stage", () => {
    // If we make dataset invalid (e.g. empty ID)
    const invalidDataset: KnowledgeDataset = {
      ...mockDataset,
      id: "",
    };

    const report = runValidationPipeline({
      dataset: invalidDataset,
      config: {
        failFast: true,
      },
    });

    const datasetStage = report.stages.find((s) => s.id === "dataset");
    const objectsStage = report.stages.find((s) => s.id === "knowledge-objects");

    expect(datasetStage?.status).toBe("failed");
    expect(objectsStage?.status).toBe("skipped");
  });

  it("language option is preserved", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
      config: {
        language: "fr",
      },
    });

    expect(report.id).toContain("-fr");
  });
});
