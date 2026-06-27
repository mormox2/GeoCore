import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { KnowledgeCollection } from "../types/collection.js";
/**
 * Returns all IDs present in all collections inside the dataset.
 */
export declare function getAllDatasetIds(dataset: KnowledgeDataset): string[];
/**
 * Find a KnowledgeObject by its ID in the dataset.
 */
export declare function findKnowledgeObjectById(dataset: KnowledgeDataset, id: string): KnowledgeObject | undefined;
/**
 * Find a KnowledgeEntity by its ID in the dataset.
 */
export declare function findEntityById(dataset: KnowledgeDataset, id: string): KnowledgeEntity | undefined;
/**
 * Find a KnowledgeCollection by its ID in the dataset.
 */
export declare function findCollectionById(dataset: KnowledgeDataset, id: string): KnowledgeCollection | undefined;
/**
 * Merges two datasets into a new dataset. Does not mutate the inputs.
 */
export declare function mergeKnowledgeDatasets(left: KnowledgeDataset, right: KnowledgeDataset): KnowledgeDataset;
