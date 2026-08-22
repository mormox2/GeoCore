export type OpenApiInfo = {
  title?: string;
  version?: string;
  description?: string;
};

/**
 * Generates an OpenAPI 3.1.0 specification for the GeoCore REST API.
 */
export function generateOpenApiSpec(info: OpenApiInfo = {}): object {
  const title = info.title ?? "GeoCore Knowledge REST API";
  const version = info.version ?? "1.0.0";
  const description =
    info.description ??
    "Authoritative AI-native Knowledge Operating System REST endpoints for objects, graph entities, semantic search, AI context packages, and SEO sitemaps.";

  return {
    openapi: "3.1.0",
    info: {
      title,
      version,
      description,
      contact: {
        name: "Dr Mossaab Rtimi",
      },
    },
    paths: {
      "/api/objects": {
        get: {
          summary: "List Knowledge Objects",
          description: "Returns a paginated list of knowledge objects filtered by visibility and language.",
          parameters: [
            { name: "visibility", in: "query", schema: { type: "string", enum: ["public", "internal"], default: "public" } },
            { name: "language", in: "query", schema: { type: "string" } },
            { name: "status", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            "200": { description: "List of Knowledge Objects" },
          },
        },
      },
      "/api/objects/{id}": {
        get: {
          summary: "Get Knowledge Object by ID",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "visibility", in: "query", schema: { type: "string", enum: ["public", "internal"] } },
          ],
          responses: {
            "200": { description: "Knowledge Object details" },
            "404": { description: "Object not found" },
            "403": { description: "Object is private/internal" },
          },
        },
      },
      "/api/entities": {
        get: {
          summary: "List Knowledge Graph Entities",
          parameters: [
            { name: "visibility", in: "query", schema: { type: "string" } },
            { name: "language", in: "query", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "List of Knowledge Entities" },
          },
        },
      },
      "/api/entities/{id}": {
        get: {
          summary: "Get Entity by ID",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Entity details" },
            "404": { description: "Entity not found" },
          },
        },
      },
      "/api/search": {
        get: {
          summary: "Full-Text Knowledge Search",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string" } },
            { name: "language", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
            { name: "visibility", in: "query", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Search results list" },
          },
        },
      },
      "/api/context/{id}": {
        get: {
          summary: "Get AI Context Package (RAG Endpoint)",
          description: "Returns an authoritative, verified AI context bundle containing object, metadata, entities, citations, and trust-scored sources for LLM grounding.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "visibility", in: "query", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Complete AI Context Package" },
            "404": { description: "Object not found" },
            "403": { description: "Object is not published/public" },
          },
        },
      },
      "/api/prompt-context/{id}": {
        get: {
          summary: "Get Formatted LLM Prompt Context",
          description: "Returns a ready-to-use Markdown system context string formatted with verified evidence and citation guardrails.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Formatted Markdown prompt context string",
              content: { "text/plain": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/sitemap.xml": {
        get: {
          summary: "XML Sitemap",
          responses: {
            "200": {
              description: "Standard XML sitemap with media extensions",
              content: { "application/xml": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/llms.txt": {
        get: {
          summary: "llms.txt Summary for AI Crawlers",
          responses: {
            "200": {
              description: "llms.txt markdown",
              content: { "text/plain": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/llms-full.txt": {
        get: {
          summary: "llms-full.txt Full Ingestion for AI Agents",
          responses: {
            "200": {
              description: "Full llms-full.txt corpus",
              content: { "text/plain": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/openapi.json": {
        get: {
          summary: "OpenAPI Specification",
          responses: {
            "200": { description: "OpenAPI 3.1.0 JSON Schema" },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "Server Health Check",
          responses: {
            "200": { description: "Health status" },
          },
        },
      },
    },
  };
}
