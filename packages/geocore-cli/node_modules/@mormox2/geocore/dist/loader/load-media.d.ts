import type { RawKnowledgeInput } from "../types/knowledge-loader.js";
import type { MediaAsset } from "../types/media.js";
import type { LoaderDiagnostic } from "../types/loader-diagnostic.js";
/**
 * Loads a MediaAsset from raw knowledge input.
 */
export declare function loadMediaAsset(input: RawKnowledgeInput): {
    media?: MediaAsset;
    diagnostics: LoaderDiagnostic[];
};
