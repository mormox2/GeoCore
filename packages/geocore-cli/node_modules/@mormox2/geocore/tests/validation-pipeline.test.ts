import { describe, it, expect } from "vitest";
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

describe("Validation Pipeline Tests", () => {
  it("runs all enabled stages in correct order", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
    });

    const expectedOrder = [
      "dataset",
      "knowledge-objects",
      "relationships",
      "metadata",
      "routes",
      "search",
      "schema",
      "llms",
      "sitemap",
      "static-export",
    ];

    const actualOrder = report.stages.map((s) => s.id);
    expect(actualOrder).toEqual(expectedOrder);
  });

  it("aggregates issues from all stages", () => {
    // If we have an invalid object inside, it produces issues in knowledge-objects stage
    const invalidDataset: KnowledgeDataset = {
      ...mockDataset,
      objects: [
        {
          ...mockDataset.objects[0],
          id: "", // missing ID produces critical object validation error
        },
      ],
    };

    const report = runValidationPipeline({
      dataset: invalidDataset,
    });

    expect(report.issues.length).toBeGreaterThan(0);
    expect(report.valid).toBe(false);
  });

  it("computes severity summary", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
    });

    // Should run and pass
    expect(report.summary.stagesTotal).toBe(10);
    expect(report.summary.stagesFailed).toBe(0);
    expect(report.summary.stagesSkipped).toBe(0);
    expect(report.summary.stagesPassed + report.summary.stagesWarning).toBe(10);
  });

  it("computes valid correctly", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
    });
    expect(report.valid).toBe(true);
  });

  it("computes publishable correctly", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
    });
    expect(report.publishable).toBe(true);
  });

  it("does not throw on invalid dataset", () => {
    const emptyDataset: KnowledgeDataset = {
      id: "",
      name: "",
      objects: [],
      entities: [],
      relationships: [],
      collections: [],
      taxonomyTerms: [],
      glossaryEntries: [],
      sources: [],
      citations: [],
      media: [],
      loadedAt: "",
      diagnostics: [],
    };

    expect(() => {
      runValidationPipeline({
        dataset: emptyDataset,
      });
    }).not.toThrow();
  });

  it("failFast behavior works", () => {
    const invalidDataset: KnowledgeDataset = {
      ...mockDataset,
      id: "", // fails dataset validation stage
    };

    const report = runValidationPipeline({
      dataset: invalidDataset,
      config: {
        failFast: true,
      },
    });

    expect(report.stages[0].status).toBe("failed");
    expect(report.stages[1].status).toBe("skipped");
  });

  it("disabled stage is skipped", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
      config: {
        stages: {
          sitemap: false,
        },
      },
    });

    const sitemapStage = report.stages.find((s) => s.id === "sitemap");
    expect(sitemapStage?.status).toBe("skipped");
  });

  it("required disabled stage produces error", () => {
    const report = runValidationPipeline({
      dataset: mockDataset,
      config: {
        stages: {
          dataset: false,
        },
      },
    });

    const datasetStage = report.stages.find((s) => s.id === "dataset");
    expect(datasetStage?.status).toBe("failed");
    expect(datasetStage?.issues.some((i) => i.code === "GC_PIPELINE_STAGE_REQUIRED_SKIPPED")).toBe(true);
  });
});
