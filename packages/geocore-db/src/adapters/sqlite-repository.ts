import type {
  KnowledgeObject,
  KnowledgeEntity,
  KnowledgeCitation,
  KnowledgeSource,
  MediaAsset,
  KnowledgeRelationship,
  KnowledgeDataset,
} from "@mormo_mossaab/geocore";
import type {
  KnowledgeRepository,
  ObjectQueryFilter,
  EntityQueryFilter,
  CitationQueryFilter,
  MediaAssetQueryFilter,
} from "../repository/repository-interface.js";

/**
 * SQL Schema definition for GeoCore database engines (PostgreSQL / SQLite).
 */
export const GEOCORE_SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS geocore_objects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL,
  version TEXT NOT NULL,
  author TEXT,
  metadata_json TEXT,
  tags_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS geocore_entities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  canonical_name TEXT NOT NULL,
  definition TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL,
  data_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS geocore_citations (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL,
  confidence TEXT,
  quote TEXT,
  paraphrase TEXT,
  data_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS geocore_sources (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  trust_level TEXT,
  url TEXT,
  data_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS geocore_media (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  visibility TEXT NOT NULL,
  source TEXT NOT NULL,
  data_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS geocore_relationships (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  type TEXT NOT NULL,
  strength TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_objects_status ON geocore_objects(status);
CREATE INDEX IF NOT EXISTS idx_objects_language ON geocore_objects(language);
CREATE INDEX IF NOT EXISTS idx_citations_target ON geocore_citations(target_id);
CREATE INDEX IF NOT EXISTS idx_relationships_source ON geocore_relationships(source_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON geocore_relationships(target_id);
`;

export interface SqlDatabaseDriver {
  exec(sql: string): Promise<void>;
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  run(sql: string, params?: any[]): Promise<{ changes: number }>;
}

/**
 * SQL-backed KnowledgeRepository adapter for SQLite or PostgreSQL.
 */
export class SqlKnowledgeRepository implements KnowledgeRepository {
  private driver: SqlDatabaseDriver;

  constructor(driver: SqlDatabaseDriver) {
    this.driver = driver;
  }

  async init(): Promise<void> {
    await this.driver.exec(GEOCORE_SQL_SCHEMA);
  }

  // Objects
  async getObject(id: string): Promise<KnowledgeObject | null> {
    const rows = await this.driver.query<any>(
      "SELECT * FROM geocore_objects WHERE id = ? LIMIT 1",
      [id]
    );
    if (!rows || rows.length === 0) return null;
    const row = rows[0];
    const metadata = row.metadata_json ? JSON.parse(row.metadata_json) : undefined;
    const tags = row.tags_json ? JSON.parse(row.tags_json) : undefined;

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      body: row.body,
      language: row.language,
      status: row.status,
      version: row.version,
      author: row.author,
      metadata,
      tags,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async listObjects(filter?: ObjectQueryFilter): Promise<KnowledgeObject[]> {
    let sql = "SELECT * FROM geocore_objects WHERE 1=1";
    const params: any[] = [];

    if (filter?.status) {
      sql += " AND status = ?";
      params.push(filter.status);
    }
    if (filter?.language) {
      sql += " AND language = ?";
      params.push(filter.language);
    }
    if (filter?.limit) {
      sql += " LIMIT ?";
      params.push(filter.limit);
      if (filter?.offset) {
        sql += " OFFSET ?";
        params.push(filter.offset);
      }
    }

    const rows = await this.driver.query<any>(sql, params);
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      body: row.body,
      language: row.language,
      status: row.status,
      version: row.version,
      author: row.author,
      metadata: row.metadata_json ? JSON.parse(row.metadata_json) : undefined,
      tags: row.tags_json ? JSON.parse(row.tags_json) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async saveObject(object: KnowledgeObject): Promise<void> {
    await this.driver.run(
      `INSERT OR REPLACE INTO geocore_objects 
       (id, slug, title, summary, body, language, status, version, author, metadata_json, tags_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        object.id,
        object.slug,
        object.title,
        object.summary,
        object.body,
        object.language,
        object.status,
        object.version,
        object.author,
        object.metadata ? JSON.stringify(object.metadata) : null,
        object.tags ? JSON.stringify(object.tags) : null,
        object.createdAt,
        object.updatedAt,
      ]
    );
  }

  async deleteObject(id: string): Promise<boolean> {
    const res = await this.driver.run("DELETE FROM geocore_objects WHERE id = ?", [id]);
    return res.changes > 0;
  }

  // Entities
  async getEntity(id: string): Promise<KnowledgeEntity | null> {
    const rows = await this.driver.query<any>(
      "SELECT * FROM geocore_entities WHERE id = ? LIMIT 1",
      [id]
    );
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    const data = r.data_json ? JSON.parse(r.data_json) : {};
    return {
      id: r.id,
      type: r.type,
      canonicalName: r.canonical_name,
      definition: r.definition,
      language: r.language,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      ...data,
    };
  }

  async listEntities(filter?: EntityQueryFilter): Promise<KnowledgeEntity[]> {
    let sql = "SELECT * FROM geocore_entities WHERE 1=1";
    const params: any[] = [];
    if (filter?.type) {
      sql += " AND type = ?";
      params.push(filter.type);
    }
    if (filter?.language) {
      sql += " AND language = ?";
      params.push(filter.language);
    }
    if (filter?.status) {
      sql += " AND status = ?";
      params.push(filter.status);
    }
    const rows = await this.driver.query<any>(sql, params);
    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      canonicalName: r.canonical_name,
      definition: r.definition,
      language: r.language,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      ...(r.data_json ? JSON.parse(r.data_json) : {}),
    }));
  }

  async saveEntity(entity: KnowledgeEntity): Promise<void> {
    await this.driver.run(
      `INSERT OR REPLACE INTO geocore_entities (id, type, canonical_name, definition, language, status, data_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entity.id,
        entity.type,
        entity.canonicalName,
        entity.definition,
        entity.language,
        entity.status,
        JSON.stringify(entity),
        entity.createdAt,
        entity.updatedAt,
      ]
    );
  }

  async deleteEntity(id: string): Promise<boolean> {
    const res = await this.driver.run("DELETE FROM geocore_entities WHERE id = ?", [id]);
    return res.changes > 0;
  }

  // Citations & Sources
  async getCitation(id: string): Promise<KnowledgeCitation | null> {
    const rows = await this.driver.query<any>("SELECT * FROM geocore_citations WHERE id = ? LIMIT 1", [id]);
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return r.data_json ? JSON.parse(r.data_json) : null;
  }

  async listCitations(filter?: CitationQueryFilter): Promise<KnowledgeCitation[]> {
    let sql = "SELECT * FROM geocore_citations WHERE 1=1";
    const params: any[] = [];
    if (filter?.targetId) {
      sql += " AND target_id = ?";
      params.push(filter.targetId);
    }
    if (filter?.sourceId) {
      sql += " AND source_id = ?";
      params.push(filter.sourceId);
    }
    const rows = await this.driver.query<any>(sql, params);
    return rows.map((r) => (r.data_json ? JSON.parse(r.data_json) : null)).filter(Boolean);
  }

  async saveCitation(citation: KnowledgeCitation): Promise<void> {
    await this.driver.run(
      `INSERT OR REPLACE INTO geocore_citations (id, source_id, target_id, purpose, status, confidence, quote, paraphrase, data_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        citation.id,
        citation.sourceId,
        citation.targetId,
        citation.purpose,
        citation.status,
        citation.confidence || null,
        citation.quote || null,
        citation.paraphrase || null,
        JSON.stringify(citation),
        citation.createdAt,
        citation.updatedAt,
      ]
    );
  }

  async deleteCitation(id: string): Promise<boolean> {
    const res = await this.driver.run("DELETE FROM geocore_citations WHERE id = ?", [id]);
    return res.changes > 0;
  }

  async getSource(id: string): Promise<KnowledgeSource | null> {
    const rows = await this.driver.query<any>("SELECT * FROM geocore_sources WHERE id = ? LIMIT 1", [id]);
    if (!rows || rows.length === 0) return null;
    return rows[0].data_json ? JSON.parse(rows[0].data_json) : null;
  }

  async listSources(): Promise<KnowledgeSource[]> {
    const rows = await this.driver.query<any>("SELECT * FROM geocore_sources");
    return rows.map((r) => (r.data_json ? JSON.parse(r.data_json) : null)).filter(Boolean);
  }

  async saveSource(source: KnowledgeSource): Promise<void> {
    await this.driver.run(
      `INSERT OR REPLACE INTO geocore_sources (id, type, title, status, trust_level, url, data_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        source.id,
        source.type,
        source.title,
        source.status,
        source.trustLevel || null,
        source.url || null,
        JSON.stringify(source),
        source.createdAt,
        source.updatedAt,
      ]
    );
  }

  async deleteSource(id: string): Promise<boolean> {
    const res = await this.driver.run("DELETE FROM geocore_sources WHERE id = ?", [id]);
    return res.changes > 0;
  }

  // Media
  async getMedia(id: string): Promise<MediaAsset | null> {
    const rows = await this.driver.query<any>("SELECT * FROM geocore_media WHERE id = ? LIMIT 1", [id]);
    if (!rows || rows.length === 0) return null;
    return rows[0].data_json ? JSON.parse(rows[0].data_json) : null;
  }

  async listMedia(filter?: MediaAssetQueryFilter): Promise<MediaAsset[]> {
    let sql = "SELECT * FROM geocore_media WHERE 1=1";
    const params: any[] = [];
    if (filter?.type) {
      sql += " AND type = ?";
      params.push(filter.type);
    }
    if (filter?.visibility) {
      sql += " AND visibility = ?";
      params.push(filter.visibility);
    }
    const rows = await this.driver.query<any>(sql, params);
    return rows.map((r) => (r.data_json ? JSON.parse(r.data_json) : null)).filter(Boolean);
  }

  async saveMedia(media: MediaAsset): Promise<void> {
    await this.driver.run(
      `INSERT OR REPLACE INTO geocore_media (id, type, title, status, visibility, source, data_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        media.id,
        media.type,
        media.title,
        media.status,
        media.visibility,
        media.source,
        JSON.stringify(media),
        media.createdAt,
        media.updatedAt,
      ]
    );
  }

  async deleteMedia(id: string): Promise<boolean> {
    const res = await this.driver.run("DELETE FROM geocore_media WHERE id = ?", [id]);
    return res.changes > 0;
  }

  // Relationships
  async getRelationships(nodeId?: string): Promise<KnowledgeRelationship[]> {
    let sql = "SELECT * FROM geocore_relationships";
    const params: any[] = [];
    if (nodeId) {
      sql += " WHERE source_id = ? OR target_id = ?";
      params.push(nodeId, nodeId);
    }
    const rows = await this.driver.query<any>(sql, params);
    return rows.map((r) => ({
      id: r.id,
      sourceId: r.source_id,
      targetId: r.target_id,
      type: r.type,
      strength: r.strength,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async saveRelationship(relationship: KnowledgeRelationship): Promise<void> {
    await this.driver.run(
      `INSERT OR REPLACE INTO geocore_relationships (id, source_id, target_id, type, strength, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        relationship.id,
        relationship.sourceId,
        relationship.targetId,
        relationship.type,
        relationship.strength,
        relationship.createdAt,
        relationship.updatedAt,
      ]
    );
  }

  async deleteRelationship(id: string): Promise<boolean> {
    const res = await this.driver.run("DELETE FROM geocore_relationships WHERE id = ?", [id]);
    return res.changes > 0;
  }

  // Import / Export
  async importDataset(dataset: KnowledgeDataset): Promise<{ importedObjects: number; importedEntities: number }> {
    for (const o of dataset.objects || []) await this.saveObject(o);
    for (const e of dataset.entities || []) await this.saveEntity(e);
    for (const c of dataset.citations || []) await this.saveCitation(c);
    for (const s of dataset.sources || []) await this.saveSource(s);
    for (const m of dataset.media || []) await this.saveMedia(m);
    for (const r of dataset.relationships || []) await this.saveRelationship(r);

    return {
      importedObjects: dataset.objects?.length || 0,
      importedEntities: dataset.entities?.length || 0,
    };
  }

  async exportDataset(id: string, name = "Exported SQL Dataset"): Promise<KnowledgeDataset> {
    const [objects, entities, relationships, sources, citations, media] = await Promise.all([
      this.listObjects(),
      this.listEntities(),
      this.getRelationships(),
      this.listSources(),
      this.listCitations(),
      this.listMedia(),
    ]);

    return {
      id,
      name,
      objects,
      entities,
      relationships,
      collections: [],
      taxonomyTerms: [],
      glossaryEntries: [],
      sources,
      citations,
      media,
      loadedAt: new Date().toISOString(),
      diagnostics: [],
    };
  }
}
