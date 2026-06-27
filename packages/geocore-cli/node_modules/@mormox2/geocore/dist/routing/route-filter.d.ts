import type { ResolveRoutesInput } from "../types/route.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
/**
 * Filter the input objects to those that should produce routes.
 *
 * Public mode (default): only published objects.
 * Internal mode: draft / review / published / archived, but never private/hidden.
 *
 * When `input.language` is set, only objects whose language matches are kept.
 */
export declare function filterRouteObjects(input: ResolveRoutesInput): KnowledgeObject[];
