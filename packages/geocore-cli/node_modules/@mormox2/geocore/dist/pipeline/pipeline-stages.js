import { validateKnowledgeDataset } from "../loader/validate-knowledge-dataset.js";
import { validateKnowledgeObject } from "../validation/validate-knowledge-object.js";
import { createGraphRegistry } from "../graph/graph-registry.js";
import { validateRelationships } from "../graph/validate-relationships.js";
import { resolveMetadata } from "../metadata/resolve-metadata.js";
import { validateMetadata } from "../metadata/validate-metadata.js";
import { resolveRoutes } from "../routing/route-registry.js";
import { validateRouteRegistry } from "../routing/validate-route-registry.js";
import { generateSearchIndex } from "../search/search-index-generator.js";
import { generateJsonLd } from "../schema/json-ld-generator.js";
import { generateLlmsTxt } from "../llms/llms-generator.js";
import { generateLlmsFullTxt } from "../llms/llms-full-generator.js";
import { generateSitemap } from "../sitemap/sitemap-generator.js";
import { generateStaticExport } from "../export/static-exporter.js";
import { validateStaticExportBundle } from "../export/validate-static-export-bundle.js";
import { createValidationStageResult } from "./pipeline-utils.js";
import { normalizeValidationIssues } from "./normalize-validation-issues.js";
export function runDatasetValidationStage(dataset) {
    const startedAt = new Date().toISOString();
    const result = validateKnowledgeDataset(dataset);
    const finishedAt = new Date().toISOString();
    const issues = normalizeValidationIssues(result.issues, { stageId: "dataset" });
    return createValidationStageResult({
        id: "dataset",
        issues,
        startedAt,
        finishedAt,
    });
}
export function runKnowledgeObjectsValidationStage(dataset) {
    const startedAt = new Date().toISOString();
    const issues = [];
    for (const obj of dataset.objects || []) {
        const result = validateKnowledgeObject(obj);
        const objIssues = normalizeValidationIssues(result.issues, {
            stageId: "knowledge-objects",
            sourceId: obj.id,
        });
        issues.push(...objIssues);
    }
    const finishedAt = new Date().toISOString();
    return createValidationStageResult({
        id: "knowledge-objects",
        issues,
        startedAt,
        finishedAt,
    });
}
export function runRelationshipsValidationStage(dataset) {
    const startedAt = new Date().toISOString();
    const nodes = [];
    const seenIds = new Set();
    const addNode = (id, type, label) => {
        if (!id || seenIds.has(id))
            return;
        seenIds.add(id);
        nodes.push({ id, type, label });
    };
    for (const obj of dataset.objects || []) {
        addNode(obj.id, "knowledge-object", obj.title);
        if (obj.author) {
            addNode(obj.author, "author", obj.author);
        }
    }
    for (const ent of dataset.entities || []) {
        addNode(ent.id, "entity", ent.canonicalName);
    }
    for (const col of dataset.collections || []) {
        addNode(col.id, "collection", col.title);
    }
    for (const term of dataset.taxonomyTerms || []) {
        addNode(term.id, "taxonomy-term", typeof term.label === "string" ? term.label : term.slug);
    }
    for (const entry of dataset.glossaryEntries || []) {
        addNode(entry.id, "glossary-entry", entry.term);
    }
    for (const src of dataset.sources || []) {
        addNode(src.id, "source", src.title);
    }
    for (const cit of dataset.citations || []) {
        addNode(cit.id, "citation", cit.id);
    }
    for (const media of dataset.media || []) {
        addNode(media.id, "media", media.title);
    }
    const graph = createGraphRegistry(nodes, dataset.relationships || []);
    const result = validateRelationships(graph);
    const finishedAt = new Date().toISOString();
    const issues = normalizeValidationIssues(result.issues, { stageId: "relationships" });
    return createValidationStageResult({
        id: "relationships",
        issues,
        startedAt,
        finishedAt,
    });
}
export function runMetadataValidationStage(input) {
    const startedAt = new Date().toISOString();
    const issues = [];
    const metadataMap = { ...input.metadata };
    const nodes = [];
    const seenIds = new Set();
    const addNode = (id, type, label) => {
        if (!id || seenIds.has(id))
            return;
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
    const context = {
        entities: (input.dataset.entities || []).map((e) => e.id),
        collections: (input.dataset.collections || []).map((c) => c.id),
        citations: (input.dataset.citations || []).map((c) => c.id),
    };
    for (const obj of input.dataset.objects || []) {
        let resolved = metadataMap[obj.id];
        if (!resolved) {
            resolved = resolveMetadata({
                object: obj,
                graph,
                collections: input.dataset.collections,
                entities: input.dataset.entities,
                citations: input.dataset.citations,
            });
            metadataMap[obj.id] = resolved;
        }
        const validation = validateMetadata(resolved, context);
        const metaIssues = normalizeValidationIssues(validation.issues, {
            stageId: "metadata",
            sourceId: obj.id,
        });
        issues.push(...metaIssues);
    }
    const finishedAt = new Date().toISOString();
    return createValidationStageResult({
        id: "metadata",
        issues,
        startedAt,
        finishedAt,
    });
}
export function runRoutesValidationStage(input) {
    const startedAt = new Date().toISOString();
    const mode = input.mode ?? "public";
    const routes = input.routes || resolveRoutes({
        id: "routes-registry",
        siteUrl: input.siteUrl,
        objects: input.dataset.objects,
        metadata: input.metadata,
        collections: input.dataset.collections,
        glossaryEntries: input.dataset.glossaryEntries,
        media: input.dataset.media,
        language: input.language,
        visibility: mode,
    });
    const validation = validateRouteRegistry(routes);
    const finishedAt = new Date().toISOString();
    const issues = normalizeValidationIssues(validation.issues, { stageId: "routes" });
    return createValidationStageResult({
        id: "routes",
        issues,
        startedAt,
        finishedAt,
    });
}
export function runSearchValidationStage(input) {
    const startedAt = new Date().toISOString();
    const mode = input.mode ?? "public";
    const searchIndex = generateSearchIndex({
        id: "search-index",
        name: "search-index",
        objects: input.dataset.objects,
        metadata: input.metadata,
        relationships: input.dataset.relationships,
        entities: input.dataset.entities,
        collections: input.dataset.collections,
        citations: input.dataset.citations,
        media: input.dataset.media,
        visibility: mode,
        language: input.language,
    });
    const issues = (searchIndex.diagnostics || []).map((diag, index) => ({
        id: diag.id || `search-issue-${index}`,
        severity: diag.severity,
        code: diag.code,
        message: diag.message,
        objectId: diag.sourceId ?? diag.documentId,
        field: diag.field,
        recommendation: diag.recommendation,
    }));
    const finishedAt = new Date().toISOString();
    const normalized = normalizeValidationIssues(issues, { stageId: "search" });
    return createValidationStageResult({
        id: "search",
        issues: normalized,
        startedAt,
        finishedAt,
    });
}
export function runSchemaValidationStage(input) {
    const startedAt = new Date().toISOString();
    const mode = input.mode ?? "public";
    const issues = [];
    const eligibleObjects = input.dataset.objects.filter((obj) => {
        const meta = input.metadata?.[obj.id];
        const status = meta?.status ?? obj.status;
        if (mode === "public") {
            return status === "published";
        }
        return ["draft", "review", "published", "archived"].includes(status);
    });
    for (const obj of eligibleObjects) {
        const schemaOutput = generateJsonLd({
            object: obj,
            metadata: input.metadata?.[obj.id],
            relationships: input.dataset.relationships,
            entities: input.dataset.entities,
            collections: input.dataset.collections,
            citations: input.dataset.citations,
            sources: input.dataset.sources,
            media: input.dataset.media,
        });
        const objIssues = (schemaOutput.diagnostics || []).map((diag, index) => ({
            id: diag.id || `schema-issue-${obj.id}-${index}`,
            severity: diag.severity,
            code: diag.code,
            message: diag.message,
            objectId: diag.sourceId ?? schemaOutput.sourceId,
            field: diag.field,
            recommendation: diag.recommendation,
        }));
        issues.push(...objIssues);
    }
    const finishedAt = new Date().toISOString();
    const normalized = normalizeValidationIssues(issues, { stageId: "schema" });
    return createValidationStageResult({
        id: "schema",
        issues: normalized,
        startedAt,
        finishedAt,
    });
}
export function runLlmsValidationStage(input) {
    const startedAt = new Date().toISOString();
    const llmsInput = {
        id: `llms-${input.dataset.id}`,
        siteName: input.siteName || "GeoCore Site",
        siteUrl: input.siteUrl,
        language: input.language,
        objects: input.dataset.objects,
        metadata: input.metadata,
        relationships: input.dataset.relationships,
        entities: input.dataset.entities,
        collections: input.dataset.collections,
        citations: input.dataset.citations,
        sources: input.dataset.sources,
    };
    const llmsTxt = generateLlmsTxt(llmsInput);
    const llmsFullTxt = generateLlmsFullTxt(llmsInput);
    const issues = [
        ...(llmsTxt.diagnostics || []),
        ...(llmsFullTxt.diagnostics || []),
    ].map((diag, index) => ({
        id: diag.id || `llms-issue-${index}`,
        severity: diag.severity,
        code: diag.code,
        message: diag.message,
        objectId: diag.objectId,
        field: diag.field,
        recommendation: diag.recommendation,
    }));
    const finishedAt = new Date().toISOString();
    const normalized = normalizeValidationIssues(issues, { stageId: "llms" });
    return createValidationStageResult({
        id: "llms",
        issues: normalized,
        startedAt,
        finishedAt,
    });
}
export function runSitemapValidationStage(input) {
    const startedAt = new Date().toISOString();
    const sitemapInput = {
        id: "sitemap",
        siteUrl: input.siteUrl,
        language: input.language,
        objects: input.dataset.objects,
        metadata: input.metadata,
        media: input.dataset.media,
    };
    const sitemapOutput = generateSitemap(sitemapInput);
    const issues = (sitemapOutput.diagnostics || []).map((diag, index) => ({
        id: diag.id || `sitemap-issue-${index}`,
        severity: diag.severity,
        code: diag.code,
        message: diag.message,
        objectId: diag.sourceId,
        field: diag.field,
        recommendation: diag.recommendation,
    }));
    const finishedAt = new Date().toISOString();
    const normalized = normalizeValidationIssues(issues, { stageId: "sitemap" });
    return createValidationStageResult({
        id: "sitemap",
        issues: normalized,
        startedAt,
        finishedAt,
    });
}
export function runStaticExportValidationStage(input) {
    const startedAt = new Date().toISOString();
    const mode = input.mode ?? "public";
    const bundle = input.staticExport || generateStaticExport({
        id: "static-export-bundle",
        siteName: input.siteName || "GeoCore Site",
        siteUrl: input.siteUrl,
        language: input.language,
        objects: input.dataset.objects,
        metadata: input.metadata,
        relationships: input.dataset.relationships,
        entities: input.dataset.entities,
        collections: input.dataset.collections,
        citations: input.dataset.citations,
        sources: input.dataset.sources,
        media: input.dataset.media,
        routes: input.routes,
        visibility: mode,
    });
    const validation = validateStaticExportBundle(bundle, mode);
    const finishedAt = new Date().toISOString();
    const issues = normalizeValidationIssues(validation.issues, { stageId: "static-export" });
    return createValidationStageResult({
        id: "static-export",
        issues,
        startedAt,
        finishedAt,
    });
}
