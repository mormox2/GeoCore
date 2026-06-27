import { createRendererOutput } from "../renderer/create-renderer-output.js";
import { formatMarkdownList, formatMarkdownMetadata, stringifyContentForMarkdown, } from "./renderer-formatters.js";
import * as codes from "../validation/validation-codes.js";
export const markdownRenderer = {
    id: "renderer_markdown_basic",
    name: "Basic Markdown Renderer",
    format: "markdown",
    status: "experimental",
    render(input) {
        const diagnostics = [];
        // Check empty content warning
        const isEmpty = input.content === undefined ||
            input.content === null ||
            input.content === "" ||
            (typeof input.content === "object" && Object.keys(input.content).length === 0);
        if (isEmpty) {
            diagnostics.push({
                id: `${codes.GC_RENDERER_JSON_CONTENT_EMPTY}_${input.objectId}`,
                severity: "warning",
                code: codes.GC_RENDERER_JSON_CONTENT_EMPTY,
                message: "Rendered content body is empty.",
                objectId: input.objectId,
                rendererId: "renderer_markdown_basic",
            });
        }
        // Check object content info diagnostic
        if (typeof input.content === "object" && input.content !== null) {
            diagnostics.push({
                id: `${codes.GC_RENDERER_MARKDOWN_CONTENT_OBJECT_STRINGIFIED}_${input.objectId}`,
                severity: "info",
                code: codes.GC_RENDERER_MARKDOWN_CONTENT_OBJECT_STRINGIFIED,
                message: "Object content stringified as fenced JSON in Markdown output.",
                objectId: input.objectId,
                rendererId: "renderer_markdown_basic",
            });
        }
        // Check canonical URL warning
        if (input.metadata?.status === "published" && !input.metadata.canonicalUrl) {
            diagnostics.push({
                id: `${codes.GC_RENDERER_METADATA_CANONICAL_URL_MISSING}_${input.objectId}`,
                severity: "warning",
                code: codes.GC_RENDERER_METADATA_CANONICAL_URL_MISSING,
                message: "Missing canonical URL for published object.",
                objectId: input.objectId,
                rendererId: "renderer_markdown_basic",
            });
        }
        const title = input.metadata?.title || "";
        const summary = input.metadata?.summary || "";
        const bodyText = stringifyContentForMarkdown(input.content);
        const metadataText = formatMarkdownMetadata(input);
        const sections = [
            `# ${title}`,
            summary,
            "---",
            bodyText,
            "---",
            "## Metadata",
            metadataText,
        ];
        // Optional arrays
        if (input.metadata?.entities && input.metadata.entities.length > 0) {
            sections.push("## Entities", formatMarkdownList(input.metadata.entities));
        }
        if (input.metadata?.collections && input.metadata.collections.length > 0) {
            sections.push("## Collections", formatMarkdownList(input.metadata.collections));
        }
        if (input.metadata?.citations && input.metadata.citations.length > 0) {
            sections.push("## Citations", formatMarkdownList(input.metadata.citations));
        }
        const markdownContent = sections.join("\n\n").trim();
        return createRendererOutput({
            rendererId: "renderer_markdown_basic",
            format: "markdown",
            content: markdownContent,
            sourceObjectId: input.objectId,
            sourceObjectVersion: input.objectVersion,
            language: input.language,
            diagnostics,
        });
    },
};
