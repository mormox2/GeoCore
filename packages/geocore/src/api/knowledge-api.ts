import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ApiGetRequest, ApiListRequest, ApiResponse, ApiListResponse } from "./api-types.js";
import {
  createApiResponse,
  createApiListResponse,
  createNotFoundResponse,
  createForbiddenResponse,
} from "./api-response.js";

/**
 * Returns a single Knowledge Object by ID, respecting visibility rules.
 * Public API must only expose published objects.
 */
export function getKnowledgeObject(
  dataset: KnowledgeDataset,
  request: ApiGetRequest
): ApiResponse<KnowledgeObject> {
  const visibility = request.visibility ?? "public";
  const object = dataset.objects.find((o) => o.id === request.id);

  if (!object) {
    return createNotFoundResponse(request.id, visibility);
  }

  // Enforce visibility: public API must only expose published objects
  if (visibility === "public") {
    if (object.status !== "published") {
      return createForbiddenResponse(
        `Object '${request.id}' is not published and not publicly available.`
      );
    }
  }

  return createApiResponse(object, { visibility });
}

/**
 * Returns a list of Knowledge Objects, respecting visibility rules.
 */
export function listKnowledgeObjects(
  dataset: KnowledgeDataset,
  request: ApiListRequest = {}
): ApiListResponse<KnowledgeObject> {
  const visibility = request.visibility ?? "public";

  let objects = dataset.objects;

  // Filter by visibility/status
  if (visibility === "public") {
    objects = objects.filter((o) => o.status === "published");
  }

  // Filter by language
  if (request.language) {
    objects = objects.filter((o) => o.language === request.language);
  }

  // Filter by status (for internal callers)
  if (request.status) {
    objects = objects.filter((o) => o.status === request.status);
  }

  const total = objects.length;

  // Pagination
  if (request.offset !== undefined) {
    objects = objects.slice(request.offset);
  }
  if (request.limit !== undefined) {
    objects = objects.slice(0, request.limit);
  }

  return createApiListResponse(objects, { visibility, total });
}
