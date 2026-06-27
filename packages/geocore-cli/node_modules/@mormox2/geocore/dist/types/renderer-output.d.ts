import { RendererFormat } from "./renderer.js";
import { RendererDiagnostic } from "./renderer-diagnostic.js";
export type RendererOutput = {
    rendererId: string;
    format: RendererFormat;
    content: string | Record<string, unknown>;
    metadata: {
        generatedAt: string;
        sourceObjectId: string;
        sourceObjectVersion: string;
        language: string;
    };
    diagnostics: RendererDiagnostic[];
};
