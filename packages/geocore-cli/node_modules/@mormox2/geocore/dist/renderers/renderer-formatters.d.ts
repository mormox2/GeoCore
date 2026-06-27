import { RendererInput } from "../types/renderer-input.js";
export declare function formatMarkdownList(items?: string[]): string;
export declare function formatMarkdownMetadata(input: RendererInput): string;
export declare function stringifyContentForMarkdown(content: string | Record<string, unknown>): string;
export declare function formatJsonContent(input: RendererInput): Record<string, unknown>;
