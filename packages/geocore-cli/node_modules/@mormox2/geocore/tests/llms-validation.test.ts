import { describe, it, expect } from "vitest";
import { validateLlmsOutput } from "../src/llms/validate-llms-output.js";
import { LlmsOutput } from "../src/types/llms-output.js";
import * as codes from "../src/validation/validation-codes.js";

describe("LLMs Output Validation Tests", () => {
  const validOutput: LlmsOutput = {
    id: "llms_txt_my_site",
    type: "llms.txt",
    siteName: "My Site",
    content: "# My Site\nSome content.",
    sourceObjectIds: ["ko_1"],
    generatedAt: "2026-06-25T11:00:00Z",
    diagnostics: [],
  };

  it("should pass validation for a fully valid LlmsOutput", () => {
    const result = validateLlmsOutput(validOutput);
    expect(result.valid).toBe(true);
  });

  it("should fail validation if missing output ID", () => {
    const invalid = { ...validOutput, id: "" };
    const result = validateLlmsOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_LLMS_OUTPUT_ID_MISSING)).toBe(true);
  });

  it("should fail validation if type is invalid", () => {
    const invalid = { ...validOutput, type: "invalid_type" as any };
    const result = validateLlmsOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_LLMS_OUTPUT_TYPE_INVALID)).toBe(true);
  });

  it("should fail validation if siteName is missing", () => {
    const invalid = { ...validOutput, siteName: "" };
    const result = validateLlmsOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_LLMS_SITE_NAME_MISSING)).toBe(true);
  });

  it("should fail validation if content is missing", () => {
    const invalid = { ...validOutput, content: "" };
    const result = validateLlmsOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_LLMS_CONTENT_MISSING)).toBe(true);
  });

  it("should fail validation and flag error if internal risk keywords are present in content", () => {
    const invalid = { ...validOutput, content: "# My Site\nThis has [private] data!" };
    const result = validateLlmsOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_LLMS_INTERNAL_CONTENT_RISK)).toBe(true);
  });
});
