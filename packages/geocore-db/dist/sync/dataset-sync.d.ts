import type { KnowledgeDataset } from "@mormox2/geocore";
import type { KnowledgeRepository } from "../repository/repository-interface.js";
export type SyncResult = {
    objectsAdded: number;
    objectsUpdated: number;
    objectsDeleted: number;
    entitiesSynced: number;
    citationsSynced: number;
    mediaSynced: number;
    durationMs: number;
    timestamp: string;
};
/**
 * Synchronizes a source KnowledgeDataset into a target KnowledgeRepository.
 */
export declare function syncDatasetToRepository(source: KnowledgeDataset, target: KnowledgeRepository, options?: {
    pruneDeleted?: boolean;
}): Promise<SyncResult>;
