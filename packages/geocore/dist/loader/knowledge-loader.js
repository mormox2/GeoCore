import { createKnowledgeDatasetId, createLoaderDiagnostic, createIsoTimestamp, } from "./loader-utils.js";
import { loadKnowledgeObject } from "./load-knowledge-object.js";
import { loadMarkdownKnowledge } from "./load-markdown-knowledge.js";
import { loadEntity } from "./load-entity.js";
import { loadCollection } from "./load-collection.js";
import { loadTaxonomyTerm } from "./load-taxonomy.js";
import { loadGlossaryEntry } from "./load-glossary.js";
import { loadSource, loadCitation } from "./load-citation.js";
import { loadMediaAsset } from "./load-media.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Normalizes raw knowledge inputs into a unified KnowledgeDataset in memory.
 */
export function loadKnowledgeDataset(input) {
    const dataset = {
        id: createKnowledgeDatasetId(input.name),
        name: input.name,
        objects: [],
        entities: [],
        relationships: [],
        collections: [],
        taxonomyTerms: [],
        glossaryEntries: [],
        sources: [],
        citations: [],
        media: [],
        loadedAt: createIsoTimestamp(),
        diagnostics: [],
    };
    if (!input || !Array.isArray(input.inputs)) {
        dataset.diagnostics.push(createLoaderDiagnostic({
            severity: "critical",
            code: codes.GC_LOADER_INPUT_CONTENT_MISSING,
            message: "Loader input is missing or inputs is not an array.",
        }));
        return dataset;
    }
    for (const raw of input.inputs) {
        if (!raw)
            continue;
        switch (raw.type) {
            case "knowledge-object": {
                const { object, diagnostics: diags } = loadKnowledgeObject(raw);
                dataset.diagnostics.push(...diags);
                if (object)
                    dataset.objects.push(object);
                break;
            }
            case "markdown": {
                const { object, diagnostics: diags } = loadMarkdownKnowledge(raw);
                dataset.diagnostics.push(...diags);
                if (object)
                    dataset.objects.push(object);
                break;
            }
            case "entity": {
                const { entity, diagnostics: diags } = loadEntity(raw);
                dataset.diagnostics.push(...diags);
                if (entity)
                    dataset.entities.push(entity);
                break;
            }
            case "collection": {
                const { collection, diagnostics: diags } = loadCollection(raw);
                dataset.diagnostics.push(...diags);
                if (collection)
                    dataset.collections.push(collection);
                break;
            }
            case "taxonomy-term": {
                const { taxonomyTerm, diagnostics: diags } = loadTaxonomyTerm(raw);
                dataset.diagnostics.push(...diags);
                if (taxonomyTerm)
                    dataset.taxonomyTerms.push(taxonomyTerm);
                break;
            }
            case "glossary-entry": {
                const { glossaryEntry, diagnostics: diags } = loadGlossaryEntry(raw);
                dataset.diagnostics.push(...diags);
                if (glossaryEntry)
                    dataset.glossaryEntries.push(glossaryEntry);
                break;
            }
            case "citation": {
                const { citation, diagnostics: diags } = loadCitation(raw);
                dataset.diagnostics.push(...diags);
                if (citation)
                    dataset.citations.push(citation);
                break;
            }
            case "source": {
                const { source, diagnostics: diags } = loadSource(raw);
                dataset.diagnostics.push(...diags);
                if (source)
                    dataset.sources.push(source);
                break;
            }
            case "media": {
                const { media, diagnostics: diags } = loadMediaAsset(raw);
                dataset.diagnostics.push(...diags);
                if (media)
                    dataset.media.push(media);
                break;
            }
            default: {
                dataset.diagnostics.push(createLoaderDiagnostic({
                    severity: "error",
                    code: codes.GC_LOADER_INPUT_TYPE_INVALID,
                    message: `Raw input has invalid type '${raw.type}'.`,
                    sourcePath: raw.sourcePath,
                    inputId: raw.id,
                }));
            }
        }
    }
    // Perform duplicate detection
    const dupDiagnostics = detectDatasetDuplicates(dataset);
    dataset.diagnostics.push(...dupDiagnostics);
    return dataset;
}
/**
 * Detects duplicate IDs within categories and cross-category collisions.
 */
export function detectDatasetDuplicates(dataset) {
    const diagnostics = [];
    const categories = [
        { name: "objects", list: dataset.objects },
        { name: "entities", list: dataset.entities },
        { name: "collections", list: dataset.collections },
        { name: "taxonomyTerms", list: dataset.taxonomyTerms },
        { name: "glossaryEntries", list: dataset.glossaryEntries },
        { name: "sources", list: dataset.sources },
        { name: "citations", list: dataset.citations },
        { name: "media", list: dataset.media },
    ];
    const idToCategories = new Map();
    const reportedCategoryDuplicates = new Map();
    categories.forEach(({ name, list }) => {
        const seenInThisCategory = new Set();
        reportedCategoryDuplicates.set(name, new Set());
        list.forEach((item) => {
            if (!item || !item.id)
                return;
            const id = item.id;
            if (seenInThisCategory.has(id)) {
                const reported = reportedCategoryDuplicates.get(name);
                if (!reported.has(id)) {
                    reported.add(id);
                    diagnostics.push(createLoaderDiagnostic({
                        severity: "error",
                        code: codes.GC_LOADER_DUPLICATE_ID,
                        message: `Duplicate ID '${id}' found within category '${name}'.`,
                        inputId: id,
                    }));
                }
            }
            else {
                seenInThisCategory.add(id);
            }
            if (!idToCategories.has(id)) {
                idToCategories.set(id, new Set());
            }
            idToCategories.get(id).add(name);
        });
    });
    const reportedCrossTypeCollisions = new Set();
    for (const [id, cats] of idToCategories.entries()) {
        if (cats.size > 1 && !reportedCrossTypeCollisions.has(id)) {
            reportedCrossTypeCollisions.add(id);
            const catList = Array.from(cats).join(", ");
            diagnostics.push(createLoaderDiagnostic({
                severity: "warning",
                code: codes.GC_LOADER_CROSS_TYPE_ID_COLLISION,
                message: `Cross-type ID collision for '${id}' across categories: ${catList}.`,
                inputId: id,
            }));
        }
    }
    return diagnostics;
}
