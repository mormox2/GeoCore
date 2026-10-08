import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import type { KnowledgeObject, KnowledgeRelationship } from "@mormo_mossaab/geocore";
import { SqlKnowledgeRepository, type SqlDatabaseDriver } from "../src/adapters/sqlite-repository.js";

// node:sqlite ships with Node 22+; older runtimes skip this real-database suite.
type SqliteModule = typeof import("node:sqlite");
let sqlite: SqliteModule | undefined;
try {
  sqlite = createRequire(import.meta.url)("node:sqlite") as SqliteModule;
} catch {
  sqlite = undefined;
}

function createDriver(): SqlDatabaseDriver {
  const db = new sqlite!.DatabaseSync(":memory:");
  return {
    async exec(sql) {
      db.exec(sql);
    },
    async query<T>(sql: string, params: unknown[] = []) {
      return db.prepare(sql).all(...(params as never[])) as T[];
    },
    async run(sql, params = []) {
      const res = db.prepare(sql).run(...(params as never[]));
      return { changes: Number(res.changes) };
    },
  };
}

const object: KnowledgeObject = {
  id: "ko_full",
  slug: "full",
  title: "Objet complet",
  summary: "Résumé",
  body: "Corps",
  language: "fr",
  status: "published",
  version: "1.0.0",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
  author: "author_dr_mossaab_rtimi",
  visibility: "internal",
  metadata: { canonicalUrl: "https://example.com/full" },
  aliases: ["alias"],
  tags: ["tag"],
  categories: ["cat"],
  media: ["media_1"],
  citations: ["cit_1"],
  attachments: ["file.pdf"],
  glossaryReferences: ["gl_1"],
  externalResources: ["https://example.com/ref"],
  translations: { en: "ko_full_en" },
  relatedObjects: ["ko_other"],
};

const relationship: KnowledgeRelationship = {
  id: "rel_1",
  sourceId: "ko_full",
  targetId: "ko_other",
  type: "related_to",
  strength: "strong",
  confidence: "high",
  reason: "Same clinical topic",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe.skipIf(!sqlite)("SqlKnowledgeRepository on a real SQLite database", () => {
  it("round-trips every Knowledge Object and relationship field", async () => {
    const repo = new SqlKnowledgeRepository(createDriver());
    await repo.init();
    await repo.saveObject(object);
    await repo.saveRelationship(relationship);

    expect(await repo.getObject("ko_full")).toEqual(object);
    expect(await repo.listObjects()).toEqual([object]);
    expect(await repo.getRelationships("ko_full")).toEqual([relationship]);
  });

  it("migrates databases created by earlier versions without data_json columns", async () => {
    const driver = createDriver();
    await driver.exec(`
      CREATE TABLE geocore_objects (
        id TEXT PRIMARY KEY, slug TEXT NOT NULL, title TEXT NOT NULL, summary TEXT, body TEXT NOT NULL,
        language TEXT NOT NULL, status TEXT NOT NULL, version TEXT NOT NULL, author TEXT,
        metadata_json TEXT, tags_json TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
      CREATE TABLE geocore_relationships (
        id TEXT PRIMARY KEY, source_id TEXT NOT NULL, target_id TEXT NOT NULL, type TEXT NOT NULL,
        strength TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      );
      INSERT INTO geocore_objects VALUES ('ko_old','old','Ancien','r','b','fr','published','1','a',NULL,'["t"]','c','u');
    `);

    const repo = new SqlKnowledgeRepository(driver);
    await repo.init();
    await repo.init(); // idempotent

    const old = await repo.getObject("ko_old");
    expect(old?.tags).toEqual(["t"]);

    await repo.saveObject(object);
    expect(await repo.getObject("ko_full")).toEqual(object);
  });

  it("applies offset even without a limit", async () => {
    const repo = new SqlKnowledgeRepository(createDriver());
    await repo.init();
    await repo.saveObject({ ...object, id: "a" });
    await repo.saveObject({ ...object, id: "b" });
    expect((await repo.listObjects({ offset: 1 })).map((o) => o.id)).toEqual(["b"]);
  });
});
