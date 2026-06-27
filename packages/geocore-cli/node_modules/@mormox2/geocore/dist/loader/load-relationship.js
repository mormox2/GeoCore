import { isRecord, createLoaderDiagnostic, createIsoTimestamp } from "./loader-utils.js";
import { knowledgeRelationshipSchema } from "../schemas/relationship.schema.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Loads a KnowledgeRelationship from raw knowledge input.
 */
export function loadRelationship(input) {
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
            message: "Raw input content for KnowledgeRelationship must be an object.",
            sourcePath: input.sourcePath,
            inputId: input.id,
        }));
        return { diagnostics };
    }
    const inputId = content.id || input.id;
    if (!content.id) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
            message: "Relationship is missing 'id'.",
            sourcePath: input.sourcePath,
            inputId: inputId,
            field: "id",
        }));
    }
    const requiredFields = ["sourceId", "targetId", "type", "strength"];
    requiredFields.forEach((field) => {
        if (!content[field]) {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
                message: `Relationship is missing required field '${field}'.`,
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
    const relationship = {
        createdAt: now,
        updatedAt: now,
        ...content,
    };
    // Run schema validation
    const zodResult = knowledgeRelationshipSchema.safeParse(relationship);
    if (!zodResult.success) {
        zodResult.error.issues.forEach((zodIssue) => {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
                message: `Relationship schema error: ${zodIssue.message}`,
                sourcePath: input.sourcePath,
                inputId: inputId,
                field: zodIssue.path.join("."),
            }));
        });
        return { diagnostics };
    }
    return { relationship, diagnostics };
}
