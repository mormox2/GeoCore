import { KnowledgeRenderer, RendererRegistry } from "../types/renderer.js";
import { RendererFormat } from "../types/renderer.js";
import { ValidationResult } from "../validation/validation-result.js";
export declare function createRendererRegistry(renderers?: KnowledgeRenderer[]): RendererRegistry;
export declare function registerRenderer(registry: RendererRegistry, renderer: KnowledgeRenderer): RendererRegistry;
export declare function findRendererById(registry: RendererRegistry, id: string): KnowledgeRenderer | undefined;
export declare function findRenderersByFormat(registry: RendererRegistry, format: RendererFormat): KnowledgeRenderer[];
export declare function hasRenderer(registry: RendererRegistry, id: string): boolean;
export declare function validateRendererRegistry(registry: RendererRegistry): ValidationResult;
