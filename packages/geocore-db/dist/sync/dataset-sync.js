/**
 * Synchronizes a source KnowledgeDataset into a target KnowledgeRepository.
 */
export async function syncDatasetToRepository(source, target, options = {}) {
    const startTime = Date.now();
    let objectsAdded = 0;
    let objectsUpdated = 0;
    let objectsDeleted = 0;
    // 1. Sync Knowledge Objects
    const existingObjects = await target.listObjects();
    const existingMap = new Map(existingObjects.map((o) => [o.id, o]));
    const sourceObjectIds = new Set();
    for (const obj of source.objects || []) {
        sourceObjectIds.add(obj.id);
        const existing = existingMap.get(obj.id);
        if (!existing) {
            await target.saveObject(obj);
            objectsAdded++;
        }
        else if (existing.updatedAt !== obj.updatedAt || existing.version !== obj.version) {
            await target.saveObject(obj);
            objectsUpdated++;
        }
    }
    if (options.pruneDeleted) {
        for (const existing of existingObjects) {
            if (!sourceObjectIds.has(existing.id)) {
                await target.deleteObject(existing.id);
                objectsDeleted++;
            }
        }
    }
    // 2. Sync Entities
    for (const entity of source.entities || []) {
        await target.saveEntity(entity);
    }
    // 3. Sync Citations & Sources
    for (const sourceItem of source.sources || []) {
        await target.saveSource(sourceItem);
    }
    for (const citation of source.citations || []) {
        await target.saveCitation(citation);
    }
    // 4. Sync Media
    for (const media of source.media || []) {
        await target.saveMedia(media);
    }
    // 5. Sync Relationships
    for (const rel of source.relationships || []) {
        await target.saveRelationship(rel);
    }
    return {
        objectsAdded,
        objectsUpdated,
        objectsDeleted,
        entitiesSynced: source.entities?.length || 0,
        citationsSynced: source.citations?.length || 0,
        mediaSynced: source.media?.length || 0,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
    };
}
