import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { ResolvedMetadata } from "../types/metadata.js";
import type { KnowledgeRelationship } from "../types/relationship.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { KnowledgeCollection } from "../types/collection.js";
import type { KnowledgeCitation } from "../types/citation.js";
import type { KnowledgeSource } from "../types/citation.js";
import type { MediaAsset } from "../types/media.js";
import type { RouteRegistry } from "../types/route.js";
import type { RendererInput } from "../types/renderer-input.js";
import type { RendererOutput } from "../types/renderer-output.js";
import type { GenerateStaticExportInput } from "../types/static-export.js";
import type { StaticExportBundle } from "../types/static-export.js";
import type { StaticExportAsset } from "../types/static-export-asset.js";
import type { StaticExportDiagnostic } from "../types/static-export-diagnostic.js";
import type { KnowledgeStatus } from "../types/metadata.js";
import { markdownRenderer } from "../renderers/markdown-renderer.js";
import { jsonRenderer } from "../renderers/json-renderer.js";
import { generateSearchIndex } from "../search/search-index-generator.js";
import { generateLlmsTxt } from "../llms/llms-generator.js";
import { generateLlmsFullTxt } from "../llms/llms-full-generator.js";
import { generateJsonLd } from "../schema/json-ld-generator.js";
import { generateSitemap } from "../sitemap/sitemap-generator.js";
import { createExportPath } from "./export-paths.js";
import { createStaticExportManifest } from "./export-manifest.js";
import {
  createStaticExportAssetId,
  getMimeTypeForExportType,
} from "./export-utils.js";
import {
  GC_EXPORT_NO_OBJECTS,
  GC_EXPORT_OBJECT_EXCLUDED,
  GC_EXPORT_ROUTE_MISSING,
} from "../validation/validation-codes.js";

/**
 * Create a RendererInput from a knowledge object for use in the static exporter.
 * Derives minimal metadata from the object when ResolvedMetadata is not provided.
 */
export function createRendererInputForExport(input: {
  object: KnowledgeObject;
  metadata?: ResolvedMetadata;
  relationships?: KnowledgeRelationship[];
  entities?: KnowledgeEntity[];
  collections?: KnowledgeCollection[];
  citations?: KnowledgeCitation[];
  media?: MediaAsset[];
}): RendererInput {
  const { object, metadata, relationships, entities, collections, citations, media } = input;

  const resolvedMeta: ResolvedMetadata = metadata ?? deriveMinimalMetadata(object);

  return {
    objectId: object.id,
    objectVersion: object.version,
    language: object.language,
    content: object.body,
    metadata: resolvedMeta,
    relationships,
    entities,
    collections,
    citations,
    media,
  };
}

/**
 * Build a minimal ResolvedMetadata from a KnowledgeObject's own fields,
 * so renderers that require metadata can still function when no resolved
 * metadata was passed.
 */
function deriveMinimalMetadata(object: KnowledgeObject): ResolvedMetadata {
  return {
    id: object.id,
    slug: object.slug,
    title: object.title,
    summary: object.summary,
    language: object.language,
    version: object.version,
    status: object.status as KnowledgeStatus,
    author: object.author,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
    resolvedAt: new Date().toISOString(),
    resolvedFrom: { object: true, defaults: false, graph: false, collections: false, entities: false, citations: false },
  };
}

/**
 * Filter objects that should be included in the static export.
 * Mirrors the public/internal + language filtering used by sitemap & route resolvers.
 */
