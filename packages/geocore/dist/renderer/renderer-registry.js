import { isRendererFormat, isRendererStatus } from "./renderer-utils.js";
import * as codes from "../validation/validation-codes.js";
export function createRendererRegistry(renderers = []) {
    return { renderers: [...renderers] };
}
export function registerRenderer(registry, renderer) {
    return {
        renderers: [...registry.renderers, renderer],
    };
}
export function findRendererById(registry, id) {
    return registry.renderers.find((r) => r.id === id);
}
export function findRenderersByFormat(registry, format) {
    return registry.renderers.filter((r) => r.format === format);
}
export function hasRenderer(registry, id) {
    return registry.renderers.some((r) => r.id === id);
}
export function validateRendererRegistry(registry) {
    const checkedAt = new Date().toISOString();
    const issues = [];
    const ids = new Set();
    registry.renderers.forEach((r, index) => {
        if (!r.id) {
            issues.push({
                id: `${codes.GC_RENDERER_ID_MISSING}_registry_${index}`,
                severity: "error",
                code: codes.GC_RENDERER_ID_MISSING,
                message: `Renderer at index ${index} is missing id.`,
            });
        }
        else {
            if (ids.has(r.id)) {
                issues.push({
                    id: `${codes.GC_RENDERER_ID_DUPLICATE}_registry_${r.id}`,
                    severity: "error",
                    code: codes.GC_RENDERER_ID_DUPLICATE,
                    message: `Renderer ID '${r.id}' is duplicated in registry.`,
                    objectId: r.id,
                });
            }
            else {
                ids.add(r.id);
            }
        }
        if (!r.name) {
            issues.push({
                id: `${codes.GC_RENDERER_NAME_MISSING}_registry_${r.id || index}`,
                severity: "error",
                code: codes.GC_RENDERER_NAME_MISSING,
                message: `Renderer '${r.id || index}' is missing a name.`,
                objectId: r.id || undefined,
            });
        }
        if (!isRendererFormat(r.format)) {
            issues.push({
                id: `${codes.GC_RENDERER_FORMAT_INVALID}_registry_${r.id || index}`,
                severity: "error",
                code: codes.GC_RENDERER_FORMAT_INVALID,
                message: `Renderer '${r.id || index}' has an invalid format '${r.format}'.`,
                objectId: r.id || undefined,
            });
        }
        if (!isRendererStatus(r.status)) {
            issues.push({
                id: `${codes.GC_RENDERER_STATUS_INVALID}_registry_${r.id || index}`,
                severity: "error",
                code: codes.GC_RENDERER_STATUS_INVALID,
                message: `Renderer '${r.id || index}' has an invalid status '${r.status}'.`,
                objectId: r.id || undefined,
            });
        }
        if (typeof r.render !== "function") {
            issues.push({
                id: `${codes.GC_RENDERER_RENDER_FUNCTION_MISSING}_registry_${r.id || index}`,
                severity: "error",
                code: codes.GC_RENDERER_RENDER_FUNCTION_MISSING,
                message: `Renderer '${r.id || index}' is missing a render function.`,
                objectId: r.id || undefined,
            });
        }
    });
    const hasErrorsOrCritical = issues.some((issue) => issue.severity === "error" || issue.severity === "critical");
    return {
        valid: !hasErrorsOrCritical,
        publishable: !hasErrorsOrCritical,
        issues,
        checkedAt,
    };
}
