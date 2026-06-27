import { describe, it, expect } from "vitest";
import { resolveMetadata } from "../src/metadata/resolve-metadata.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { GraphRegistry } from "../src/types/graph.js";
import { collectionsFixture, entitiesFixture, globalDefaultsFixture } from "../src/fixtures/metadata.fixture.js";

describe("Metadata Resolution Tests", () => {
  const baseObject: KnowledgeObject = {
    id: "ko_test_article",
    slug: "test-article",
    title: "Test Article",
    summary: "This is a test article.",
    body: "Content goes here...",
    language: "en",
    status: "draft",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test_user",
  };

  it("should resolve metadata from core fields and defaults", () => {
    const resolved = resolveMetadata({ object: baseObject });
    expect(resolved.id).toBe("ko_test_article");
    expect(resolved.title).toBe("Test Article");
    expect(resolved.language).toBe("en");
    expect(resolved.status).toBe("draft");
    expect(resolved.freshness).toBe("stable"); // system default fallback
    expect(resolved.resolvedFrom.object).toBe(true);
    expect(resolved.resolvedFrom.defaults).toBe(true);
  });

  it("should override defaults with explicit metadata", () => {
    const objectWithMeta: KnowledgeObject = {
      ...baseObject,
      metadata: {
        language: "fr", // overrides core 'en' and default 'fr'
        freshness: "live", // overrides default 'stable'
      },
    };

    const resolved = resolveMetadata({
      object: objectWithMeta,
      defaults: globalDefaultsFixture,
    });

    expect(resolved.language).toBe("fr");
    expect(resolved.freshness).toBe("live");
    expect(resolved.trustLevel).toBe("expert"); // filled by global defaults
  });

  it("should incorporate entity IDs from graph relationships", () => {
    const graph: GraphRegistry = {
      nodes: [
        { id: "ko_test_article", type: "knowledge-object" },
        { id: "entity_scaling", type: "entity" },
        { id: "entity_tartar", type: "entity" },
      ],
      relationships: [
        {
          id: "rel_1",
          sourceId: "ko_test_article",
          targetId: "entity_scaling",
          type: "explains",
          strength: "canonical",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
        {
          id: "rel_2",
          sourceId: "ko_test_article",
          targetId: "entity_tartar",
          type: "mentions",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const resolved = resolveMetadata({ object: baseObject, graph });
    expect(resolved.entities).toContain("entity_scaling");
    expect(resolved.entities).toContain("entity_tartar");
    expect(resolved.resolvedFrom.graph).toBe(true);
  });

  it("should deduplicate entity IDs", () => {
    const objectWithMeta: KnowledgeObject = {
      ...baseObject,
      metadata: {
        entities: ["entity_scaling"],
      },
    };

    const graph: GraphRegistry = {
      nodes: [
        { id: "ko_test_article", type: "knowledge-object" },
        { id: "entity_scaling", type: "entity" },
      ],
      relationships: [
        {
          id: "rel_1",
          sourceId: "ko_test_article",
          targetId: "entity_scaling",
          type: "explains",
          strength: "canonical",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const resolved = resolveMetadata({ object: objectWithMeta, graph });
    expect(resolved.entities).toEqual(["entity_scaling"]);
  });

  it("should fill missing domain/audience from collections and entities without overriding explicit metadata", () => {
    // baseObject has no domains/audiences
    const resolved = resolveMetadata({
      object: baseObject,
      collections: collectionsFixture, // "col_rtimi_dental_faq" contains item "ko_detartrage_abime_dents"
      entities: entitiesFixture,
    });

    // Since baseObject has ID 'ko_test_article', let's make sure it matches a collection
    const objectInCollection: KnowledgeObject = {
      ...baseObject,
      id: "ko_detartrage_abime_dents",
    };

    const resolvedInCol = resolveMetadata({
      object: objectInCollection,
      collections: collectionsFixture, // col_rtimi_dental_faq has domain ["dentistry"], audience ["patient"]
      entities: entitiesFixture,
    });

    expect(resolvedInCol.domains).toContain("dentistry");
    expect(resolvedInCol.audiences).toContain("patient");
    expect(resolvedInCol.owner).toBe("Dr Mossaab Rtimi"); // inherited from collection
    expect(resolvedInCol.resolvedFrom.collections).toBe(true);

    // Explicit overrides
    const objectExplicit: KnowledgeObject = {
      ...objectInCollection,
      metadata: {
        domains: ["custom-domain"],
        audiences: ["custom-audience"],
      },
    };

    const resolvedExplicit = resolveMetadata({
      object: objectExplicit,
      collections: collectionsFixture,
      entities: entitiesFixture,
    });

    expect(resolvedExplicit.domains).toEqual(["custom-domain"]);
    expect(resolvedExplicit.audiences).toEqual(["custom-audience"]);
  });
});
