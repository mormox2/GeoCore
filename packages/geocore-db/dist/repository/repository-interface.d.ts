import type { KnowledgeObject, KnowledgeEntity, KnowledgeCitation, KnowledgeSource, MediaAsset, KnowledgeRelationship, KnowledgeDataset } from "@mormox2/geocore";
export type ObjectQueryFilter = {
    status?: string;
    visibility?: "public" | "internal";
    language?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
};
export type EntityQueryFilter = {
    type?: string;
    language?: string;
    status?: string;
    limit?: number;
};
export type CitationQueryFilter = {
    targetId?: string;
    sourceId?: string;
    purpose?: string;
    status?: string;
};
export type MediaAssetQueryFilter = {
    type?: string;
    visibility?: "public" | "internal";
    status?: string;
    relatedObjectId?: string;
};
/**
 * Universal Knowledge Repository interface for GeoCore storage engines.
 */
export interface KnowledgeRepository {
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
