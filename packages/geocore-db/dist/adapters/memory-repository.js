/**
 * In-Memory indexed implementation of KnowledgeRepository.
 */
export class MemoryKnowledgeRepository {
    objects = new Map();
    entities = new Map();
    citations = new Map();
    sources = new Map();
    media = new Map();
    relationships = new Map();
    constructor(initialDataset) {
        if (initialDataset) {
            this.importDatasetSync(initialDataset);
        }
    }
    importDatasetSync(dataset) {
        for (const o of dataset.objects || [])
            this.objects.set(o.id, o);
        for (const e of dataset.entities || [])
            this.entities.set(e.id, e);
        for (const c of dataset.citations || [])
            this.citations.set(c.id, c);
        for (const s of dataset.sources || [])
            this.sources.set(s.id, s);
        for (const m of dataset.media || [])
            this.media.set(m.id, m);
        for (const r of dataset.relationships || [])
            this.relationships.set(r.id, r);
    }
    // Objects
    async getObject(id) {
        return this.objects.get(id) ?? null;
    }
    async listObjects(filter) {
        let list = Array.from(this.objects.values());
        if (filter?.status) {
            list = list.filter((o) => o.status === filter.status);
        }
        if (filter?.language) {
            list = list.filter((o) => o.language === filter.language);
        }
        if (filter?.tags && filter.tags.length > 0) {
            list = list.filter((o) => filter.tags.some((t) => o.tags?.includes(t)));
        }
        if (filter?.offset) {
            list = list.slice(filter.offset);
        }
        if (filter?.limit) {
            list = list.slice(0, filter.limit);
        }
        return list;
    }
    async saveObject(object) {
        this.objects.set(object.id, object);
    }
    async deleteObject(id) {
        return this.objects.delete(id);
    }
    // Entities
    async getEntity(id) {
        return this.entities.get(id) ?? null;
    }
    async listEntities(filter) {
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
    async saveEntity(entity) {
        this.entities.set(entity.id, entity);
    }
    async deleteEntity(id) {
        return this.entities.delete(id);
    }
    // Citations & Sources
    async getCitation(id) {
        return this.citations.get(id) ?? null;
    }
    async listCitations(filter) {
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
    async saveCitation(citation) {
        this.citations.set(citation.id, citation);
    }
    async deleteCitation(id) {
        return this.citations.delete(id);
    }
    async getSource(id) {
        return this.sources.get(id) ?? null;
    }
    async listSources() {
        return Array.from(this.sources.values());
    }
    async saveSource(source) {
        this.sources.set(source.id, source);
    }
    async deleteSource(id) {
        return this.sources.delete(id);
    }
    // Media
    async getMedia(id) {
        return this.media.get(id) ?? null;
    }
    async listMedia(filter) {
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
            list = list.filter((m) => m.relatedObjectIds?.includes(filter.relatedObjectId));
        }
        return list;
    }
    async saveMedia(media) {
        this.media.set(media.id, media);
    }
    async deleteMedia(id) {
        return this.media.delete(id);
    }
    // Relationships
    async getRelationships(nodeId) {
        const list = Array.from(this.relationships.values());
        if (!nodeId)
            return list;
        return list.filter((r) => r.sourceId === nodeId || r.targetId === nodeId);
    }
    async saveRelationship(relationship) {
        this.relationships.set(relationship.id, relationship);
    }
    async deleteRelationship(id) {
        return this.relationships.delete(id);
    }
    // Import / Export
    async importDataset(dataset) {
        this.importDatasetSync(dataset);
        return {
            importedObjects: dataset.objects?.length || 0,
            importedEntities: dataset.entities?.length || 0,
        };
    }
    async exportDataset(id, name = "Exported Dataset") {
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
