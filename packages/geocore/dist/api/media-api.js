import { createApiResponse, createApiListResponse, createNotFoundResponse, createForbiddenResponse, } from "./api-response.js";
/**
 * Returns a single Media Asset by ID, respecting visibility rules.
 */
export function getMedia(dataset, request) {
    const visibility = request.visibility ?? "public";
    const media = dataset.media?.find((m) => m.id === request.id);
    if (!media) {
        return createNotFoundResponse(request.id, visibility);
    }
    if (visibility === "public") {
        if (media.status !== "active" || media.visibility !== "public") {
            return createForbiddenResponse(`Media asset '${request.id}' is not publicly available.`);
        }
    }
    else if (visibility === "internal") {
        if (media.visibility === "private" || media.visibility === "hidden") {
            return createForbiddenResponse(`Media asset '${request.id}' is private and not accessible.`);
        }
    }
    return createApiResponse(media, { visibility });
}
/**
 * Returns a list of media assets, respecting visibility rules.
 */
export function listMedia(dataset, request = {}) {
    const visibility = request.visibility ?? "public";
    let media = dataset.media ?? [];
    if (visibility === "public") {
        media = media.filter((m) => m.status === "active" && m.visibility === "public");
    }
    else if (visibility === "internal") {
        media = media.filter((m) => m.visibility !== "private" && m.visibility !== "hidden");
    }
    if (request.language) {
        media = media.filter((m) => m.language === request.language);
    }
    if (request.status && visibility === "internal") {
        media = media.filter((m) => m.status === request.status);
    }
    const total = media.length;
    if (request.offset !== undefined) {
        media = media.slice(request.offset);
    }
    if (request.limit !== undefined) {
        media = media.slice(0, request.limit);
    }
    return createApiListResponse(media, { visibility, total });
}
