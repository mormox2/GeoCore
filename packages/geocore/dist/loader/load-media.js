import { isRecord, createLoaderDiagnostic, createIsoTimestamp } from "./loader-utils.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Loads a MediaAsset from raw knowledge input.
 */
export function loadMediaAsset(input) {
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
            message: "Raw input content for MediaAsset must be an object.",
            sourcePath: input.sourcePath,
            inputId: input.id,
        }));
        return { diagnostics };
    }
    const inputId = content.id || input.id;
    if (!content.id) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_MEDIA_MISSING_ID,
            message: "Media Asset is missing 'id'.",
            sourcePath: input.sourcePath,
            inputId: inputId,
            field: "id",
        }));
    }
    const requiredFields = ["type", "title", "status", "source", "visibility"];
    requiredFields.forEach((field) => {
        if (!content[field]) {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
                message: `Media Asset is missing required field '${field}'.`,
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
    const media = {
        createdAt: now,
        updatedAt: now,
        ...content,
    };
    return { media, diagnostics };
}
