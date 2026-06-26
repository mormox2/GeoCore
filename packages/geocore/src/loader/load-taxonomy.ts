import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { TaxonomyTerm } from "../types/taxonomy.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
import { isRecord, createLoaderDiagnostic, createIsoTimestamp } from "./loader-utils.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Loads a TaxonomyTerm from raw knowledge input.
 */
export function loadTaxonomyTerm(input: RawKnowledgeInput): {
  taxonomyTerm?: TaxonomyTerm;
  diagnostics: LoaderDiagnostic[];
} {
  const diagnostics: LoaderDiagnostic[] = [];
  const content = input.content;

  if (content === undefined || content === null) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_INPUT_CONTENT_MISSING,
        message: "Raw input content is missing.",
        sourcePath: input.sourcePath,
        inputId: input.id,
      })
    );
    return { diagnostics };
  }

  if (!isRecord(content)) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
        message: "Raw input content for TaxonomyTerm must be an object.",
        sourcePath: input.sourcePath,
        inputId: input.id,
      })
    );
    return { diagnostics };
  }

  const inputId = (content.id as string) || input.id;

  if (!content.id) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_TAXONOMY_MISSING_ID,
        message: "Taxonomy Term is missing 'id'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "id",
      })
    );
  }

  const requiredFields = ["type", "slug", "label", "description", "status"];
  requiredFields.forEach((field) => {
    if (!content[field]) {
      diagnostics.push(
        createLoaderDiagnostic({
          severity: "error",
          code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
          message: `Taxonomy Term is missing required field '${field}'.`,
          sourcePath: input.sourcePath,
          inputId: inputId,
          field,
        })
      );
    }
  });

  const hasErrors = !content.id || requiredFields.some((f) => !content[f]);
  if (hasErrors) {
    return { diagnostics };
  }

  const now = createIsoTimestamp();
  const taxonomyTerm: TaxonomyTerm = {
    createdAt: now,
    updatedAt: now,
    ...(content as any),
  };

  return { taxonomyTerm, diagnostics };
}
