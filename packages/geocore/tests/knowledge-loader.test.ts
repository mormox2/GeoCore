import { describe, it, expect } from "vitest";
import { loadKnowledgeDataset } from "../src/loader/knowledge-loader.js";

describe("Knowledge Loader Orchestrator Tests", () => {
  it("loads mixed inputs and returns a complete dataset without throwing", () => {
    const input = {
      id: "load_orchestration",
      name: "Mixed Dataset",
      inputs: [
        {
          type: "knowledge-object" as const,
          content: {
            id: "ko_obj",
            slug: "obj-slug",
            title: "Obj",
            summary: "Sum",
            body: "Body",
            language: "en",
            author: "author_test",
            status: "draft",
          },
        },
        {
          type: "markdown" as const,
          content: `---
id: ko_md
slug: md-slug
title: MD Title
summary: MD Sum
language: en
status: draft
author: author_test
---
MD Body`,
        },
        {
          type: "entity" as const,
          content: {
            id: "entity_test",
            type: "concept",
            canonicalName: "Concept Name",
            definition: "A test concept.",
            language: "en",
            status: "draft",
          },
        },
        {
          type: "collection" as const,
          content: {
            id: "collection_test",
            slug: "col-slug",
            title: "Col Title",
            summary: "Col Sum",
            type: "guide",
            language: "en",
            status: "draft",
            version: "1.0.0",
            items: [{ objectId: "ko_obj", order: 1 }],
          },
        },
        {
          type: "taxonomy-term" as const,
          content: {
            id: "taxonomy_test",
            type: "category",
            slug: "tax-slug",
            label: "Tax Label",
            description: "Tax Desc",
            status: "draft",
          },
        },
        {
          type: "glossary-entry" as const,
          content: {
            id: "glossary_test",
            term: "Term",
            slug: "term-slug",
            definition: "Def",
            language: "en",
            status: "draft",
            audience: "developer",
          },
        },
        {
          type: "source" as const,
          content: {
            id: "source_test",
            type: "book",
            title: "Book Title",
            status: "active",
          },
        },
        {
          type: "citation" as const,
          content: {
            id: "citation_test",
            sourceId: "source_test",
            targetId: "ko_obj",
            purpose: "supports",
            status: "active",
          },
        },
        {
          type: "media" as const,
          content: {
            id: "media_test",
            type: "image",
            title: "Image Title",
            status: "active",
            source: "image.png",
            visibility: "public",
          },
        },
        {
          type: "invalid-type" as any,
          content: {},
        },
      ],
    };

    const dataset = loadKnowledgeDataset(input);

    expect(dataset).toBeDefined();
    expect(dataset.id).toBe("dataset_mixed-dataset");
    expect(dataset.name).toBe("Mixed Dataset");
    expect(dataset.objects).toHaveLength(2);
    expect(dataset.entities).toHaveLength(1);
    expect(dataset.collections).toHaveLength(1);
    expect(dataset.taxonomyTerms).toHaveLength(1);
    expect(dataset.glossaryEntries).toHaveLength(1);
    expect(dataset.sources).toHaveLength(1);
    expect(dataset.citations).toHaveLength(1);
    expect(dataset.media).toHaveLength(1);

    // Diagnostics should contain the invalid type error
    expect(dataset.diagnostics.some((d) => d.code === "GC_LOADER_INPUT_TYPE_INVALID")).toBe(true);
  });
});
