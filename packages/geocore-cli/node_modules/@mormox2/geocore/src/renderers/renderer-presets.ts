import { RendererRegistry } from "../types/renderer.js";
import { createRendererRegistry } from "../renderer/renderer-registry.js";
import { jsonRenderer } from "./json-renderer.js";
import { markdownRenderer } from "./markdown-renderer.js";

export const DEFAULT_RENDERERS = [jsonRenderer, markdownRenderer];

export function createDefaultRendererRegistry(): RendererRegistry {
  return createRendererRegistry(DEFAULT_RENDERERS);
}
