import { describe, it, expect } from "vitest";
import type { KnowledgeObject } from "../src/types/knowledge-object.js";
import { apiDatasetFixture } from "../src/fixtures/api.fixture.js";
import { isPublicKnowledgeObject, isNeverExposedObject } from "../src/metadata/object-visibility.js";
import { getKnowledgeObject, listKnowledgeObjects } from "../src/api/knowledge-api.js";
import { searchKnowledge } from "../src/api/search-api.js";
import { getAiContext } from "../src/api/context-api.js";
import { filterRouteObjects } from "../src/routing/route-filter.js";
import { filterStaticExportObjects } from "../src/export/static-exporter.js";
import { isLlmsPublicObject } from "../src/llms/llms-utils.js";
import { isSitemapPublicObject } from "../src/sitemap/sitemap-utils.js";
import { loadKnowledgeDataset } from "../src/loader/knowledge-loader.js";

const base = {
  slug: "s",
  summary: "Résumé confidentiel",
  body: "Texte confidentiel sur le protocole interne.",
  language: "fr",
  status: "published" as const,
  version: "1",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  author: "a",
};
const publicObj: KnowledgeObject = { ...base, id: "ko_public", slug: "public", title: "Protocole public" };
const internalObj: KnowledgeObject = { ...base, id: "ko_internal", slug: "internal", title: "Protocole interne", visibility: "internal" };
const legacyInternal: KnowledgeObject = {
  ...base,
  id: "ko_legacy",
  slug: "legacy",
  title: "Protocole legacy",
  metadata: { visibility: "internal" } as never,
};
const privateObj: KnowledgeObject = { ...base, id: "ko_private", slug: "private", title: "Protocole privé", visibility: "private" };
const dataset = { ...apiDatasetFixture, objects: [publicObj, internalObj, legacyInternal, privateObj] };

describe("Knowledge Object visibility", () => {
  it("treats published objects as public unless they declare otherwise", () => {
    expect(isPublicKnowledgeObject(publicObj)).toBe(true);
    expect(isPublicKnowledgeObject(internalObj)).toBe(false);
    expect(isPublicKnowledgeObject(legacyInternal)).toBe(false);
    expect(isPublicKnowledgeObject({ ...publicObj, status: "draft" })).toBe(false);
    expect(isNeverExposedObject(privateObj)).toBe(true);
  });

  it("applies the same rule in every public channel", () => {
    expect(listKnowledgeObjects(dataset).data?.map((o) => o.id)).toEqual(["ko_public"]);
    expect(getKnowledgeObject(dataset, { id: "ko_internal" }).status).toBe("forbidden");
    expect(searchKnowledge(dataset, { query: "protocole" }).data?.map((d) => d.sourceId)).toEqual(["ko_public"]);
    expect(getAiContext(dataset, { objectId: "ko_internal" }).status).toBe("forbidden");
    expect(filterRouteObjects({ id: "r", objects: dataset.objects }).map((o) => o.id)).toEqual(["ko_public"]);
    expect(filterStaticExportObjects({ objects: dataset.objects }).map((o) => o.id)).toEqual(["ko_public"]);
    expect(dataset.objects.filter(isLlmsPublicObject).map((o) => o.id)).toEqual(["ko_public"]);
    expect(dataset.objects.filter(isSitemapPublicObject).map((o) => o.id)).toEqual(["ko_public"]);
  });

  it("lets internal callers see internal objects but never private ones", () => {
    const ids = listKnowledgeObjects(dataset, { visibility: "internal" }).data?.map((o) => o.id);
    expect(ids).toEqual(["ko_public", "ko_internal", "ko_legacy"]);
    expect(getKnowledgeObject(dataset, { id: "ko_private", visibility: "internal" }).status).toBe("not-found");
    expect(getAiContext(dataset, { objectId: "ko_private", visibility: "internal" }).status).toBe("not-found");
  });

  it("honours visibility declared in Markdown frontmatter", () => {
    const loaded = loadKnowledgeDataset({
      id: "d",
      name: "d",
      inputs: [
        {
          type: "markdown",
          path: "internal.md",
          content:
            "---\nid: ko_fm\nslug: fm\ntitle: Note interne\nsummary: s\nlanguage: fr\nstatus: published\nversion: 1\nauthor: x\ncreatedAt: 2026-01-01T00:00:00Z\nupdatedAt: 2026-01-01T00:00:00Z\nvisibility: internal\n---\nCorps de la note.",
        },
      ],
    } as never);
    expect(loaded.objects[0].visibility).toBe("internal");
    expect(listKnowledgeObjects(loaded).data).toEqual([]);
  });
});
