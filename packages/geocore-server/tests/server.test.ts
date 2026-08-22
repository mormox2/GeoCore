import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createGeoCoreServer, GeoCoreServerInstance } from "../src/server/http-server.js";
import { apiDatasetFixture } from "@mormox2/geocore";

describe("GeoCore Standalone HTTP Server", () => {
  let serverInstance: GeoCoreServerInstance;
  let baseUrl: string;

  beforeAll(async () => {
    serverInstance = createGeoCoreServer({
      dataset: apiDatasetFixture,
      port: 0, // dynamic port
      host: "127.0.0.1",
      siteUrl: "https://rtimidental.tn",
      auth: {
        apiKeys: ["test-api-key-123"],
        adminKeys: ["admin-secret-key-999"],
      },
    });

    const info = await serverInstance.listen();
    baseUrl = info.url;
  });

  afterAll(async () => {
    await serverInstance.close();
  });

  it("GET /api/health returns ok status and dataset stats", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.datasetId).toBe("dataset_test_api");
    expect(data.objectsCount).toBeGreaterThan(0);
  });

  it("GET /api/openapi.json returns OpenAPI 3.1.0 specification", async () => {
    const res = await fetch(`${baseUrl}/api/openapi.json`);
    expect(res.status).toBe(200);
    const spec = await res.json();
    expect(spec.openapi).toBe("3.1.0");
    expect(spec.paths["/api/search"]).toBeDefined();
    expect(spec.paths["/api/context/{id}"]).toBeDefined();
  });

  it("GET /api/llms.txt returns plain text markdown summary", async () => {
    const res = await fetch(`${baseUrl}/api/llms.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    const text = await res.text();
    expect(text).toContain("# API Test Dataset");
  });

  it("GET /api/sitemap.xml returns XML sitemap", async () => {
    const res = await fetch(`${baseUrl}/api/sitemap.xml`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/xml");
    const xml = await res.text();
    expect(xml).toContain("<urlset");
  });

  it("GET /api/search returns full-text search results", async () => {
    const res = await fetch(`${baseUrl}/api/search?q=détartrage`);
    expect(res.status).toBe(200);
    const result = await res.json();
    expect(result.status).toBe("ok");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].title).toContain("détartrage");
  });

  it("GET /api/objects returns published objects for public visitor", async () => {
    const res = await fetch(`${baseUrl}/api/objects`);
    expect(res.status).toBe(200);
    const result = await res.json();
    expect(result.status).toBe("ok");
    expect(result.data.length).toBe(2);
  });

  it("GET /api/objects/:id returns object by ID", async () => {
    const res = await fetch(`${baseUrl}/api/objects/ko_detartrage_abime_dents`);
    expect(res.status).toBe(200);
    const result = await res.json();
    expect(result.status).toBe("ok");
    expect(result.data.id).toBe("ko_detartrage_abime_dents");
  });

  it("GET /api/context/:id returns full AI Context Package for RAG", async () => {
    const res = await fetch(`${baseUrl}/api/context/ko_detartrage_abime_dents`);
    expect(res.status).toBe(200);
    const result = await res.json();
    expect(result.status).toBe("ok");
    expect(result.data.object.id).toBe("ko_detartrage_abime_dents");
    expect(result.data.entities.length).toBeGreaterThan(0);
    expect(result.data.citations.length).toBeGreaterThan(0);
  });

  it("GET /api/prompt-context/:id returns formatted prompt markdown string", async () => {
    const res = await fetch(`${baseUrl}/api/prompt-context/ko_detartrage_abime_dents`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Knowledge Context Preamble");
    expect(text).toContain("Le détartrage abîme-t-il les dents ?");
  });

  it("GET /api/citations and /api/sources return citation graph assets", async () => {
    const citRes = await fetch(`${baseUrl}/api/citations`);
    expect(citRes.status).toBe(200);
    const citResult = await citRes.json();
    expect(citResult.data.length).toBeGreaterThan(0);

    const srcRes = await fetch(`${baseUrl}/api/sources`);
    expect(srcRes.status).toBe(200);
    const srcResult = await srcRes.json();
    expect(srcResult.data.length).toBeGreaterThan(0);
  });

  it("OPTIONS preflight returns 204 with CORS headers", async () => {
    const res = await fetch(`${baseUrl}/api/objects`, { method: "OPTIONS" });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("Accesses internal draft object when valid API key is provided", async () => {
    const res = await fetch(`${baseUrl}/api/objects/ko_draft_internal_note?visibility=internal`, {
      headers: { "x-api-key": "test-api-key-123" },
    });
    expect(res.status).toBe(200);
    const result = await res.json();
    expect(result.data.id).toBe("ko_draft_internal_note");
  });

  it("POST /api/vectorize indexes dataset chunks and GET /api/search/hybrid performs hybrid search", async () => {
    // 1. Post vectorize
    const vecRes = await fetch(`${baseUrl}/api/vectorize`, { method: "POST" });
    expect(vecRes.status).toBe(200);
    const vecData = await vecRes.json();
    expect(vecData.status).toBe("ok");
    expect(vecData.report.objectsProcessed).toBe(2);
    expect(vecData.report.vectorsIndexed).toBeGreaterThan(0);

    // 2. Query hybrid search
    const searchRes = await fetch(`${baseUrl}/api/search/hybrid?q=détartrage`);
    expect(searchRes.status).toBe(200);
    const searchData = await searchRes.json();
    expect(searchData.status).toBe("ok");
    expect(searchData.totalHits).toBeGreaterThan(0);
    expect(searchData.data.length).toBeGreaterThan(0);
    expect(searchData.data[0].combinedScore).toBeGreaterThan(0);
    expect(searchData.data[0].title).toContain("détartrage");
  });

  it("Refuses internal draft object when no API key is provided", async () => {
    const res = await fetch(`${baseUrl}/api/objects/ko_draft_internal_note`);
    expect(res.status).toBe(403);
  });
});
