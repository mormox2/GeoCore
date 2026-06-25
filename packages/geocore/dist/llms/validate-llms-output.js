import { llmsOutputSchema } from "../schemas/llms-output.schema.js";
import * as codes from "../validation/validation-codes.js";
/**
 * Validates the generated LLMs output structure, checking for empty strings
 * and internal leakage indicators.
 */
export function validateLlmsOutput(output) {
    const checkedAt = new Date().toISOString();
    const issues = [];
    if (!output || typeof output !== "object") {
        return {
            valid: false,
            publishable: false,
            checkedAt,
            issues: [
                {
                    id: `${codes.GC_LLMS_OUTPUT_ID_MISSING}_root`,
                    severity: "critical",
                    code: codes.GC_LLMS_OUTPUT_ID_MISSING,
                    message: "LLMs output must be a non-null object.",
                },
            ],
        };
    }
    // 1. Output ID
    if (!output.id || typeof output.id !== "string" || output.id.trim() === "") {
        issues.push({
            id: `${codes.GC_LLMS_OUTPUT_ID_MISSING}_id`,
            severity: "error",
            code: codes.GC_LLMS_OUTPUT_ID_MISSING,
            message: "LLMs output ID is missing.",
            field: "id",
        });
    }
    // 2. Type
    if (output.type !== "llms.txt" && output.type !== "llms-full.txt") {
        issues.push({
            id: `${codes.GC_LLMS_OUTPUT_TYPE_INVALID}_type`,
            severity: "error",
            code: codes.GC_LLMS_OUTPUT_TYPE_INVALID,
            message: "LLMs output type is invalid.",
            field: "type",
        });
    }
    // 3. Site Name
    if (!output.siteName || typeof output.siteName !== "string" || output.siteName.trim() === "") {
        issues.push({
            id: `${codes.GC_LLMS_SITE_NAME_MISSING}_siteName`,
            severity: "error",
            code: codes.GC_LLMS_SITE_NAME_MISSING,
            message: "LLMs output siteName is missing.",
            field: "siteName",
        });
    }
    // 4. Content
    if (!output.content || typeof output.content !== "string" || output.content.trim() === "") {
        issues.push({
            id: `${codes.GC_LLMS_CONTENT_MISSING}_content`,
            severity: "error",
            code: codes.GC_LLMS_CONTENT_MISSING,
            message: "LLMs output content is missing or empty.",
            field: "content",
        });
    }
    // 5. Generated At
    if (!output.generatedAt || typeof output.generatedAt !== "string" || output.generatedAt.trim() === "") {
        issues.push({
            id: `${codes.GC_LLMS_GENERATED_AT_MISSING}_generatedAt`,
            severity: "error",
            code: codes.GC_LLMS_GENERATED_AT_MISSING,
            message: "LLMs output generatedAt is missing.",
            field: "generatedAt",
        });
    }
    // 6. Source Object IDs
    if (!Array.isArray(output.sourceObjectIds)) {
        issues.push({
            id: `${codes.GC_LLMS_SOURCE_OBJECT_IDS_INVALID}_sourceObjectIds`,
            severity: "error",
            code: codes.GC_LLMS_SOURCE_OBJECT_IDS_INVALID,
            message: "sourceObjectIds must be an array.",
            field: "sourceObjectIds",
        });
    }
    // 7. Diagnostics array
    if (!Array.isArray(output.diagnostics)) {
        issues.push({
            id: `${codes.GC_LLMS_DIAGNOSTICS_INVALID}_diagnostics`,
            severity: "error",
            code: codes.GC_LLMS_DIAGNOSTICS_INVALID,
            message: "diagnostics must be an array.",
            field: "diagnostics",
        });
    }
    // 8. Internal leakage risk check
    if (output.content) {
        const lowercaseContent = output.content.toLowerCase();
        const riskKeywords = ["[internal]", "[private]", "[hidden]", "confidential note", "internal draft"];
        for (const kw of riskKeywords) {
            if (lowercaseContent.includes(kw)) {
                issues.push({
                    id: `${codes.GC_LLMS_INTERNAL_CONTENT_RISK}_risk_${kw.replace(/[^a-z0-9]+/g, "_")}`,
                    severity: "error",
                    code: codes.GC_LLMS_INTERNAL_CONTENT_RISK,
                    message: `Content includes risk keyword: "${kw}"`,
                    field: "content",
                    recommendation: "Ensure all internal comments or private metadata notes are removed from public outputs.",
                });
            }
        }
    }
    // 9. Zod schema validation
    const result = llmsOutputSchema.safeParse(output);
    if (!result.success) {
        for (const zodIssue of result.error.issues) {
            const field = zodIssue.path.join(".");
            const alreadyExists = issues.some((i) => i.field === field);
            if (!alreadyExists) {
                issues.push({
                    id: `GC_LLMS_ZOD_${field || "field"}_${issues.length}`,
                    severity: "error",
                    code: codes.GC_LLMS_DIAGNOSTICS_INVALID,
                    message: zodIssue.message,
                    field: field || undefined,
                });
            }
        }
    }
    const hasErrorsOrCritical = issues.some((issue) => issue.severity === "error" || issue.severity === "critical");
    return {
        valid: !hasErrorsOrCritical,
        publishable: !hasErrorsOrCritical,
        issues,
        checkedAt,
    };
}
