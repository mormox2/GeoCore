import type {
  KnowledgeObject,
  KnowledgeEntity,
  KnowledgeCitation,
  KnowledgeSource,
  MediaAsset,
  KnowledgeRelationship,
  KnowledgeDataset,
} from "@mormox2/geocore";
import type {
  KnowledgeRepository,
  ObjectQueryFilter,
  EntityQueryFilter,
  CitationQueryFilter,
  MediaAssetQueryFilter,
} from "../repository/repository-interface.js";

/**
 * In-Memory indexed implementation of KnowledgeRepository.
 */
export class MemoryKnowledgeRepository implements KnowledgeRepository {
  private objects = new Map<string, KnowledgeObject>();
  private entities = new Map<string, KnowledgeEntity>();
  private citations = new Map<string, KnowledgeCitation>();
  private sources = new Map<string, KnowledgeSource>();
  private media = new Map<string, MediaAsset>();
  private relationships = new Map<string, KnowledgeRelationship>();

  constructor(initialDataset?: KnowledgeDataset) {
    if (initialDataset) {
      this.importDatasetSync(initialDataset);
    }
  }

  private importDatasetSync(dataset: KnowledgeDataset): void {
    for (const o of dataset.objects || []) this.objects.set(o.id, o);
    for (const e of dataset.entities || []) this.entities.set(e.id, e);
    for (const c of dataset.citations || []) this.citations.set(c.id, c);
    for (const s of dataset.sources || []) this.sources.set(s.id, s);
    for (const m of dataset.media || []) this.media.set(m.id, m);
    for (const r of dataset.relationships || []) this.relationships.set(r.id, r);
  }

  // Objects
  async getObject(id: string): Promise<KnowledgeObject | null> {
    return this.objects.get(id) ?? null;
  }

  async listObjects(filter?: ObjectQueryFilter): Promise<KnowledgeObject[]> {
    let list = Array.from(this.objects.values());

    if (filter?.status) {
      list = list.filter((o) => o.status === filter.status);
    }
    if (filter?.language) {
      list = list.filter((o) => o.language === filter.language);
    }
    if (filter?.tags && filter.tags.length > 0) {
      list = list.filter((o) => filter.tags!.some((t) => o.tags?.includes(t)));
    }

    if (filter?.offset) {
      list = list.slice(filter.offset);
    }
    if (filter?.limit) {
      list = list.slice(0, filter.limit);
    }

    return list;
  }

  async saveObject(object: KnowledgeObject): Promise<void> {
    this.objects.set(object.id, object);
  }

  async deleteObject(id: string): Promise<boolean> {
    return this.objects.delete(id);
  }

  // Entities
  async getEntity(id: string): Promise<KnowledgeEntity | null> {
    return this.entities.get(id) ?? null;
  }

  async listEntities(filter?: EntityQueryFilter): Promise<KnowledgeEntity[]> {
    let list = Array.from(this.entities.values());
    if (filter?.type) {
      list = list.filter((e) => e.type === filter.type);
    }
    if (filter?.language) {
      list = list.filter((e) => e.language === filter.language);
    }
    if (filter?.status) {
      list = list.filter((e) => e.status === filter.status);
    }
    if (filter?.limit) {
      list = list.slice(0, filter.limit);
    }
    return list;
  }

  async saveEntity(entity: KnowledgeEntity): Promise<void> {
    this.entities.set(entity.id, entity);
  }

  async deleteEntity(id: string): Promise<boolean> {
    return this.entities.delete(id);
  }

  // Citations & Sources
  async getCitation(id: string): Promise<KnowledgeCitation | null> {
    return this.citations.get(id) ?? null;
  }

  async listCitations(filter?: CitationQueryFilter): Promise<KnowledgeCitation[]> {
    let list = Array.from(this.citations.values());
    if (filter?.targetId) {
      list = list.filter((c) => c.targetId === filter.targetId);
    }
    if (filter?.sourceId) {
      list = list.filter((c) => c.sourceId === filter.sourceId);
    }
    if (filter?.purpose) {
      list = list.filter((c) => c.purpose === filter.purpose);
    }
    if (filter?.status) {
      list = list.filter((c) => c.status === filter.status);
    }
    return list;
  }

  async saveCitation(citation: KnowledgeCitation): Promise<void> {
    this.citations.set(citation.id, citation);
  }

  async deleteCitation(id: string): Promise<boolean> {
    return this.citations.delete(id);
  }

  async getSource(id: string): Promise<KnowledgeSource | null> {
    return this.sources.get(id) ?? null;
  }

  async listSources(): Promise<KnowledgeSource[]> {
    return Array.from(this.sources.values());
  }

  async saveSource(source: KnowledgeSource): Promise<void> {
    this.sources.set(source.id, source);
  }

  async deleteSource(id: string): Promise<boolean> {
    return this.sources.delete(id);
  }

  // Media
  async getMedia(id: string): Promise<MediaAsset | null> {
    return this.media.get(id) ?? null;
  }

  async listMedia(filter?: MediaAssetQueryFilter): Promise<MediaAsset[]> {
    let list = Array.from(this.media.values());
    if (filter?.type) {
      list = list.filter((m) => m.type === filter.type);
    }
    if (filter?.status) {
      list = list.filter((m) => m.status === filter.status);
    }
    if (filter?.visibility) {
      list = list.filter((m) => m.visibility === filter.visibility);
    }
    if (filter?.relatedObjectId) {
      list = list.filter((m) => m.relatedObjectIds?.includes(filter.relatedObjectId!));
    }
    return list;
  }

  async saveMedia(media: MediaAsset): Promise<void> {
    this.media.set(media.id, media);
  }

  async deleteMedia(id: string): Promise<boolean> {
    return this.media.delete(id);
  }

  // Relationships
  async getRelationships(nodeId?: string): Promise<KnowledgeRelationship[]> {
    const list = Array.from(this.relationships.values());
    if (!nodeId) return list;
    return list.filter((r) => r.sourceId === nodeId || r.targetId === nodeId);
  }

  async saveRelationship(relationship: KnowledgeRelationship): Promise<void> {
    this.relationships.set(relationship.id, relationship);
  }

  async deleteRelationship(id: string): Promise<boolean> {
    return this.relationships.delete(id);
  }

  // Import / Export
  async importDataset(dataset: KnowledgeDataset): Promise<{ importedObjects: number; importedEntities: number }> {
    this.importDatasetSync(dataset);
    return {
      importedObjects: dataset.objects?.length || 0,
      importedEntities: dataset.entities?.length || 0,
    };
  }

  async exportDataset(id: string, name = "Exported Dataset"): Promise<KnowledgeDataset> {
    return {
      id,
      name,
      objects: Array.from(this.objects.values()),
      entities: Array.from(this.entities.values()),
      relationships: Array.from(this.relationships.values()),
      collections: [],
      taxonomyTerms: [],
      glossaryEntries: [],
      sources: Array.from(this.sources.values()),
      citations: Array.from(this.citations.values()),
      media: Array.from(this.media.values()),
      loadedAt: new Date().toISOString(),
      diagnostics: [],
    };
  }
}
