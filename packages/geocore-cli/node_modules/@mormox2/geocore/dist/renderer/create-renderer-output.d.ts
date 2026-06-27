import { RendererOutput } from "../types/renderer-output.js";
import { RendererFormat } from "../types/renderer.js";
import { RendererDiagnostic } from "../types/renderer-diagnostic.js";
export declare function createRendererOutput(input: {
    rendererId: string;
    format: RendererFormat;
    content: string | Record<string, unknown>;
    sourceObjectId: string;
    sourceObjectVersion: string;
    language: string;
    diagnostics?: RendererDiagnostic[];
}): RendererOutput;
