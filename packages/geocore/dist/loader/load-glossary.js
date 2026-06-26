import { isRecord, createLoaderDiagnostic, createIsoTimestamp } from "./loader-utils.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Loads a GlossaryEntry from raw knowledge input.
 */
export function loadGlossaryEntry(input) {
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
            message: "Raw input content for GlossaryEntry must be an object.",
            sourcePath: input.sourcePath,
            inputId: input.id,
        }));
        return { diagnostics };
    }
    const inputId = content.id || input.id;
    if (!content.id) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_GLOSSARY_MISSING_ID,
            message: "Glossary Entry is missing 'id'.",
            sourcePath: input.sourcePath,
            inputId: inputId,
            field: "id",
        }));
    }
    const requiredFields = ["term", "slug", "definition", "language", "status", "audience"];
    requiredFields.forEach((field) => {
        if (!content[field]) {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
                message: `Glossary Entry is missing required field '${field}'.`,
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
    const glossaryEntry = {
        createdAt: now,
        updatedAt: now,
        ...content,
    };
    return { glossaryEntry, diagnostics };
}
