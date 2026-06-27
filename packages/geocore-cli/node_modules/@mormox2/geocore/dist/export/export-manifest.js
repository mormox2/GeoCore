/**
 * Create a manifest from a bundle (minus the manifest field).
 * The manifest indexes every asset without duplicating content.
 */
export function createStaticExportManifest(bundle) {
    const assets = bundle.assets.map((asset) => ({
        id: asset.id,
        type: asset.type,
        path: asset.path,
        mimeType: asset.mimeType,
        sourceIds: [...asset.sourceIds],
    }));
    return {
        id: `${bundle.id}_manifest`,
        bundleId: bundle.id,
        siteName: bundle.siteName,
        siteUrl: bundle.siteUrl,
        language: bundle.language,
        assets,
        generatedAt: bundle.generatedAt,
    };
}
