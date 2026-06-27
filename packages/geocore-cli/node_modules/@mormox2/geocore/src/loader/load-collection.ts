import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeCollection } from "../types/collection.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
import { isRecord, createLoaderDiagnostic, createIsoTimestamp } from "./loader-utils.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Loads a KnowledgeCollection from raw knowledge input.
 */
export function loadCollection(input: RawKnowledgeInput): {
  collection?: KnowledgeCollection;
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
        message: "Raw input content for KnowledgeCollection must be an object.",
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
        code: codes.GC_LOADER_COLLECTION_MISSING_ID,
        message: "Collection is missing 'id'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "id",
      })
    );
  }

  const requiredFields = ["slug", "title", "summary", "type", "language", "status", "version"];
  requiredFields.forEach((field) => {
    if (!content[field]) {
      diagnostics.push(
        createLoaderDiagnostic({
          severity: "error",
          code: codes.GC_LOADER_INPUT_CONTENT_INVALID,
          message: `Collection is missing required field '${field}'.`,
          sourcePath: input.sourcePath,
          inputId: inputId,
          field,
        })
      );
    }
  });

  if (!content.items) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_COLLECTION_MISSING_ITEMS,
        message: "Collection is missing 'items'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "items",
      })
    );
  }

  const hasErrors = !content.id || !content.items || requiredFields.some((f) => !content[f]);
  if (hasErrors) {
    return { diagnostics };
  }

  const now = createIsoTimestamp();
  const collection: KnowledgeCollection = {
    visibility: "public",
    createdAt: now,
    updatedAt: now,
    ...(content as any),
  };

  return { collection, diagnostics };
}
