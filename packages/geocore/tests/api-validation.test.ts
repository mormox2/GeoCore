import { describe, it, expect } from "vitest";
import { validateApiResponse } from "../src/api/validate-api-response.js";
import { createApiResponse, createNotFoundResponse } from "../src/api/api-response.js";

describe("API Validation", () => {
  it("validates a well-formed successful API response", () => {
    const res = createApiResponse({ id: "ko_test" });
    const result = validateApiResponse(res);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("validates a well-formed not-found response", () => {
    const res = createNotFoundResponse("ko_missing");
    const result = validateApiResponse(res);
    expect(result.valid).toBe(true);
  });

  it("returns error for null input", () => {
    const result = validateApiResponse(null);
    expect(result.valid).toBe(false);
  });

  it("returns error for missing status", () => {
    const invalid = { meta: { version: "1.0.0", generatedAt: "2026-01-01" } };
    const result = validateApiResponse(invalid);
    expect(result.valid).toBe(false);
  });

  it("returns error for missing meta.version", () => {
    const invalid = { status: "ok", meta: { generatedAt: "2026-01-01" } };
    const result = validateApiResponse(invalid);
    expect(result.valid).toBe(false);
  });

  it("warns when status ok has undefined data", () => {
    const res = {
      status: "ok",
      meta: { version: "1.0.0", generatedAt: "2026-01-01", visibility: "public" },
    };
    const result = validateApiResponse(res);
    expect(result.valid).toBe(true);
    expect(result.issues.some((i) => i.code === "GC_API_RESPONSE_DATA_MISSING")).toBe(true);
  });
});
