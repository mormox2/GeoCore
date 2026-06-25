import { searchDocumentSchema } from "../schemas/search-document.schema.js";
  import { ValidationResult, ValidationIssue, ValidationSeverity } from "../validation/validation-result.js";
  import * as codes from "../validation/validation-codes.js";
  import { SearchDocument } from "../types/search-document.js";

  /**
   * Validates a SearchDocument, returning a ValidationResult.
   */
  export function validateSearchDocument(doc: SearchDocument): ValidationResult {
    const checkedAt = new Date().toISOString();
    
    if (!doc || typeof doc !== "object") {
      return {
        valid: false,
        publishable: false,
        checkedAt,
        issues: [
          {
            id: `${codes.GC_SEARCH_DOCUMENT_ID_MISSING}_ROOT`,
            severity: "error",
            code: codes.GC_SEARCH_DOCUMENT_ID_MISSING,
            message: "Search document must be a non-null object",
          },
        ],
      };
    }

    const issues: ValidationIssue[] = [];

    // 1. Check ID
    if (!doc.id || typeof doc.id !== "string" || doc.id.trim() === "") {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_ID_MISSING}_id`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_ID_MISSING,
        message: "Search document ID is missing.",
        objectId: doc.id,
        field: "id",
      });
    }

    // 2. Check sourceId
    if (!doc.sourceId || typeof doc.sourceId !== "string" || doc.sourceId.trim() === "") {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_SOURCE_ID_MISSING}_sourceId`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_SOURCE_ID_MISSING,
        message: "Search document sourceId is missing.",
        objectId: doc.id,
        field: "sourceId",
      });
    }

    // 3. Check sourceType
    if (!doc.sourceType || typeof doc.sourceType !== "string" || doc.sourceType.trim() === "") {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_SOURCE_TYPE_MISSING}_sourceType`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_SOURCE_TYPE_MISSING,
        message: "Search document sourceType is missing.",
        objectId: doc.id,
        field: "sourceType",
      });
    }

    // 4. Check title
    if (!doc.title || typeof doc.title !== "string" || doc.title.trim() === "") {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_TITLE_MISSING}_title`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_TITLE_MISSING,
        message: "Search document title is missing.",
        objectId: doc.id,
        field: "title",
      });
    }

    // 5. Check language
    if (!doc.language || typeof doc.language !== "string" || doc.language.trim() === "") {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_LANGUAGE_MISSING}_language`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_LANGUAGE_MISSING,
        message: "Search document language is missing.",
        objectId: doc.id,
        field: "language",
      });
    }

    // 6. Check status
    const validStatuses = ["draft", "review", "published", "archived"];
    if (!doc.status || !validStatuses.includes(doc.status)) {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_STATUS_INVALID}_status`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_STATUS_INVALID,
        message: "Search document status is invalid.",
        objectId: doc.id,
        field: "status",
      });
    }

    // 7. Check visibility
    const validVisibilities = ["public", "internal", "private", "hidden"];
    if (!doc.visibility || !validVisibilities.includes(doc.visibility)) {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_VISIBILITY_INVALID}_visibility`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_VISIBILITY_INVALID,
        message: "Search document visibility is invalid.",
        objectId: doc.id,
        field: "visibility",
      });
    }

    // 8. Check text
    if (doc.text === undefined || doc.text === null || doc.text === "") {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_TEXT_MISSING}_text`,
        severity: "warning",
        code: codes.GC_SEARCH_DOCUMENT_TEXT_MISSING,
        message: "Search document text is missing.",
        objectId: doc.id,
        field: "text",
      });
    }

    // 9. Check generatedAt
    if (!doc.generatedAt || typeof doc.generatedAt !== "string" || doc.generatedAt.trim() === "") {
      issues.push({
        id: `${codes.GC_SEARCH_DOCUMENT_GENERATED_AT_MISSING}_generatedAt`,
        severity: "error",
        code: codes.GC_SEARCH_DOCUMENT_GENERATED_AT_MISSING,
        message: "Search document generatedAt is missing.",
        objectId: doc.id,
        field: "generatedAt",
      });
    }

    // 10. Check arrays
    const arrayFields = ["entities", "collections", "citations", "media", "taxonomy", "keywords", "aliases"];
    for (const f of arrayFields) {
      if (!Array.isArray((doc as any)[f])) {
        issues.push({
          id: `${codes.GC_SEARCH_DOCUMENT_ARRAY_INVALID}_${f}`,
          severity: "error",
          code: codes.GC_SEARCH_DOCUMENT_ARRAY_INVALID,
          message: `Search document field '${f}' is not an array.`,
          objectId: doc.id,
          field: f,
        });
      }
    }

    // 11. Public published document without canonicalUrl produces warning
    if (doc.visibility === "public" && doc.status === "published") {
      if (!doc.canonicalUrl || typeof doc.canonicalUrl !== "string" || doc.canonicalUrl.trim() === "") {
        issues.push({
          id: `${codes.GC_SEARCH_DOCUMENT_CANONICAL_URL_MISSING}_canonicalUrl`,
          severity: "warning",
          code: codes.GC_SEARCH_DOCUMENT_CANONICAL_URL_MISSING,
          message: "Public published search document lacks a canonical URL.",
          objectId: doc.id,
          field: "canonicalUrl",
        });
      }
    }

    // 12. Check using Zod safeParse to ensure full schema compliance
    const result = searchDocumentSchema.safeParse(doc);
    if (!result.success) {
      for (const zodIssue of result.error.issues) {
        const field = zodIssue.path.join(".");
        const alreadyExists = issues.some((i) => i.field === field);
        if (!alreadyExists) {
          let code = codes.GC_METADATA_INVALID;
          let severity: ValidationSeverity = "error";
          if (field === "id") {
            code = codes.GC_SEARCH_DOCUMENT_ID_MISSING;
          } else if (field === "sourceId") {
            code = codes.GC_SEARCH_DOCUMENT_SOURCE_ID_MISSING;
          } else if (field === "sourceType") {
            code = codes.GC_SEARCH_DOCUMENT_SOURCE_TYPE_MISSING;
          } else if (field === "title") {
            code = codes.GC_SEARCH_DOCUMENT_TITLE_MISSING;
          } else if (field === "language") {
            code = codes.GC_SEARCH_DOCUMENT_LANGUAGE_MISSING;
          } else if (field === "status") {
            code = codes.GC_SEARCH_DOCUMENT_STATUS_INVALID;
          } else if (field === "visibility") {
            code = codes.GC_SEARCH_DOCUMENT_VISIBILITY_INVALID;
          } else if (field === "text") {
            code = codes.GC_SEARCH_DOCUMENT_TEXT_MISSING;
            severity = "warning";
          } else if (field === "generatedAt") {
            code = codes.GC_SEARCH_DOCUMENT_GENERATED_AT_MISSING;
          } else if (arrayFields.includes(field)) {
            code = codes.GC_SEARCH_DOCUMENT_ARRAY_INVALID;
          }
          issues.push({
            id: `${code}_zod_${field || "field"}_${issues.length}`,
            severity,
            code,
            message: zodIssue.message,
            objectId: doc.id,
            field: field || undefined,
          });
        }
      }
    }

    const hasErrorsOrCritical = issues.some(
      (issue) => issue.severity === "error" || issue.severity === "critical"
    );

    return {
      valid: !hasErrorsOrCritical,
      publishable: !hasErrorsOrCritical,
      issues,
      checkedAt,
    };
  }
