import { describe, it, expect } from "vitest";
import { validateStaticExportAsset } from "../src/export/validate-static-export-asset.js";
import { validateStaticExportBundle } from "../src/export/validate-static-export-bundle.js";
import { generateStaticExport } from "../src/export/static-exporter.js";
import {
  sampleExportAsset,
  rtimiDentalExportInput,
} from "../src/fixtures/static-export.fixture.js";
import type { StaticExportBundle } from "../src/types/static-export.js";
import type { StaticExportAsset } from "../src/types/static-export-asset.js";

describe("Static Export Validation Tests", () => {
  describe("validateStaticExportAsset", () => {
    it("passes for a valid asset", () => {
      const result = validateStaticExportAsset(sampleExportAsset);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("fails for a missing path", () => {
      const result = validateStaticExportAsset({ ...sampleExportAsset, path: "" });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_ASSET_PATH_MISSING")).toBe(true);
    });

    it("fails for an invalid path", () => {
      const result = validateStaticExportAsset({ ...sampleExportAsset, path: "/abs.md" });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_ASSET_PATH_INVALID")).toBe(true);
    });

    it("fails for a path with ..", () => {
      const result = validateStaticExportAsset({ ...sampleExportAsset, path: "../x.md" });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_ASSET_PATH_INVALID")).toBe(true);
    });

    it("fails for an invalid type", () => {
      const result = validateStaticExportAsset({
        ...sampleExportAsset,
        type: "html" as StaticExportAsset["type"],
      });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_ASSET_TYPE_INVALID")).toBe(true);
    });

    it("fails for invalid encoding", () => {
      const result = validateStaticExportAsset({
        ...sampleExportAsset,
        encoding: "base64" as StaticExportAsset["encoding"],
      });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_ASSET_ENCODING_INVALID")).toBe(true);
    });
  });

  describe("validateStaticExportBundle", () => {
    const validBundle: StaticExportBundle = generateStaticExport(rtimiDentalExportInput);

    it("passes for a valid generated bundle", () => {
      const result = validateStaticExportBundle(validBundle);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });

    it("fails for a duplicate asset path", () => {
      const dupAsset = { ...validBundle.assets[0] };
      const bundle: StaticExportBundle = {
        ...validBundle,
        assets: [...validBundle.assets, dupAsset],
      };
      const result = validateStaticExportBundle(bundle);
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_ASSET_PATH_DUPLICATE")).toBe(true);
    });

    it("fails for a duplicate asset ID", () => {
      const dupAsset = { ...validBundle.assets[0], path: "different/path.md" };
      const bundle: StaticExportBundle = {
        ...validBundle,
        assets: [...validBundle.assets, dupAsset],
      };
      const result = validateStaticExportBundle(bundle);
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_ASSET_ID_DUPLICATE")).toBe(true);
    });

    it("fails when a manifest asset points to a missing asset", () => {
      const bundle: StaticExportBundle = {
        ...validBundle,
        manifest: {
          ...validBundle.manifest,
          assets: [
            ...validBundle.manifest.assets,
            {
              id: "nonexistent",
              type: "markdown",
              path: "ghost.md",
              mimeType: "text/markdown",
              sourceIds: [],
            },
          ],
        },
      };
      const result = validateStaticExportBundle(bundle);
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_MANIFEST_ASSET_MISSING")).toBe(true);
    });

    it("fails for missing siteName", () => {
      const result = validateStaticExportBundle({ ...validBundle, siteName: "" });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_BUNDLE_SITE_NAME_MISSING")).toBe(true);
    });

    it("fails for missing id", () => {
      const result = validateStaticExportBundle({ ...validBundle, id: "" });
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_BUNDLE_ID_MISSING")).toBe(true);
    });

    it("no objects produces a warning only (does not block publication)", () => {
      const emptyBundle = generateStaticExport({ ...rtimiDentalExportInput, objects: [] });
      const result = validateStaticExportBundle(emptyBundle);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_NO_OBJECTS")).toBe(true);
      // warning should not block publication if no errors — but empty bundle has
      // only the manifest asset which is valid, so publishable stays true.
      expect(result.publishable).toBe(true);
    });

    it("fails when a public bundle contains an internal asset", () => {
      const internalAsset = { ...validBundle.assets[0], visibility: "internal" as const };
      const bundle: StaticExportBundle = {
        ...validBundle,
        assets: [...validBundle.assets, internalAsset],
      };
      const result = validateStaticExportBundle(bundle, "public");
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.code === "GC_EXPORT_PUBLIC_INTERNAL_ASSET")).toBe(true);
    });
  });
});
