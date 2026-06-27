import { KnowledgeRenderer } from "../types/renderer.js";
import { createRendererOutput } from "../renderer/create-renderer-output.js";
import { formatJsonContent } from "./renderer-formatters.js";
import { RendererDiagnostic } from "../types/renderer-diagnostic.js";
import * as codes from "../validation/validation-codes.js";

export const jsonRenderer: KnowledgeRenderer = {
  id: "renderer_json_basic",
  name: "Basic JSON Renderer",
  format: "json",
  status: "experimental",
  render(input) {
    const diagnostics: RendererDiagnostic[] = [];

    // Check empty content warning
    const isEmpty =
      input.content === undefined ||
      input.content === null ||
      input.content === "" ||
      (typeof input.content === "object" && Object.keys(input.content).length === 0);

    if (isEmpty) {
      diagnostics.push({
        id: `${codes.GC_RENDERER_JSON_CONTENT_EMPTY}_${input.objectId}`,
        severity: "warning",
        code: codes.GC_RENDERER_JSON_CONTENT_EMPTY,
        message: "Rendered content body is empty.",
        objectId: input.objectId,
        rendererId: "renderer_json_basic",
      });
    }

    // Check canonical URL warning
    if (input.metadata?.status === "published" && !input.metadata.canonicalUrl) {
      diagnostics.push({
        id: `${codes.GC_RENDERER_METADATA_CANONICAL_URL_MISSING}_${input.objectId}`,
        severity: "warning",
        code: codes.GC_RENDERER_METADATA_CANONICAL_URL_MISSING,
        message: "Missing canonical URL for published object.",
        objectId: input.objectId,
        rendererId: "renderer_json_basic",
      });
    }

    const content = formatJsonContent(input);

    return createRendererOutput({
      rendererId: "renderer_json_basic",
      format: "json",
      content,
      sourceObjectId: input.objectId,
      sourceObjectVersion: input.objectVersion,
      language: input.language,
      diagnostics,
    });
  },
};
