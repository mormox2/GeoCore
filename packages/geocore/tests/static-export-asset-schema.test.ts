import { describe, it, expect } from "vitest";
import { staticExportAssetSchema } from "../src/schemas/static-export-asset.schema.js";
import { sampleExportAsset } from "../src/fixtures/static-export.fixture.js";

describe("Static Export Asset Schema Tests", () => {
  it("passes for a valid asset", () => {
    const result = staticExportAssetSchema.safeParse(sampleExportAsset);
    expect(result.success).toBe(true);
  });

  it("fails for an invalid asset type", () => {
    const result = staticExportAssetSchema.safeParse({
      ...sampleExportAsset,
      type: "html",
    });
    expect(result.success).toBe(false);
  });

  it("fails for an invalid path (leading slash)", () => {
    const result = staticExportAssetSchema.safeParse({
      ...sampleExportAsset,
      path: "/fr/sample.md",
    });
    expect(result.success).toBe(false);
  });

  it("fails for an invalid path (..)", () => {
    const result = staticExportAssetSchema.safeParse({
      ...sampleExportAsset,
      path: "../fr/sample.md",
    });
    expect(result.success).toBe(false);
  });

  it("fails for an invalid path (query)", () => {
    const result = staticExportAssetSchema.safeParse({
      ...sampleExportAsset,
      path: "fr/sample.md?x=1",
    });
    expect(result.success).toBe(false);
  });

  it("fails for an invalid path (hash)", () => {
    const result = staticExportAssetSchema.safeParse({
      ...sampleExportAsset,
      path: "fr/sample.md#section",
    });
    expect(result.success).toBe(false);
  });

  it("fails when content is missing", () => {
    const { content, ...rest } = sampleExportAsset;
    void content;
    const result = staticExportAssetSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("fails for invalid visibility", () => {
    const result = staticExportAssetSchema.safeParse({
      ...sampleExportAsset,
      visibility: "private",
    });
    expect(result.success).toBe(false);
  });

  it("fails for invalid encoding", () => {
    const result = staticExportAssetSchema.safeParse({
      ...sampleExportAsset,
      encoding: "base64",
    });
    expect(result.success).toBe(false);
  });

  it("fails when required fields are missing", () => {
    const { id, path, content, generatedAt, ...rest } = sampleExportAsset;
    void id;
    void path;
    void content;
    void generatedAt;
    const result = staticExportAssetSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
