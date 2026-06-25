import { SchemaOutput } from "../types/schema.js";
import { ValidationResult, ValidationIssue, ValidationSeverity } from "../validation/validation-result.js";
import { schemaOutputSchema } from "../schemas/schema-output.schema.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Validates a SchemaOutput JSON-LD structure.
 */
export function validateJsonLd(output: SchemaOutput): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!output || typeof output !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: `${codes.GC_SCHEMA_OUTPUT_ID_MISSING}_root`,
          severity: "critical",
          code: codes.GC_SCHEMA_OUTPUT_ID_MISSING,
          message: "Schema output is missing or invalid.",
        },
      ],
    };
  }

  // 1. output ID exists
  if (!output.id || typeof output.id !== "string" || output.id.trim() === "") {
    issues.push({
      id: `${codes.GC_SCHEMA_OUTPUT_ID_MISSING}_id`,
      severity: "error",
      code: codes.GC_SCHEMA_OUTPUT_ID_MISSING,
      message: "Schema output ID is missing.",
      field: "id",
    });
  }

  // 2. sourceId exists
  if (!output.sourceId || typeof output.sourceId !== "string" || output.sourceId.trim() === "") {
    issues.push({
      id: `${codes.GC_SCHEMA_SOURCE_ID_MISSING}_sourceId`,
      severity: "error",
      code: codes.GC_SCHEMA_SOURCE_ID_MISSING,
      message: "Schema output sourceId is missing.",
      field: "sourceId",
    });
  }

  // 3. sourceType exists
  if (!output.sourceType || typeof output.sourceType !== "string" || output.sourceType.trim() === "") {
    issues.push({
      id: `${codes.GC_SCHEMA_SOURCE_TYPE_MISSING}_sourceType`,
      severity: "error",
      code: codes.GC_SCHEMA_SOURCE_TYPE_MISSING,
      message: "Schema output sourceType is missing.",
      field: "sourceType",
    });
  }

  // 4. schemaType exists
  if (!output.schemaType || typeof output.schemaType !== "string" || output.schemaType.trim() === "") {
    issues.push({
      id: `${codes.GC_SCHEMA_TYPE_MISSING}_schemaType`,
      severity: "error",
      code: codes.GC_SCHEMA_TYPE_MISSING,
      message: "Schema output schemaType is missing.",
      field: "schemaType",
    });
  }

  // 5. jsonLd exists
  if (!output.jsonLd || typeof output.jsonLd !== "object") {
    issues.push({
      id: `${codes.GC_SCHEMA_JSONLD_MISSING}_jsonLd`,
      severity: "error",
      code: codes.GC_SCHEMA_JSONLD_MISSING,
      message: "jsonLd object is missing.",
      field: "jsonLd",
    });
  } else {
    // 6. @context exists
    if (output.jsonLd["@context"] !== "https://schema.org") {
      issues.push({
        id: `${codes.GC_SCHEMA_CONTEXT_MISSING}_context`,
        severity: "error",
        code: codes.GC_SCHEMA_CONTEXT_MISSING,
        message: "@context is missing or invalid.",
        field: "jsonLd.@context",
      });
    }

    // 7. @type exists
    if (!output.jsonLd["@type"] || typeof output.jsonLd["@type"] !== "string") {
      issues.push({
        id: `${codes.GC_SCHEMA_AT_TYPE_MISSING}_type`,
        severity: "error",
        code: codes.GC_SCHEMA_AT_TYPE_MISSING,
        message: "@type is missing.",
        field: "jsonLd.@type",
      });
    }

    // 8. Article requires headline or name
    if (output.schemaType === "Article" && !output.jsonLd.headline && !output.jsonLd.name) {
      issues.push({
        id: `${codes.GC_SCHEMA_ARTICLE_HEADLINE_MISSING}_headline`,
        severity: "error",
        code: codes.GC_SCHEMA_ARTICLE_HEADLINE_MISSING,
        message: "Article schema requires headline or name.",
        field: "jsonLd.headline",
      });
    }

    // 9. FAQPage requires mainEntity array
    if (output.schemaType === "FAQPage") {
      if (!output.jsonLd.mainEntity || !Array.isArray(output.jsonLd.mainEntity)) {
        issues.push({
          id: `${codes.GC_SCHEMA_FAQ_MAIN_ENTITY_MISSING}_mainEntity`,
          severity: "error",
          code: codes.GC_SCHEMA_FAQ_MAIN_ENTITY_MISSING,
          message: "FAQPage schema requires mainEntity array.",
          field: "jsonLd.mainEntity",
        });
      }
    }

    // 10. DefinedTerm requires name and description
    if (output.schemaType === "DefinedTerm") {
      if (!output.jsonLd.name) {
        issues.push({
          id: `${codes.GC_SCHEMA_DEFINED_TERM_NAME_MISSING}_name`,
          severity: "error",
          code: codes.GC_SCHEMA_DEFINED_TERM_NAME_MISSING,
          message: "DefinedTerm schema requires name.",
          field: "jsonLd.name",
        });
      }
      if (!output.jsonLd.description) {
        issues.push({
          id: `${codes.GC_SCHEMA_DEFINED_TERM_DESCRIPTION_MISSING}_description`,
          severity: "error",
          code: codes.GC_SCHEMA_DEFINED_TERM_DESCRIPTION_MISSING,
          message: "DefinedTerm schema requires description.",
          field: "jsonLd.description",
        });
      }
    }

    // 11. CollectionPage requires name
    if (output.schemaType === "CollectionPage" && !output.jsonLd.name) {
      issues.push({
        id: `${codes.GC_SCHEMA_COLLECTION_NAME_MISSING}_name`,
        severity: "error",
        code: codes.GC_SCHEMA_COLLECTION_NAME_MISSING,
        message: "CollectionPage schema requires name.",
        field: "jsonLd.name",
      });
    }
  }

  // 12. generatedAt exists
  if (!output.generatedAt || typeof output.generatedAt !== "string" || output.generatedAt.trim() === "") {
    issues.push({
      id: `${codes.GC_SCHEMA_GENERATED_AT_MISSING}_generatedAt`,
      severity: "error",
      code: codes.GC_SCHEMA_GENERATED_AT_MISSING,
      message: "generatedAt is missing.",
      field: "generatedAt",
    });
  }

  // 13. diagnostics is an array
  if (!Array.isArray(output.diagnostics)) {
    issues.push({
      id: `${codes.GC_SCHEMA_DIAGNOSTICS_INVALID}_diagnostics`,
      severity: "error",
      code: codes.GC_SCHEMA_DIAGNOSTICS_INVALID,
      message: "diagnostics must be an array.",
      field: "diagnostics",
    });
  }

  // 14. missing canonical URL warning
  if (output.schemaType === "Article") {
    if (output.jsonLd && !output.jsonLd.url) {
      issues.push({
        id: `${codes.GC_SCHEMA_CANONICAL_URL_MISSING}_url`,
        severity: "warning",
        code: codes.GC_SCHEMA_CANONICAL_URL_MISSING,
        message: "Article is missing a canonical URL.",
        field: "jsonLd.url",
      });
    }
  }

  // Validate using Zod schemas
  const result = schemaOutputSchema.safeParse(output);
  if (!result.success) {
    for (const zodIssue of result.error.issues) {
      const field = zodIssue.path.join(".");
      const alreadyExists = issues.some((i) => i.field === field);
      if (!alreadyExists) {
        issues.push({
          id: `GC_SCHEMA_ZOD_${field || "field"}_${issues.length}`,
          severity: "error",
          code: codes.GC_SCHEMA_DIAGNOSTICS_INVALID,
          message: zodIssue.message,
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
