import { RendererInput } from "./renderer-input.js";
import { RendererOutput } from "./renderer-output.js";
export type RendererFormat = "html" | "markdown" | "json" | "json-ld" | "xml" | "rss" | "pdf" | "llm" | "search" | "api" | "text";
export type RendererStatus = "experimental" | "beta" | "stable" | "deprecated";
export type KnowledgeRenderer = {
    id: string;
    name: string;
    format: RendererFormat;
    status: RendererStatus;
    render(input: RendererInput): Promise<RendererOutput> | RendererOutput;
};
export type RendererRegistry = {
    renderers: KnowledgeRenderer[];
};
