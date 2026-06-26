import { RunValidationPipelineInput } from "../types/validation-pipeline.js";
import { ValidationPipelineReport, ValidationPipelineMode } from "../types/validation-report.js";
import { ValidationPipelineStageResult, ValidationPipelineStageId } from "../types/validation-stage.js";
import { DEFAULT_VALIDATION_PIPELINE_CONFIG } from "./pipeline-config.js";
import { createValidationPipelineReport } from "./pipeline-report.js";
import { createValidationStageResult } from "./pipeline-utils.js";
import * as stages from "./pipeline-stages.js";
import * as codes from "../validation/validation-codes.js";
import { GraphNode, GraphNodeType } from "../types/graph.js";
import { createGraphRegistry } from "../graph/graph-registry.js";
import { resolveMetadata } from "../metadata/resolve-metadata.js";
import { resolveRoutes } from "../routing/route-registry.js";
import { generateStaticExport } from "../export/static-exporter.js";
import { ResolvedMetadata } from "../types/metadata.js";

export function runValidationPipeline(
  input: RunValidationPipelineInput
): ValidationPipelineReport {
  const startedAt = new Date().toISOString();

  const configMode = input.config?.mode ?? DEFAULT_VALIDATION_PIPELINE_CONFIG.mode;
  const configFailFast = input.config?.failFast ?? DEFAULT_VALIDATION_PIPELINE_CONFIG.failFast;
  const configRequiredStages = input.config?.requiredStages ?? DEFAULT_VALIDATION_PIPELINE_CONFIG.requiredStages;
  const configStages = {
    ...DEFAULT_VALIDATION_PIPELINE_CONFIG.stages,
    ...input.config?.stages,
  };

  const resolvedMetadata: Record<string, ResolvedMetadata> = { ...input.metadata };
  const nodes: GraphNode[] = [];
  const seenIds = new Set<string>();
  const addNode = (id: string, type: GraphNodeType, label?: string) => {
    if (!id || seenIds.has(id)) return;
    seenIds.add(id);
    nodes.push({ id, type, label });
  };
  for (const obj of input.dataset.objects || []) {
    addNode(obj.id, "knowledge-object", obj.title);
  }
  for (const ent of input.dataset.entities || []) {
    addNode(ent.id, "entity", ent.canonicalName);
  }
  for (const col of input.dataset.collections || []) {
    addNode(col.id, "collection", col.title);
  }
  for (const cit of input.dataset.citations || []) {
    addNode(cit.id, "citation", cit.id);
  }
  const graph = createGraphRegistry(nodes, input.dataset.relationships || []);

  for (const obj of input.dataset.objects || []) {
    if (!resolvedMetadata[obj.id]) {
      resolvedMetadata[obj.id] = resolveMetadata({
        object: obj,
        graph,
        collections: input.dataset.collections,
        entities: input.dataset.entities,
        citations: input.dataset.citations,
      });
    }
  }

  const resolvedRoutes = input.routes || resolveRoutes({
    id: "routes-registry",
    siteUrl: input.config?.siteUrl,
    objects: input.dataset.objects,
    metadata: resolvedMetadata,
    collections: input.dataset.collections,
    glossaryEntries: input.dataset.glossaryEntries,
    media: input.dataset.media,
    language: input.config?.language,
    visibility: configMode,
  });

  const resolvedStaticExport = input.staticExport || generateStaticExport({
    id: "static-export-bundle",
    siteName: input.config?.siteName || "GeoCore Site",
    siteUrl: input.config?.siteUrl,
    language: input.config?.language,
    objects: input.dataset.objects,
    metadata: resolvedMetadata,
    relationships: input.dataset.relationships,
    entities: input.dataset.entities,
    collections: input.dataset.collections,
    citations: input.dataset.citations,
    sources: input.dataset.sources,
    media: input.dataset.media,
    routes: resolvedRoutes,
    visibility: configMode,
  });

  const order: ValidationPipelineStageId[] = [
    "dataset",
    "knowledge-objects",
    "relationships",
    "metadata",
    "routes",
    "search",
    "schema",
    "llms",
    "sitemap",
    "static-export",
  ];

  const results: ValidationPipelineStageResult[] = [];
  let stopRunning = false;

  for (const stageId of order) {
    const isEnabled = configStages[stageId] ?? false;
    const isRequired = configRequiredStages.includes(stageId);

    if (stopRunning) {
      results.push(createValidationStageResult({ id: stageId, skipped: true }));
      continue;
    }

    if (!isEnabled) {
      if (isRequired) {
        results.push(createValidationStageResult({
          id: stageId,
          issues: [
            {
              id: `${codes.GC_PIPELINE_STAGE_REQUIRED_SKIPPED}_${stageId}`,
              severity: "error",
              code: codes.GC_PIPELINE_STAGE_REQUIRED_SKIPPED,
              message: `Required stage '${stageId}' was disabled or skipped in config.`,
            },
          ],
        }));
        if (configFailFast) {
          stopRunning = true;
        }
      } else {
        results.push(createValidationStageResult({ id: stageId, skipped: true }));
      }
      continue;
    }

    let result: ValidationPipelineStageResult;

    try {
      if (stageId === "dataset") {
        result = stages.runDatasetValidationStage(input.dataset);
      } else if (stageId === "knowledge-objects") {
        result = stages.runKnowledgeObjectsValidationStage(input.dataset);
      } else if (stageId === "relationships") {
        result = stages.runRelationshipsValidationStage(input.dataset);
      } else if (stageId === "metadata") {
        result = stages.runMetadataValidationStage({
          dataset: input.dataset,
          metadata: resolvedMetadata,
        });
      } else if (stageId === "routes") {
        result = stages.runRoutesValidationStage({
          dataset: input.dataset,
          metadata: resolvedMetadata,
          routes: resolvedRoutes,
          siteUrl: input.config?.siteUrl,
          language: input.config?.language,
          mode: configMode,
        });
      } else if (stageId === "search") {
        result = stages.runSearchValidationStage({
          dataset: input.dataset,
          metadata: resolvedMetadata,
          language: input.config?.language,
          mode: configMode,
        });
      } else if (stageId === "schema") {
        result = stages.runSchemaValidationStage({
          dataset: input.dataset,
          metadata: resolvedMetadata,
          mode: configMode,
        });
      } else if (stageId === "llms") {
        result = stages.runLlmsValidationStage({
          dataset: input.dataset,
          metadata: resolvedMetadata,
          siteName: input.config?.siteName,
          siteUrl: input.config?.siteUrl,
          language: input.config?.language,
        });
      } else if (stageId === "sitemap") {
        result = stages.runSitemapValidationStage({
          dataset: input.dataset,
          metadata: resolvedMetadata,
          siteUrl: input.config?.siteUrl,
          language: input.config?.language,
        });
      } else {
        result = stages.runStaticExportValidationStage({
          dataset: input.dataset,
          metadata: resolvedMetadata,
          routes: resolvedRoutes,
          staticExport: resolvedStaticExport,
          siteName: input.config?.siteName,
          siteUrl: input.config?.siteUrl,
          language: input.config?.language,
          mode: configMode,
        });
      }
    } catch (err: any) {
      let code = codes.GC_METADATA_INVALID;
      if (stageId === "dataset") code = codes.GC_PIPELINE_DATASET_INVALID;
      else if (stageId === "knowledge-objects") code = codes.GC_PIPELINE_KNOWLEDGE_OBJECTS_INVALID;
      else if (stageId === "relationships") code = codes.GC_PIPELINE_RELATIONSHIPS_INVALID;
      else if (stageId === "metadata") code = codes.GC_PIPELINE_METADATA_INVALID;
      else if (stageId === "routes") code = codes.GC_PIPELINE_ROUTES_INVALID;
      else if (stageId === "search") code = codes.GC_PIPELINE_SEARCH_INVALID;
      else if (stageId === "schema") code = codes.GC_PIPELINE_SCHEMA_INVALID;
      else if (stageId === "llms") code = codes.GC_PIPELINE_LLMS_INVALID;
      else if (stageId === "sitemap") code = codes.GC_PIPELINE_SITEMAP_INVALID;
      else if (stageId === "static-export") code = codes.GC_PIPELINE_STATIC_EXPORT_INVALID;

      result = createValidationStageResult({
        id: stageId,
        issues: [
          {
            id: `crash_${stageId}`,
            severity: "critical",
            code,
            message: `Stage '${stageId}' failed with error: ${err.message || String(err)}`,
          },
        ],
      });
    }

    results.push(result);

    if (configFailFast && !result.valid) {
      stopRunning = true;
    }
  }

  const finishedAt = new Date().toISOString();

  return createValidationPipelineReport({
    datasetId: input.dataset.id,
    mode: configMode,
    stages: results,
    startedAt,
    finishedAt,
    language: input.config?.language,
  });
}
