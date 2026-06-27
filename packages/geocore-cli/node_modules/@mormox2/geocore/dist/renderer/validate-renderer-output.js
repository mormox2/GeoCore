import { rendererOutputSchema } from "../schemas/renderer-output.schema.js";
import * as codes from "../validation/validation-codes.js";
export function validateRendererOutput(output) {
    const checkedAt = new Date().toISOString();
    const issues = [];
    if (!output || typeof output !== "object") {
        return {
            valid: false,
            publishable: false,
            checkedAt,
            issues: [
                {
                    id: `${codes.GC_METADATA_INVALID}_OUTPUT_ROOT`,
                    severity: "critical",
                    code: codes.GC_METADATA_INVALID,
                    message: "RendererOutput must be a non-null object",
                },
            ],
        };
    }
    // Zod Validation
    const zodResult = rendererOutputSchema.safeParse(output);
    if (!zodResult.success) {
        zodResult.error.issues.forEach((zodIssue, index) => {
            const field = zodIssue.path.join(".");
            let code = codes.GC_METADATA_INVALID;
            let severity = "error";
            if (field === "rendererId") {
                code = codes.GC_RENDERER_OUTPUT_RENDERER_ID_MISSING;
            }
            else if (field === "format") {
                code = codes.GC_RENDERER_OUTPUT_FORMAT_INVALID;
            }
            else if (field === "content") {
                code = codes.GC_RENDERER_OUTPUT_CONTENT_MISSING;
            }
            else if (field === "metadata") {
                code = codes.GC_RENDERER_OUTPUT_METADATA_MISSING;
            }
            else if (field === "metadata.generatedAt") {
                code = codes.GC_RENDERER_OUTPUT_GENERATED_AT_MISSING;
            }
            else if (field === "metadata.sourceObjectId") {
                code = codes.GC_RENDERER_OUTPUT_SOURCE_OBJECT_ID_MISSING;
            }
            else if (field === "metadata.sourceObjectVersion") {
                code = codes.GC_RENDERER_OUTPUT_SOURCE_VERSION_MISSING;
            }
            else if (field === "metadata.language") {
                code = codes.GC_RENDERER_OUTPUT_LANGUAGE_MISSING;
            }
            else if (field.startsWith("diagnostics")) {
                code = codes.GC_RENDERER_OUTPUT_DIAGNOSTICS_INVALID;
            }
            issues.push({
                id: `${code}_${field || "field"}_${index}`,
                severity,
                code,
                message: `Renderer output field '${field}' is invalid: ${zodIssue.message}`,
                objectId: output.metadata?.sourceObjectId,
                field: field || undefined,
            });
        });
    }
    const hasErrorsOrCritical = issues.some((issue) => issue.severity === "error" || issue.severity === "critical");
    return {
        valid: !hasErrorsOrCritical,
        publishable: !hasErrorsOrCritical,
        issues,
        checkedAt,
    };
}
