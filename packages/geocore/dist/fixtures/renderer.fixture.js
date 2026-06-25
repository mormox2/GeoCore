import { createRendererOutput } from "../renderer/create-renderer-output.js";
export const textRenderer = {
    id: "renderer_text_basic",
    name: "Basic Text Renderer",
    format: "text",
    status: "experimental",
    render(input) {
        return createRendererOutput({
            rendererId: "renderer_text_basic",
            format: "text",
            content: typeof input.content === "string" ? input.content : JSON.stringify(input.content),
            sourceObjectId: input.objectId,
            sourceObjectVersion: input.objectVersion,
            language: input.language,
        });
    },
};
export const jsonRendererPlaceholder = {
    id: "renderer_json_placeholder",
    name: "JSON Renderer Placeholder",
    format: "json",
    status: "experimental",
    render(input) {
        return createRendererOutput({
            rendererId: "renderer_json_placeholder",
            format: "json",
            content: {
                objectId: input.objectId,
                title: input.metadata?.title || "",
                summary: input.metadata?.summary || "",
            },
            sourceObjectId: input.objectId,
            sourceObjectVersion: input.objectVersion,
            language: input.language,
        });
    },
};
