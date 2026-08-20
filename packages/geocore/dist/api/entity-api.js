import { createApiResponse, createApiListResponse, createNotFoundResponse, createForbiddenResponse, } from "./api-response.js";
/**
 * Returns a single Entity by ID, respecting visibility rules.
 */
export function getEntity(dataset, request) {
    const visibility = request.visibility ?? "public";
    const entity = dataset.entities.find((e) => e.id === request.id);
    if (!entity) {
        return createNotFoundResponse(request.id, visibility);
    }
    if (visibility === "public") {
        if (entity.status !== "published") {
            return createForbiddenResponse(`Entity '${request.id}' is not published and not publicly available.`);
        }
    }
    return createApiResponse(entity, { visibility });
}
/**
 * Returns a list of entities, respecting visibility rules.
 */
export function listEntities(dataset, request = {}) {
    const visibility = request.visibility ?? "public";
    let entities = dataset.entities;
    if (visibility === "public") {
        entities = entities.filter((e) => e.status === "published");
    }
    if (request.language) {
        entities = entities.filter((e) => e.language === request.language);
    }
    if (request.status && visibility === "internal") {
        entities = entities.filter((e) => e.status === request.status);
    }
    const total = entities.length;
    if (request.offset !== undefined) {
        entities = entities.slice(request.offset);
    }
    if (request.limit !== undefined) {
        entities = entities.slice(0, request.limit);
    }
    return createApiListResponse(entities, { visibility, total });
}
