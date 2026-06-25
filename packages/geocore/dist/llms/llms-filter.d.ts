import { GenerateLlmsInput } from "../types/llms.js";
import { KnowledgeObject } from "../types/knowledge-object.js";
/**
 * Filters and returns public published KnowledgeObjects matching the language option.
 * Does not mutate the input object list.
 */
export declare function filterLlmsPublicObjects(input: GenerateLlmsInput): KnowledgeObject[];
