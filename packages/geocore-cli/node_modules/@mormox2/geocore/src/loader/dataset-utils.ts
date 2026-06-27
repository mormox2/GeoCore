import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { KnowledgeCollection } from "../types/collection.js";

/**
 * Returns all IDs present in all collections inside the dataset.
 */
export function getAllDatasetIds(dataset: KnowledgeDataset): string[] {
  const ids: string[] = [];

  dataset.objects.forEach((o) => ids.push(o.id));
  dataset.entities.forEach((e) => ids.push(e.id));
  dataset.relationships.forEach((r) => ids.push(r.id));
  dataset.collections.forEach((c) => ids.push(c.id));
  dataset.taxonomyTerms.forEach((t) => ids.push(t.id));
  dataset.glossaryEntries.forEach((g) => ids.push(g.id));
  dataset.sources.forEach((s) => ids.push(s.id));
  dataset.citations.forEach((c) => ids.push(c.id));
  dataset.media.forEach((m) => ids.push(m.id));

  return ids;
}

/**
 * Find a KnowledgeObject by its ID in the dataset.
 */
export function findKnowledgeObjectById(
  dataset: KnowledgeDataset,
  id: string
): KnowledgeObject | undefined {
  return dataset.objects.find((o) => o.id === id);
}

/**
 * Find a KnowledgeEntity by its ID in the dataset.
 */
export function findEntityById(
  dataset: KnowledgeDataset,
  id: string
): KnowledgeEntity | undefined {
  return dataset.entities.find((e) => e.id === id);
}

/**
 * Find a KnowledgeCollection by its ID in the dataset.
 */
export function findCollectionById(
  dataset: KnowledgeDataset,
  id: string
): KnowledgeCollection | undefined {
  return dataset.collections.find((c) => c.id === id);
}

/**
 * Merges two datasets into a new dataset. Does not mutate the inputs.
 */
export function mergeKnowledgeDatasets(
  left: KnowledgeDataset,
  right: KnowledgeDataset
): KnowledgeDataset {
  return {
    id: left.id,
    name: left.name,
    objects: [...left.objects, ...right.objects],
    entities: [...left.entities, ...right.entities],
    relationships: [...left.relationships, ...right.relationships],
    collections: [...left.collections, ...right.collections],
    taxonomyTerms: [...left.taxonomyTerms, ...right.taxonomyTerms],
    glossaryEntries: [...left.glossaryEntries, ...right.glossaryEntries],
    sources: [...left.sources, ...right.sources],
    citations: [...left.citations, ...right.citations],
    media: [...left.media, ...right.media],
    loadedAt: left.loadedAt,
    diagnostics: [...left.diagnostics, ...right.diagnostics],
  };
}
