import type { KnowledgeObject } from "./knowledge-object.js";
import type { ResolvedMetadata } from "./metadata.js";
import type { KnowledgeRelationship } from "./relationship.js";
import type { KnowledgeEntity } from "./entity.js";
import type { KnowledgeCollection } from "./collection.js";
import type { KnowledgeCitation } from "./citation.js";
import type { KnowledgeSource } from "./citation.js";
import type { MediaAsset } from "./media.js";
import type { RouteRegistry } from "./route.js";
import type { StaticExportAsset } from "./static-export-asset.js";
import type { StaticExportDiagnostic } from "./static-export-diagnostic.js";
import type { StaticExportAssetType } from "./static-export-asset.js";

/**
 * Input to generateStaticExport(). Objects and siteName are required.
 * The exporter must not mutate this input.
 */
export type GenerateStaticExportInput = {
  id: string;
  siteName: string;
  siteUrl?: string;
  language?: string;

  objects: KnowledgeObject[];

  metadata?: Record<string, ResolvedMetadata>;
  relationships?: KnowledgeRelationship[];
  entities?: KnowledgeEntity[];
  collections?: KnowledgeCollection[];
  citations?: KnowledgeCitation[];
  sources?: KnowledgeSource[];
  media?: MediaAsset[];

  routes?: RouteRegistry;

  includeMarkdown?: boolean;
  includeJson?: boolean;
  includeJsonLd?: boolean;
  includeSearchIndex?: boolean;
  includeLlmsTxt?: boolean;
  includeLlmsFullTxt?: boolean;
  includeSitemap?: boolean;

  visibility?: "public" | "internal";
};

/**
 * A manifest entry inside StaticExportManifest. A lightweight index —
 * it must not duplicate full asset content.
 */
export type StaticExportManifestEntry = {
  id: string;
  type: StaticExportAssetType;
  path: string;
  mimeType: string;
  sourceIds: string[];
};

/**
 * The manifest indexes every asset produced by the static exporter.
 */
export type StaticExportManifest = {
  id: string;
  bundleId: string;
  siteName: string;
  siteUrl?: string;
  language?: string;

  assets: StaticExportManifestEntry[];

  generatedAt: string;
};

/**
 * A full in-memory export bundle produced by the static exporter.
 * The bundle is an output projection — it never becomes the source of truth.
 */
export type StaticExportBundle = {
  id: string;
  siteName: string;
  siteUrl?: string;
  language?: string;

  assets: StaticExportAsset[];

  manifest: StaticExportManifest;

  generatedAt: string;

  diagnostics: StaticExportDiagnostic[];
};
