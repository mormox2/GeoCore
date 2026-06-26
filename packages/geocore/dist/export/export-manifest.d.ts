import type { StaticExportBundle, StaticExportManifest } from "../types/static-export.js";
/**
 * Create a manifest from a bundle (minus the manifest field).
 * The manifest indexes every asset without duplicating content.
 */
export declare function createStaticExportManifest(bundle: Omit<StaticExportBundle, "manifest">): StaticExportManifest;
