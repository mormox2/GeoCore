import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
import { parseSimpleFrontmatter } from "./frontmatter-parser.js";
import { loadKnowledgeObject } from "./load-knowledge-object.js";
import { createLoaderDiagnostic } from "./loader-utils.js";
import {
  GC_LOADER_INPUT_CONTENT_MISSING,
  GC_LOADER_INPUT_CONTENT_INVALID,
} from "../validation/validation-codes.js";

/**
 * Loads a KnowledgeObject from raw Markdown knowledge input.
 */
export function loadMarkdownKnowledge(input: RawKnowledgeInput): {
  object?: KnowledgeObject;
  diagnostics: LoaderDiagnostic[];
} {
  const diagnostics: LoaderDiagnostic[] = [];
  const content = input.content;

  if (content === undefined || content === null) {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: GC_LOADER_INPUT_CONTENT_MISSING,
        message: "Raw input content is missing.",
        sourcePath: input.sourcePath,
        inputId: input.id,
      })
    );
    return { diagnostics };
  }

  if (typeof content !== "string") {
    diagnostics.push(
      createLoaderDiagnostic({
        severity: "error",
        code: GC_LOADER_INPUT_CONTENT_INVALID,
        message: "Raw input content for Markdown knowledge must be a string.",
        sourcePath: input.sourcePath,
        inputId: input.id,
      })
    );
    return { diagnostics };
  }

  const { data, body, diagnostics: fmDiagnostics } = parseSimpleFrontmatter(content);
  diagnostics.push(...fmDiagnostics);

  const hasParseErrors = fmDiagnostics.some(
    (d) => d.severity === "error" || d.severity === "critical"
  );
  if (hasParseErrors) {
    return { diagnostics };
  }

  // Construct the object content by combining frontmatter data and parsed body.
  const objectContent: Record<string, any> = { ...data, body };

  // Place metadata fields into the nested metadata object
  const metadataKeys = new Set([
    "entities",
    "topics",
    "domains",
    "audiences",
    "collections",
    "citations",
    "trustLevel",
    "freshness",
  ]);
  const metadataObj: Record<string, any> = {
    ...(data.metadata as Record<string, any> || {}),
  };

  for (const key of Object.keys(data)) {
    if (metadataKeys.has(key)) {
      metadataObj[key] = data[key];
    }
  }

  if (Object.keys(metadataObj).length > 0) {
    objectContent.metadata = metadataObj;
  }

  // Delegate loading to the standard object loader
  const loadResult = loadKnowledgeObject({
    ...input,
    content: objectContent,
  });

  diagnostics.push(...loadResult.diagnostics);

  return {
    object: loadResult.object,
    diagnostics,
  };
}
