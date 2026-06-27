import { createRendererRegistry } from "../renderer/renderer-registry.js";
import { jsonRenderer } from "./json-renderer.js";
import { markdownRenderer } from "./markdown-renderer.js";
export const DEFAULT_RENDERERS = [jsonRenderer, markdownRenderer];
export function createDefaultRendererRegistry() {
    return createRendererRegistry(DEFAULT_RENDERERS);
}
