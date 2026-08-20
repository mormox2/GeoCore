import type { KnowledgeCitation, KnowledgeSource } from "../types/citation.js";
import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ApiGetRequest, ApiListRequest, ApiResponse, ApiListResponse } from "./api-types.js";
import {
  createApiResponse,
  createApiListResponse,
  createNotFoundResponse,
  createForbiddenResponse,
} from "./api-response.js";

/**
 * Returns a single Knowledge Source by ID, respecting visibility rules.
 */
export function getSource(
  dataset: KnowledgeDataset,
  request: ApiGetRequest
): ApiResponse<KnowledgeSource> {
  const visibility = request.visibility ?? "public";
  const source = dataset.sources?.find((s) => s.id === request.id);

  if (!source) {
    return createNotFoundResponse(request.id, visibility);
  }

  if (visibility === "public") {
    if (source.status !== "active" || source.visibility !== "public") {
      return createForbiddenResponse(
        `Source '${request.id}' is not publicly available.`
      );
    }
  } else if (visibility === "internal") {
    if (source.visibility === "private") {
      return createForbiddenResponse(
        `Source '${request.id}' is private and not accessible.`
      );
    }
  }

  return createApiResponse(source, { visibility });
}

/**
 * Returns a list of Knowledge Sources, respecting visibility rules.
 */
export function listSources(
  dataset: KnowledgeDataset,
  request: ApiListRequest = {}
): ApiListResponse<KnowledgeSource> {
  const visibility = request.visibility ?? "public";

  let sources = dataset.sources ?? [];

  if (visibility === "public") {
    sources = sources.filter((s) => s.status === "active" && s.visibility === "public");
  } else if (visibility === "internal") {
    sources = sources.filter((s) => s.visibility !== "private");
  }

  if (request.language) {
    sources = sources.filter((s) => s.language === request.language);
  }

  if (request.status && visibility === "internal") {
    sources = sources.filter((s) => s.status === request.status);
  }

  const total = sources.length;

  if (request.offset !== undefined) {
    sources = sources.slice(request.offset);
  }
  if (request.limit !== undefined) {
    sources = sources.slice(0, request.limit);
  }

  return createApiListResponse(sources, { visibility, total });
}

/**
 * Returns a single Knowledge Citation by ID.
 */
export function getCitation(
  dataset: KnowledgeDataset,
  request: ApiGetRequest
): ApiResponse<KnowledgeCitation> {
  const visibility = request.visibility ?? "public";
  const citation = dataset.citations?.find((c) => c.id === request.id);

  if (!citation) {
    return createNotFoundResponse(request.id, visibility);
  }

  if (visibility === "public" && citation.status !== "active") {
    return createForbiddenResponse(
      `Citation '${request.id}' is not active and not publicly available.`
    );
  }

  return createApiResponse(citation, { visibility });
}

/**
 * Returns a list of citations for a specific target or all active citations.
 */
export function listCitations(
  dataset: KnowledgeDataset,
  request: ApiListRequest & { targetId?: string; sourceId?: string } = {}
): ApiListResponse<KnowledgeCitation> {
  const visibility = request.visibility ?? "public";

  let citations = dataset.citations ?? [];

  if (visibility === "public") {
    citations = citations.filter((c) => c.status === "active");
  }

  if (request.targetId) {
    citations = citations.filter((c) => c.targetId === request.targetId);
  }

  if (request.sourceId) {
    citations = citations.filter((c) => c.sourceId === request.sourceId);
  }

  const total = citations.length;

  if (request.offset !== undefined) {
    citations = citations.slice(request.offset);
  }
  if (request.limit !== undefined) {
    citations = citations.slice(0, request.limit);
  }

  return createApiListResponse(citations, { visibility, total });
}
