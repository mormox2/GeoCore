import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeEntity } from "../types/entity.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
import { isRecord, createLoaderDiagnostic, createIsoTimestamp } from "./loader-utils.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Loads a KnowledgeEntity from raw knowledge input.
 */
export function loadEntity(input: RawKnowledgeInput): {
  entity?: KnowledgeEntity;
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
        message: "Raw input content for KnowledgeEntity must be an object.",
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
        code: codes.GC_LOADER_ENTITY_MISSING_ID,
        message: "Entity is missing 'id'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "id",
      })
    );
  }

  if (!content.type) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_ENTITY_MISSING_TYPE,
        message: "Entity is missing 'type'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "type",
      })
    );
  }

  const canonicalName = (content.canonicalName as string) || (content.name as string);
  if (!canonicalName) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: codes.GC_LOADER_ENTITY_MISSING_NAME,
        message: "Entity is missing 'canonicalName' or 'name'.",
        sourcePath: input.sourcePath,
        inputId: inputId,
        field: "canonicalName",
      })
    );
  }

  if (!content.id || !content.type || !canonicalName) {
    return { diagnostics };
  }

  const now = createIsoTimestamp();
  const entity: KnowledgeEntity = {
    definition: "",
    language: "en",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    ...(content as any),
    canonicalName,
  };

  return { entity, diagnostics };
}
