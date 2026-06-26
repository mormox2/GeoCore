import { describe, it, expect } from "vitest";
import { createStaticExportManifest } from "../src/export/export-manifest.js";
import { generateStaticExport } from "../src/export/static-exporter.js";
import { rtimiDentalExportInput } from "../src/fixtures/static-export.fixture.js";

describe("Export Manifest Tests", () => {
  it("lists generated assets", () => {
    const bundle = generateStaticExport(rtimiDentalExportInput);
    expect(bundle.manifest.assets.length).toBeGreaterThan(0);
    // Manifest asset count should match bundle asset count.
    expect(bundle.manifest.assets.length).toBe(bundle.assets.length);
  });

  it("does not include full content", () => {
    const bundle = generateStaticExport(rtimiDentalExportInput);
    for (const entry of bundle.manifest.assets) {
      expect(entry).not.toHaveProperty("content");
    }
  });

  it("every manifest asset exists in the bundle", () => {
    const bundle = generateStaticExport(rtimiDentalExportInput);
    const assetIds = new Set(bundle.assets.map((a) => a.id));
    for (const entry of bundle.manifest.assets) {
      expect(assetIds.has(entry.id)).toBe(true);
    }
  });

  it("manifest asset points to the correct path", () => {
    const bundle = generateStaticExport(rtimiDentalExportInput);
    const mdEntry = bundle.manifest.assets.find((e) => e.type === "markdown");
    const mdAsset = bundle.assets.find((a) => a.type === "markdown");
    expect(mdEntry!.path).toBe(mdAsset!.path);
  });

  it("createStaticExportManifest builds a manifest from a bundle", () => {
    const bundle = generateStaticExport(rtimiDentalExportInput);
    const { manifest: _original, ...rest } = bundle;
    void _original;
    const manifest = createStaticExportManifest(rest);
    expect(manifest.bundleId).toBe(bundle.id);
    expect(manifest.siteName).toBe(bundle.siteName);
    expect(manifest.assets.length).toBe(bundle.assets.length);
  });
});
