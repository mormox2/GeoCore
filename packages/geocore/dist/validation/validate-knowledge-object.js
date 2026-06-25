import { knowledgeObjectSchema } from "../schemas/knowledge-object.schema.js";
import * as codes from "./validation-codes.js";
export function validateKnowledgeObject(obj) {
    const checkedAt = new Date().toISOString();
    if (!obj || typeof obj !== "object") {
        return {
            valid: false,
            publishable: false,
            checkedAt,
            issues: [
                {
                    id: `${codes.GC_METADATA_INVALID}_ROOT`,
                    severity: "critical",
                    code: codes.GC_METADATA_INVALID,
                    message: "KnowledgeObject must be a non-null object",
                },
            ],
        };
    }
    const result = knowledgeObjectSchema.safeParse(obj);
    if (result.success) {
        return {
            valid: true,
            publishable: true,
            checkedAt,
            issues: [],
        };
    }
    const issues = result.error.issues.map((zodIssue, index) => {
        const field = zodIssue.path.join(".");
        let code = codes.GC_METADATA_INVALID;
        let severity = "error";
        let message = zodIssue.message;
        let recommendation = "";
        if (field === "id") {
            code = codes.GC_ID_MISSING;
            severity = "critical";
            message = "The unique identifier (id) is missing or empty.";
            recommendation = "Provide a stable unique identifier like 'ko_detartrage_abime_dents'.";
        }
        else if (field === "slug") {
            code = codes.GC_SLUG_MISSING;
            severity = "critical";
            message = "The human-readable slug is missing or empty.";
            recommendation = "Provide a URL-safe slug like 'detartrage-abime-t-il-les-dents'.";
        }
        else if (field === "title") {
            code = codes.GC_TITLE_MISSING;
            severity = "error";
            message = "The canonical title is missing or empty.";
            recommendation = "Add a title summarizing the knowledge unit.";
        }
        else if (field === "summary") {
            code = codes.GC_SUMMARY_MISSING;
            severity = "error";
            message = "The summary is missing or empty.";
            recommendation = "Add a short description summarizing the content.";
        }
        else if (field === "body") {
            code = codes.GC_BODY_MISSING;
            severity = "error";
            message = "The body content is missing or empty.";
            recommendation = "Provide the canonical knowledge body.";
        }
        else if (field === "language") {
            code = codes.GC_LANGUAGE_MISSING;
            severity = "error";
            message = "The primary language is missing or empty.";
            recommendation = "Specify a two-letter language code like 'fr' or 'en'.";
        }
        else if (field === "status") {
            code = codes.GC_STATUS_INVALID;
            severity = "critical";
            message = "The status is missing or invalid.";
            recommendation = "Set status to one of: 'draft', 'review', 'published', 'archived'.";
        }
        else if (field === "version") {
            code = codes.GC_VERSION_MISSING;
            severity = "error";
            message = "The semantic version is missing or empty.";
            recommendation = "Specify a version code like '1.0.0'.";
        }
        else if (field === "author") {
            code = codes.GC_AUTHOR_MISSING;
            severity = "error";
            message = "The author field is missing or empty.";
            recommendation = "Specify the author identifier.";
        }
        else {
            code = codes.GC_METADATA_INVALID;
            severity = "error";
            message = `Field '${field}' is invalid: ${zodIssue.message}`;
            recommendation = "Correct the field schema value to match specifications.";
        }
        return {
            id: `${code}_${field || "field"}_${index}`,
            severity,
            code,
            message,
            objectId: obj.id,
            field: field || undefined,
            recommendation: recommendation || undefined,
        };
    });
    const hasErrorsOrCritical = issues.some((issue) => issue.severity === "error" || issue.severity === "critical");
    return {
        valid: !hasErrorsOrCritical,
        publishable: !hasErrorsOrCritical,
        issues,
        checkedAt,
    };
}
