import { describe, it, expect } from "vitest";
import {
  createApiResponse,
  createApiListResponse,
  createNotFoundResponse,
  createForbiddenResponse,
  createErrorResponse,
} from "../src/api/api-response.js";
import { GC_API_VERSION } from "../src/api/api-types.js";

describe("API Response Factory", () => {
  it("creates a standard ok response envelope", () => {
    const res = createApiResponse({ id: "test_1" });
    expect(res.status).toBe("ok");
    expect(res.data).toEqual({ id: "test_1" });
    expect(res.meta.version).toBe(GC_API_VERSION);
    expect(res.meta.visibility).toBe("public");
    expect(res.meta.generatedAt).toBeTruthy();
  });

  it("creates a list response with correct count and total", () => {
    const items = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const res = createApiListResponse(items, { total: 10 });
    expect(res.status).toBe("ok");
    expect(res.data).toHaveLength(3);
    expect(res.meta.count).toBe(3);
    expect(res.meta.total).toBe(10);
  });

  it("creates a not-found response with error message", () => {
    const res = createNotFoundResponse("ko_missing");
    expect(res.status).toBe("not-found");
    expect(res.error).toContain("ko_missing");
    expect(res.data).toBeUndefined();
  });

  it("creates a forbidden response with error message", () => {
    const res = createForbiddenResponse("Private access disallowed");
    expect(res.status).toBe("forbidden");
    expect(res.error).toBe("Private access disallowed");
  });

  it("creates an error response with error message", () => {
    const res = createErrorResponse("Server processing error");
    expect(res.status).toBe("error");
    expect(res.error).toBe("Server processing error");
  });
});
