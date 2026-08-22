import type { KnowledgeObject, KnowledgeEntity, KnowledgeCitation, KnowledgeSource, MediaAsset, KnowledgeRelationship, KnowledgeDataset } from "@mormox2/geocore";
import type { KnowledgeRepository, ObjectQueryFilter, EntityQueryFilter, CitationQueryFilter, MediaAssetQueryFilter } from "../repository/repository-interface.js";
/**
 * SQL Schema definition for GeoCore database engines (PostgreSQL / SQLite).
 */
export declare const GEOCORE_SQL_SCHEMA = "\nCREATE TABLE IF NOT EXISTS geocore_objects (\n  id TEXT PRIMARY KEY,\n  slug TEXT NOT NULL,\n  title TEXT NOT NULL,\n  summary TEXT,\n  body TEXT NOT NULL,\n  language TEXT NOT NULL,\n  status TEXT NOT NULL,\n  version TEXT NOT NULL,\n  author TEXT,\n  metadata_json TEXT,\n  tags_json TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS geocore_entities (\n  id TEXT PRIMARY KEY,\n  type TEXT NOT NULL,\n  canonical_name TEXT NOT NULL,\n  definition TEXT NOT NULL,\n  language TEXT NOT NULL,\n  status TEXT NOT NULL,\n  data_json TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS geocore_citations (\n  id TEXT PRIMARY KEY,\n  source_id TEXT NOT NULL,\n  target_id TEXT NOT NULL,\n  purpose TEXT NOT NULL,\n  status TEXT NOT NULL,\n  confidence TEXT,\n  quote TEXT,\n  paraphrase TEXT,\n  data_json TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS geocore_sources (\n  id TEXT PRIMARY KEY,\n  type TEXT NOT NULL,\n  title TEXT NOT NULL,\n  status TEXT NOT NULL,\n  trust_level TEXT,\n  url TEXT,\n  data_json TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS geocore_media (\n  id TEXT PRIMARY KEY,\n  type TEXT NOT NULL,\n  title TEXT NOT NULL,\n  status TEXT NOT NULL,\n  visibility TEXT NOT NULL,\n  source TEXT NOT NULL,\n  data_json TEXT,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS geocore_relationships (\n  id TEXT PRIMARY KEY,\n  source_id TEXT NOT NULL,\n  target_id TEXT NOT NULL,\n  type TEXT NOT NULL,\n  strength TEXT NOT NULL,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL\n);\n\nCREATE INDEX IF NOT EXISTS idx_objects_status ON geocore_objects(status);\nCREATE INDEX IF NOT EXISTS idx_objects_language ON geocore_objects(language);\nCREATE INDEX IF NOT EXISTS idx_citations_target ON geocore_citations(target_id);\nCREATE INDEX IF NOT EXISTS idx_relationships_source ON geocore_relationships(source_id);\nCREATE INDEX IF NOT EXISTS idx_relationships_target ON geocore_relationships(target_id);\n";
export interface SqlDatabaseDriver {
    exec(sql: string): Promise<void>;
    query<T = any>(sql: string, params?: any[]): Promise<T[]>;
    run(sql: string, params?: any[]): Promise<{
        changes: number;
    }>;
}
/**
 * SQL-backed KnowledgeRepository adapter for SQLite or PostgreSQL.
 */
export declare class SqlKnowledgeRepository implements KnowledgeRepository {
    private driver;
    constructor(driver: SqlDatabaseDriver);
    init(): Promise<void>;
    getObject(id: string): Promise<KnowledgeObject | null>;
    listObjects(filter?: ObjectQueryFilter): Promise<KnowledgeObject[]>;
    saveObject(object: KnowledgeObject): Promise<void>;
    deleteObject(id: string): Promise<boolean>;
    getEntity(id: string): Promise<KnowledgeEntity | null>;
    listEntities(filter?: EntityQueryFilter): Promise<KnowledgeEntity[]>;
    saveEntity(entity: KnowledgeEntity): Promise<void>;
    deleteEntity(id: string): Promise<boolean>;
    getCitation(id: string): Promise<KnowledgeCitation | null>;
    listCitations(filter?: CitationQueryFilter): Promise<KnowledgeCitation[]>;
    saveCitation(citation: KnowledgeCitation): Promise<void>;
    deleteCitation(id: string): Promise<boolean>;
    getSource(id: string): Promise<KnowledgeSource | null>;
    listSources(): Promise<KnowledgeSource[]>;
    saveSource(source: KnowledgeSource): Promise<void>;
    deleteSource(id: string): Promise<boolean>;
    getMedia(id: string): Promise<MediaAsset | null>;
    listMedia(filter?: MediaAssetQueryFilter): Promise<MediaAsset[]>;
    saveMedia(media: MediaAsset): Promise<void>;
    deleteMedia(id: string): Promise<boolean>;
    getRelationships(nodeId?: string): Promise<KnowledgeRelationship[]>;
    saveRelationship(relationship: KnowledgeRelationship): Promise<void>;
    deleteRelationship(id: string): Promise<boolean>;
    importDataset(dataset: KnowledgeDataset): Promise<{
        importedObjects: number;
        importedEntities: number;
    }>;
    exportDataset(id: string, name?: string): Promise<KnowledgeDataset>;
}
