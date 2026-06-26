import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { ResolvedMetadata } from "../types/metadata.js";
import type { KnowledgeRelationship } from "../types/relationship.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { KnowledgeCollection } from "../types/collection.js";
import type { KnowledgeCitation } from "../types/citation.js";
import type { MediaAsset } from "../types/media.js";
import type { RendererInput } from "../types/renderer-input.js";
import type { GenerateStaticExportInput } from "../types/static-export.js";
import type { StaticExportBundle } from "../types/static-export.js";
/**
 * Create a RendererInput from a knowledge object for use in the static exporter.
 * Derives minimal metadata from the object when ResolvedMetadata is not provided.
 */
export declare function createRendererInputForExport(input: {
    object: KnowledgeObject;
    metadata?: ResolvedMetadata;
    relationships?: KnowledgeRelationship[];
    entities?: KnowledgeEntity[];
    collections?: KnowledgeCollection[];
    citations?: KnowledgeCitation[];
    media?: MediaAsset[];
}): RendererInput;
/**
 * Filter objects that should be included in the static export.
 * Mirrors the public/internal + language filtering used by sitemap & route resolvers.
 */
export declare function filterStaticExportObjects(input: {
    objects: KnowledgeObject[];
    visibility?: "public" | "internal";
    language?: string;
}): KnowledgeObject[];
/**
 * Generate a full in-memory static export bundle from validated knowledge.
 *
 * This is the assembly layer: it calls renderers and generators that were built
 * in prior sprints, wraps their outputs into StaticExportAssets, and produces
 * a bundle with a manifest and diagnostics.
 *
 * It never writes files to disk.
 */
export declare function generateStaticExport(input: GenerateStaticExportInput): StaticExportBundle;
