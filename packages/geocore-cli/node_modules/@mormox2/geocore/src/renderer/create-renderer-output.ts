import { RendererOutput } from "../types/renderer-output.js";
import { RendererFormat } from "../types/renderer.js";
import { RendererDiagnostic } from "../types/renderer-diagnostic.js";

export function createRendererOutput(input: {
  rendererId: string;
  format: RendererFormat;
  content: string | Record<string, unknown>;
  sourceObjectId: string;
  sourceObjectVersion: string;
  language: string;
  diagnostics?: RendererDiagnostic[];
}): RendererOutput {
  return {
    rendererId: input.rendererId,
    format: input.format,
    content: input.content,
    metadata: {
      generatedAt: new Date().toISOString(),
      sourceObjectId: input.sourceObjectId,
      sourceObjectVersion: input.sourceObjectVersion,
      language: input.language,
    },
    diagnostics: input.diagnostics || [],
  };
}
