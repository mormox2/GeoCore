import type { LoadKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Normalizes raw knowledge inputs into a unified KnowledgeDataset in memory.
 */
export declare function loadKnowledgeDataset(input: LoadKnowledgeInput): KnowledgeDataset;
/**
 * Detects duplicate IDs within categories and cross-category collisions.
 */
export declare function detectDatasetDuplicates(dataset: KnowledgeDataset): LoaderDiagnostic[];
