import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
import {
  isRecord,
  createLoaderDiagnostic,
  createIsoTimestamp,
  normalizeLoadedStatus,
} from "./loader-utils.js";
import { validateKnowledgeObject } from "../validation/validate-knowledge-object.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Loads a KnowledgeObject from raw knowledge input.
 */
export function loadKnowledgeObject(input: RawKnowledgeInput): {
  object?: KnowledgeObject;
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
        message: "Raw input content for KnowledgeObject must be an object.",
        sourcePath: input.sourcePath,
        inputId: input.id,
      })
    );
    return { diagnostics };
  }

  const inputId = (content.id as string) || input.id;

  // Check required fields and emit loader-specific diagnostics
  if (!content.id) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_OBJECT_MISSING_ID,
        message: "Knowledge Object is missing 'id'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "id",
      })
    );
  }
  if (!content.slug) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_OBJECT_MISSING_SLUG,
        message: "Knowledge Object is missing 'slug'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "slug",
      })
    );
  }
  if (!content.title) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_OBJECT_MISSING_TITLE,
        message: "Knowledge Object is missing 'title'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "title",
      })
    );
  }
  if (!content.summary) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_OBJECT_MISSING_SUMMARY,
        message: "Knowledge Object is missing 'summary'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "summary",
      })
    );
  }
  if (!content.body) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_OBJECT_MISSING_BODY,
        message: "Knowledge Object is missing 'body'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "body",
      })
    );
  }
  if (!content.language) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_OBJECT_MISSING_LANGUAGE,
        message: "Knowledge Object is missing 'language'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "language",
      })
    );
  }
  if (!content.author) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_OBJECT_MISSING_AUTHOR,
        message: "Knowledge Object is missing 'author'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "author",
      })
    );
  }

  const normalizedStatus = normalizeLoadedStatus(content.status);
  const validStatuses = new Set(["draft", "review", "published", "archived"]);
  if (content.status !== undefined && !validStatuses.has(normalizedStatus)) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "critical",
        code: codes.GC_LOADER_OBJECT_INVALID_STATUS,
        message: `Knowledge Object status '${content.status}' is invalid.`,
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "status",
      })
    );
  }

  // If we have critical errors missing primary identifiers, we cannot create the object
  if (!content.id || !content.slug) {
    return { diagnostics };
  }

  const now = createIsoTimestamp();

  // Construct the object with defaults
  const obj: KnowledgeObject = {
    ...(content as any),
    status: normalizedStatus as any,
    version: (content.version as string) || "1.0.0",
    createdAt: (content.createdAt as string) || now,
    updatedAt: (content.updatedAt as string) || now,
  };

  // Run full validation to catch schema constraints
  const valResult = validateKnowledgeObject(obj);
  if (!valResult.valid) {
    for (const issue of valResult.issues) {
      diagnostics.push(
        createLoaderDiagnostic({
          severity: issue.severity === "critical" ? "critical" : "error",
          code: issue.code,
          message: issue.message,
          sourcePath: input.sourcePath,
          inputId: inputId,
          field: issue.field,
          recommendation: issue.recommendation,
        })
      );
    }
  }

  const hasErrors = diagnostics.some((d) => d.severity === "error" || d.severity === "critical");
  return {
    object: hasErrors ? undefined : obj,
    diagnostics,
  };
}
