import { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import * as codes from "../validation/validation-codes.js";
import type { ApiResponse } from "./api-types.js";

/**
 * Validates an ApiResponse envelope structure and business rules.
 */
export function validateApiResponse(response: unknown): ValidationResult {
  const checkedAt = new Date().toISOString();

  if (!response || typeof response !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: "GC_API_RESPONSE_NULL",
          severity: "error",
          code: codes.GC_API_RESPONSE_MISSING,
          message: "API response must be a non-null object.",
        },
      ],
    };
  }

  const res = response as ApiResponse<unknown>;
  const issues: ValidationIssue[] = [];

  // Check status
  if (!res.status || !["ok", "not-found", "error", "forbidden"].includes(res.status)) {
    issues.push({
      id: "GC_API_RESPONSE_STATUS_INVALID",
      severity: "error",
      code: codes.GC_API_RESPONSE_MISSING,
      message: "API response status is invalid or missing.",
      field: "status",
    });
  }

  // Check meta
  if (!res.meta || typeof res.meta !== "object") {
    issues.push({
      id: "GC_API_RESPONSE_META_MISSING",
      severity: "error",
      code: codes.GC_API_RESPONSE_MISSING,
      message: "API response meta envelope is missing.",
      field: "meta",
    });
  } else {
    if (!res.meta.version) {
      issues.push({
        id: "GC_API_RESPONSE_VERSION_MISSING",
        severity: "error",
        code: codes.GC_API_RESPONSE_VERSION_MISSING,
        message: "API response meta.version is missing.",
        field: "meta.version",
      });
    }
    if (!res.meta.generatedAt) {
      issues.push({
        id: "GC_API_RESPONSE_GENERATED_AT_MISSING",
        severity: "error",
        code: codes.GC_API_RESPONSE_MISSING,
        message: "API response meta.generatedAt is missing.",
        field: "meta.generatedAt",
      });
    }
  }

  // Status ok should have data
  if (res.status === "ok" && res.data === undefined) {
    issues.push({
      id: "GC_API_RESPONSE_DATA_MISSING",
      severity: "warning",
      code: codes.GC_API_RESPONSE_DATA_MISSING,
      message: "API response with status 'ok' has undefined data.",
      field: "data",
    });
  }

  // Status error/not-found/forbidden should have error message
  if (res.status !== "ok" && !res.error) {
    issues.push({
      id: "GC_API_RESPONSE_ERROR_MSG_MISSING",
      severity: "warning",
      code: codes.GC_API_RESPONSE_MISSING,
      message: `API response with status '${res.status}' is missing an error message.`,
      field: "error",
    });
  }

  const valid = issues.filter((i) => i.severity === "error").length === 0;
  const publishable = valid;

  return { valid, publishable, checkedAt, issues };
}
