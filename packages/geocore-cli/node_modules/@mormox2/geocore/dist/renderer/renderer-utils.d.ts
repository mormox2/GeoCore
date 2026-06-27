import { RendererFormat, RendererStatus } from "../types/renderer.js";
import { RendererDiagnosticSeverity } from "../types/renderer-diagnostic.js";
export declare function isRendererFormat(value: unknown): value is RendererFormat;
export declare function isRendererStatus(value: unknown): value is RendererStatus;
export declare function isRendererDiagnosticSeverity(value: unknown): value is RendererDiagnosticSeverity;
