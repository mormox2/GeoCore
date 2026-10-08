import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { createGeoCoreServer, GeoCoreServerInstance } from "../src/server/http-server.js";
import { routeRequest } from "../src/routes/api-router.js";
import type { KnowledgeDataset } from "@mormo_mossaab/geocore";
import { fetchWidgetAnswer } from "@mormo_mossaab/geocore";
import { apiDatasetFixture } from "@mormo_mossaab/geocore";

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
    const vecRes = await fetch(`${baseUrl}/api/vectorize`, {
      method: "POST",
      headers: { "x-api-key": "admin-secret-key-999" },
    });
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

  it("refuses POST /api/vectorize without an admin key", async () => {
    const anonymous = await fetch(`${baseUrl}/api/vectorize`, { method: "POST" });
    expect(anonymous.status).toBe(401);

    const nonAdmin = await fetch(`${baseUrl}/api/vectorize`, {
      method: "POST",
      headers: { "x-api-key": "test-api-key-123" },
    });
    expect(nonAdmin.status).toBe(403);
  });

  it("requires an API key for /api/validate", async () => {
    const anonymous = await fetch(`${baseUrl}/api/validate?mode=internal`);
    expect(anonymous.status).toBe(401);
    expect(await anonymous.text()).not.toContain("ko_draft_internal_note");

    const authed = await fetch(`${baseUrl}/api/validate`, { headers: { "x-api-key": "test-api-key-123" } });
    expect(authed.status).toBe(200);
  });

  it("rejects invalid pagination parameters instead of silently truncating", async () => {
    expect((await fetch(`${baseUrl}/api/objects?limit=abc`)).status).toBe(400);
    expect((await fetch(`${baseUrl}/api/objects?limit=-1`)).status).toBe(400);
    expect((await fetch(`${baseUrl}/api/entities?offset=1.5`)).status).toBe(400);

    const ok = await fetch(`${baseUrl}/api/objects?limit=1`);
    expect(ok.status).toBe(200);
    expect((await ok.json()).data.length).toBe(1);
  });
});

describe("GET /api/answer (widget endpoint)", () => {
  let instance: GeoCoreServerInstance;
  let apiUrl: string;

  beforeAll(async () => {
    instance = createGeoCoreServer({ dataset: apiDatasetFixture });
    apiUrl = `${(await instance.listen(0, "127.0.0.1")).url}/api`;
  });

  afterAll(async () => {
    await instance.close();
  });

  it("answers with grounded sentences extracted from the published object", async () => {
    const result = await fetchWidgetAnswer(apiUrl, "Est-ce que le détartrage abîme l'émail ?");
    expect(result.kind).toBe("answer");
    if (result.kind !== "answer") return;

    const object = apiDatasetFixture.objects.find((o) => o.id === result.data.objectId)!;
    expect(object.status).toBe("published");
    expect(object.body).toContain(result.data.answer);
    expect(result.data.grounding.isGrounded).toBe(true);
    expect(result.data.grounding.unsupportedClaims).toEqual([]);
    expect(result.data.sources.length).toBeGreaterThan(0);
  });

  it("returns no-answer for unrelated questions instead of guessing", async () => {
    const result = await fetchWidgetAnswer(apiUrl, "Quelle est la capitale de la France ?");
    expect(result.kind).toBe("no-answer");
  });

  it("never answers from draft objects", async () => {
    const draft = apiDatasetFixture.objects.find((o) => o.status !== "published")!;
    const res = await fetch(`${apiUrl}/answer?q=${encodeURIComponent(draft.title)}`);
    const body = await res.json();
    expect(body.data?.objectId).not.toBe(draft.id);
  });

  it("validates the q parameter", async () => {
    expect((await fetch(`${apiUrl}/answer`)).status).toBe(400);
    expect((await fetch(`${apiUrl}/answer?q=${"a".repeat(501)}`)).status).toBe(400);
  });
});

describe("GeoCore server isolation and CORS", () => {
  const otherDataset: KnowledgeDataset = {
    ...apiDatasetFixture,
    id: "dataset_other",
    objects: [
      {
        id: "ko_other_only",
        slug: "oeufs",
        title: "Gestion des oeufs",
        summary: "Stock de plateaux d'oeufs.",
        body: "Les plateaux d'oeufs sont comptés chaque matin dans l'entrepôt.",
        language: "fr",
        status: "published",
        version: "1",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        author: "a",
      },
    ],
  };

  it("never serves vectors from another server's dataset", async () => {
    const a = createGeoCoreServer({ dataset: apiDatasetFixture });
    const b = createGeoCoreServer({ dataset: otherDataset });
    const infoA = await a.listen(0, "127.0.0.1");
    const infoB = await b.listen(0, "127.0.0.1");
    try {
      await fetch(`${infoA.url}/api/search/hybrid?q=détartrage`);
      const res = await (await fetch(`${infoB.url}/api/search/hybrid?q=détartrage`)).json();
      const ids = res.data.map((r: { objectId: string }) => r.objectId);
      expect(ids.every((id: string) => id === "ko_other_only")).toBe(true);
    } finally {
      await a.close();
      await b.close();
    }
  });

  it("scopes routeRequest's fallback vector store to the dataset", async () => {
    const calls: string[] = [];
    const fakeRes = (label: string) =>
      ({
        statusCode: 0,
        setHeader: () => undefined,
        end: (body: string) => calls.push(`${label}:${body}`),
      }) as never;
    const req = (url: string) => ({ url, method: "GET", headers: {} }) as never;

    await routeRequest(req("/api/search/hybrid?q=détartrage"), fakeRes("a"), { dataset: apiDatasetFixture });
    await routeRequest(req("/api/search/hybrid?q=détartrage"), fakeRes("b"), { dataset: otherDataset });
    expect(calls[1]).not.toContain("ko_detartrage_abime_dents");
  });

  it("only echoes allow-listed origins and honours origin:false", async () => {
    const listed = createGeoCoreServer({ dataset: apiDatasetFixture, cors: { origin: ["https://ok.example"] } });
    const disabled = createGeoCoreServer({ dataset: apiDatasetFixture, cors: { origin: false } });
    const l = await listed.listen(0, "127.0.0.1");
    const d = await disabled.listen(0, "127.0.0.1");
    try {
      const ok = await fetch(`${l.url}/api/health`, { headers: { Origin: "https://ok.example" } });
      expect(ok.headers.get("access-control-allow-origin")).toBe("https://ok.example");
      expect(ok.headers.get("vary")).toContain("Origin");

      const evil = await fetch(`${l.url}/api/health`, { headers: { Origin: "https://evil.example" } });
      expect(evil.headers.get("access-control-allow-origin")).toBeNull();

      const none = await fetch(`${d.url}/api/health`, { headers: { Origin: "https://ok.example" } });
      expect(none.headers.get("access-control-allow-origin")).toBeNull();
    } finally {
      await listed.close();
      await disabled.close();
    }
  });

  it("hides internal error details from 500 responses", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const broken = createGeoCoreServer({
      dataset: apiDatasetFixture,
      vectorStore: {
        count: async () => {
          throw new Error("connection string postgres://user:secret@db");
        },
      } as never,
    });
    const info = await broken.listen(0, "127.0.0.1");
    try {
      const res = await fetch(`${info.url}/api/health`);
      expect(res.status).toBe(500);
      expect(await res.text()).not.toContain("secret");
    } finally {
      await broken.close();
      errorSpy.mockRestore();
    }
  });
});
