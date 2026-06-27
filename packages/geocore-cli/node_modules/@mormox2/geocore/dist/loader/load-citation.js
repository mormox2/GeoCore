import { isRecord, createLoaderDiagnostic, createIsoTimestamp } from "./loader-utils.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Loads a KnowledgeSource from raw knowledge input.
 */
export function loadSource(input) {
    const diagnostics = [];
    const content = input.content;
    if (content === undefined || content === null) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_INPUT_CONTENT_MISSING,
            message: "Raw input content is missing.",
            sourcePath: input.sourcePath,
            inputId: input.id,
        }));
        return { diagnostics };
    }
    if (!isRecord(content)) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
            message: "Raw input content for KnowledgeSource must be an object.",
            sourcePath: input.sourcePath,
            inputId: input.id,
        }));
        return { diagnostics };
    }
    const inputId = content.id || input.id;
    if (!content.id) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_SOURCE_MISSING_ID,
            message: "Source is missing 'id'.",
            sourcePath: input.sourcePath,
            inputId: inputId,
            field: "id",
        }));
    }
    const requiredFields = ["type", "title", "status"];
    requiredFields.forEach((field) => {
        if (!content[field]) {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
                message: `Source is missing required field '${field}'.`,
                sourcePath: input.sourcePath,
                inputId: inputId,
                field,
            }));
        }
    });
    const hasErrors = !content.id || requiredFields.some((f) => !content[f]);
    if (hasErrors) {
        return { diagnostics };
    }
    const now = createIsoTimestamp();
    const source = {
        createdAt: now,
        updatedAt: now,
        ...content,
    };
    return { source, diagnostics };
}
/**
 * Loads a KnowledgeCitation from raw knowledge input.
 */
export function loadCitation(input) {
    const diagnostics = [];
    const content = input.content;
    if (content === undefined || content === null) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_INPUT_CONTENT_MISSING,
            message: "Raw input content is missing.",
            sourcePath: input.sourcePath,
            inputId: input.id,
        }));
        return { diagnostics };
    }
    if (!isRecord(content)) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
            message: "Raw input content for KnowledgeCitation must be an object.",
            sourcePath: input.sourcePath,
            inputId: input.id,
        }));
        return { diagnostics };
    }
    const inputId = content.id || input.id;
    if (!content.id) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_CITATION_MISSING_ID,
            message: "Citation is missing 'id'.",
            sourcePath: input.sourcePath,
            inputId: inputId,
            field: "id",
        }));
    }
    const requiredFields = ["sourceId", "targetId", "purpose", "status"];
    requiredFields.forEach((field) => {
        if (!content[field]) {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
                message: `Citation is missing required field '${field}'.`,
                sourcePath: input.sourcePath,
                inputId: inputId,
                field,
            }));
        }
    });
    const hasErrors = !content.id || requiredFields.some((f) => !content[f]);
    if (hasErrors) {
        return { diagnostics };
    }
    const now = createIsoTimestamp();
    const citation = {
        createdAt: now,
        updatedAt: now,
        ...content,
    };
    return { citation, diagnostics };
}