export function filterStaticExportObjects(input: {
  objects: KnowledgeObject[];
  visibility?: "public" | "internal";
  language?: string;
}): KnowledgeObject[] {
  const mode = input.visibility ?? "public";
  const language = input.language;

  return input.objects.filter((object) => {
    if (!object) return false;

    const vis = (object.metadata as { visibility?: string } | undefined)?.visibility;
    const PRIVATE_HIDDEN = new Set(["private", "hidden"]);
    if (vis && PRIVATE_HIDDEN.has(vis)) return false;

    if (mode === "public") {
      if (object.status !== "published") return false;
      if (vis && vis !== "public") return false;
    } else {
      const allowed: ReadonlySet<KnowledgeStatus> = new Set<KnowledgeStatus>([
        "draft", "review", "published", "archived",
      ]);
      if (!allowed.has(object.status)) return false;
    }

    if (language && object.language !== language) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// generateStaticExport — main orchestration
// ---------------------------------------------------------------------------

/**
 * Generate a full in-memory static export bundle from validated knowledge.
 *
 * This is the assembly layer: it calls renderers and generators that were built
 * in prior sprints, wraps their outputs into StaticExportAssets, and produces
 * a bundle with a manifest and diagnostics.
 *
 * It never writes files to disk.
 */
export function generateStaticExport(input: GenerateStaticExportInput): StaticExportBundle {
  const generatedAt = new Date().toISOString();
  const diagnostics: StaticExportDiagnostic[] = [];
  let counter = 0;

  const visibility = input.visibility ?? "public";

  // 1. Filter exportable objects.
  const filtered = filterStaticExportObjects({
    objects: input.objects,
    visibility,
    language: input.language,
  });

  // Emit diagnostics for excluded objects.
  const filteredIds = new Set(filtered.map((o) => o.id));
  for (const obj of input.objects) {
    if (!filteredIds.has(obj.id)) {
      diagnostics.push({
        id: `export-diag-${counter++}`,
        severity: "info",
        code: GC_EXPORT_OBJECT_EXCLUDED,
        message: `Object "${obj.id}" excluded from static export.`,
        sourceId: obj.id,
      });
    }
  }

  if (input.objects.length === 0) {
    diagnostics.push({
      id: `export-diag-${counter++}`,
      severity: "warning",
      code: GC_EXPORT_NO_OBJECTS,
      message: "No objects provided for static export.",
    });
  }

  // Build a route lookup for path resolution.
  const routeMap = new Map<string, string>();
  if (input.routes) {
    for (const route of input.routes.routes) {
      routeMap.set(route.sourceId, route.path);
    }
  }

  const assets: StaticExportAsset[] = [];

  // Flags — all default to true.
  const includeMarkdown = input.includeMarkdown ?? true;
  const includeJson = input.includeJson ?? true;
  const includeJsonLd = input.includeJsonLd ?? true;
  const includeSearchIndex = input.includeSearchIndex ?? true;
  const includeLlmsTxt = input.includeLlmsTxt ?? true;
  const includeLlmsFullTxt = input.includeLlmsFullTxt ?? true;
  const includeSitemap = input.includeSitemap ?? true;

  // 2-5. Per-object assets (Markdown, JSON, JSON-LD).
  for (const obj of filtered) {
    const routePath = routeMap.get(obj.id);
    const meta = input.metadata?.[obj.id];

    const rendererInput = createRendererInputForExport({
      object: obj,
      metadata: meta,
      relationships: input.relationships,
      entities: input.entities,
      collections: input.collections,
      citations: input.citations,
      media: input.media,
    });

    // Markdown
    if (includeMarkdown) {
      const output = normalizeRendererOutput(markdownRenderer.render(rendererInput));
      const path = createExportPath({ type: "markdown", routePath, slug: obj.slug, language: obj.language });
      assets.push(makeAsset({
        type: "markdown",
        path,
        content: output.content,
        sourceIds: [obj.id],
        visibility,
        generatedAt,
      }));
    }

    // JSON
    if (includeJson) {
      const output = normalizeRendererOutput(jsonRenderer.render(rendererInput));
      const path = createExportPath({ type: "json", routePath, slug: obj.slug, language: obj.language });
      assets.push(makeAsset({
        type: "json",
        path,
        content: output.content,
        sourceIds: [obj.id],
        visibility,
        generatedAt,
      }));
    }

    // JSON-LD
    if (includeJsonLd) {
      const schemaOutput = generateJsonLd({
        object: obj,
        metadata: meta,
        relationships: input.relationships,
        entities: input.entities,
        collections: input.collections,
        citations: input.citations,
        sources: input.sources,
        media: input.media,
      });
      const path = createExportPath({ type: "json-ld", routePath, slug: obj.slug, language: obj.language });
      assets.push(makeAsset({
        type: "json-ld",
        path,
        content: schemaOutput.jsonLd as unknown as Record<string, unknown>,
        sourceIds: [obj.id],
        visibility,
        generatedAt,
      }));
    }

    // Warn when no route is available.
    if (!routePath) {
      diagnostics.push({
        id: `export-diag-${counter++}`,
        severity: "warning",
        code: GC_EXPORT_ROUTE_MISSING,
        message: `No route found for object "${obj.id}". Using slug/language fallback.`,
        sourceId: obj.id,
      });
    }
  }

  // 6. Search index
  if (includeSearchIndex && filtered.length > 0) {
    const searchIndex = generateSearchIndex({
      id: `${input.id}_search`,
      name: input.siteName,
      objects: filtered,
      metadata: input.metadata,
      relationships: input.relationships,
      entities: input.entities,
      collections: input.collections,
      citations: input.citations,
      media: input.media,
      visibility,
      language: input.language,
    });
    assets.push(makeAsset({
      type: "search-index",
      path: "search-index.json",
      content: searchIndex as unknown as Record<string, unknown>,
      sourceIds: filtered.map((o) => o.id),
      visibility,
      generatedAt,
    }));
  }

  // 7. LLMs.txt
  if (includeLlmsTxt && filtered.length > 0) {
    const llmsOutput = generateLlmsTxt({
      id: `${input.id}_llms`,
      siteName: input.siteName,
      siteUrl: input.siteUrl,
      language: input.language,
      objects: filtered,
      metadata: input.metadata,
      relationships: input.relationships,
      entities: input.entities,
      collections: input.collections,
      citations: input.citations,
      sources: input.sources,
    });
    assets.push(makeAsset({
      type: "llms",
      path: "llms.txt",
      content: llmsOutput.content,
      sourceIds: llmsOutput.sourceObjectIds,
      visibility,
      generatedAt,
    }));
  }

  // 8. LLMs-full.txt
  if (includeLlmsFullTxt && filtered.length > 0) {
    const llmsOutput = generateLlmsFullTxt({
      id: `${input.id}_llms-full`,
      siteName: input.siteName,
      siteUrl: input.siteUrl,
      language: input.language,
      objects: filtered,
      metadata: input.metadata,
      relationships: input.relationships,
      entities: input.entities,
      collections: input.collections,
      citations: input.citations,
      sources: input.sources,
    });
    assets.push(makeAsset({
      type: "llms-full",
      path: "llms-full.txt",
      content: llmsOutput.content,
      sourceIds: llmsOutput.sourceObjectIds,
      visibility,
      generatedAt,
    }));
  }

  // 9. Sitemap
  if (includeSitemap && filtered.length > 0) {
    const sitemapOutput = generateSitemap({
      id: `${input.id}_sitemap`,
      siteUrl: input.siteUrl,
      language: input.language,
      objects: filtered,
      metadata: input.metadata,
      media: input.media,
      visibility,
    });
    assets.push(makeAsset({
      type: "sitemap",
      path: "sitemap.xml",
      content: sitemapOutput.xml,
      sourceIds: filtered.map((o) => o.id),
      visibility,
      generatedAt,
    }));
  }

  // 10. Build the bundle (without manifest first), then generate manifest.
  const bundleWithoutManifest: Omit<StaticExportBundle, "manifest"> = {
    id: input.id,
    siteName: input.siteName,
    siteUrl: input.siteUrl,
    language: input.language,
    assets,
    generatedAt,
    diagnostics,
  };

  const manifest = createStaticExportManifest(bundleWithoutManifest);

  // 11. Create the manifest asset.
  assets.push(makeAsset({
    type: "manifest",
    path: "manifest.json",
    content: manifest as unknown as Record<string, unknown>,
    sourceIds: [],
    visibility,
    generatedAt,
  }));

  return {
    ...bundleWithoutManifest,
    manifest,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * The renderer contract permits Promise<RendererOutput> for async renderers.
 * The bundled markdown/json renderers are synchronous; this helper asserts the
 * sync case so the exporter stays a pure, non-async function.
 */
function normalizeRendererOutput(output: RendererOutput | Promise<RendererOutput>): RendererOutput {
  if (output instanceof Promise) {
    throw new Error("Async renderer outputs are not supported by the synchronous static exporter.");
  }
  return output;
}

function makeAsset(input: {
  type: StaticExportAsset["type"];
  path: string;
  content: string | Record<string, unknown>;
  sourceIds: string[];
  visibility: StaticExportAsset["visibility"];
  generatedAt: string;
}): StaticExportAsset {
  const { type, path, content, sourceIds, visibility, generatedAt } = input;
  return {
    id: createStaticExportAssetId(type, path),
    type,
    path,
    content,
    mimeType: getMimeTypeForExportType(type),
    encoding: "utf-8",
    sourceIds,
    visibility,
    generatedAt,
    diagnostics: [],
  };
}
