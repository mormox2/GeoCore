import { describe, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import type { KnowledgeObject, KnowledgeRelationship } from "@mormo_mossaab/geocore";
import { SqlKnowledgeRepository, type SqlDatabaseDriver } from "../src/adapters/sqlite-repository.js";

// PGlite is PostgreSQL compiled to WebAssembly: a real Postgres engine without a server.
function createPostgresDriver(db: PGlite): SqlDatabaseDriver {
  return {
    async exec(sql) {
      await db.exec(sql);
    },
    async query<T>(sql: string, params: unknown[] = []) {
      return (await db.query<T>(sql, params)).rows;
    },
    async run(sql, params = []) {
      const res = await db.query(sql, params);
      return { changes: res.affectedRows ?? 0 };
    },
  };
}

const now = "2026-01-01T00:00:00Z";
const object: KnowledgeObject = {
  id: "ko_pg",
  slug: "pg",
  title: "Objet PostgreSQL",
  summary: "Résumé",
  body: "Corps",
  language: "fr",
  status: "published",
  version: "1.0.0",
  createdAt: now,
  updatedAt: now,
  author: "a",
  visibility: "internal",
  tags: ["t"],
  translations: { en: "ko_pg_en" },
};
const relationship: KnowledgeRelationship = {
  id: "rel_pg",
  sourceId: "ko_pg",
  targetId: "ko_other",
  type: "related_to",
  strength: "strong",
  confidence: "high",
  reason: "r",
  createdAt: now,
  updatedAt: now,
};

// Booting the WebAssembly Postgres engine takes a few seconds per instance.
describe("SqlKnowledgeRepository on PostgreSQL (PGlite)", { timeout: 30000 }, () => {
  it("initialises idempotently and round-trips records", async () => {
    const repo = new SqlKnowledgeRepository(createPostgresDriver(new PGlite()), { placeholders: "postgres" });
    await repo.init();
    await repo.init();

    await repo.saveObject(object);
    await repo.saveRelationship(relationship);
    expect(await repo.getObject("ko_pg")).toEqual(object);
    expect(await repo.getRelationships("ko_pg")).toEqual([relationship]);
    expect((await repo.listObjects({ status: "published", limit: 10, offset: 0 })).map((o) => o.id)).toEqual(["ko_pg"]);
  });

  it("updates existing rows on save (upsert) instead of failing on the primary key", async () => {
    const repo = new SqlKnowledgeRepository(createPostgresDriver(new PGlite()), { placeholders: "postgres" });
    await repo.init();
    await repo.saveObject(object);
    await repo.saveObject({ ...object, title: "Titre modifié", version: "1.0.1" });

    const all = await repo.listObjects();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe("Titre modifié");
    expect(await repo.deleteObject("ko_pg")).toBe(true);
    expect(await repo.getObject("ko_pg")).toBeNull();
  });

  it("imports and exports a whole dataset", async () => {
    const repo = new SqlKnowledgeRepository(createPostgresDriver(new PGlite()), { placeholders: "postgres" });
    await repo.init();
    await repo.importDataset({
      id: "d",
      name: "d",
      objects: [object],
      entities: [{ id: "ent", type: "concept", canonicalName: "E", definition: "d", language: "fr", status: "published", createdAt: now, updatedAt: now }],
      relationships: [relationship],
      collections: [],
      taxonomyTerms: [],
      glossaryEntries: [],
      sources: [{ id: "src", type: "website", title: "S", status: "active", createdAt: now, updatedAt: now }],
      citations: [{ id: "cit", sourceId: "src", targetId: "ko_pg", purpose: "supports", status: "active", createdAt: now, updatedAt: now }],
      media: [{ id: "m", type: "image", title: "M", source: "https://x/m.png", status: "active", visibility: "public", createdAt: now, updatedAt: now }],
      loadedAt: now,
      diagnostics: [],
    } as never);

    const exported = await repo.exportDataset("d");
    expect(exported.objects).toEqual([object]);
    expect(exported.entities.map((e) => e.id)).toEqual(["ent"]);
    expect(exported.sources.map((s) => s.id)).toEqual(["src"]);
    expect(exported.citations.map((c) => c.id)).toEqual(["cit"]);
    expect(exported.media.map((m) => m.id)).toEqual(["m"]);
  });
});
