import type { MediaAsset } from "../types/media.js";
export type MediaSchemaOutput = {
    "@context": "https://schema.org";
    "@type": "ImageObject" | "VideoObject" | "AudioObject" | "MediaObject";
    name: string;
    description?: string;
    url?: string;
    contentUrl?: string;
    encodingFormat?: string;
    width?: string;
    height?: string;
    duration?: string;
    caption?: string;
    license?: string;
    creditText?: string;
    thumbnailUrl?: string;
    inLanguage?: string;
};
/**
 * Generates a Schema.org ImageObject for an image media asset.
 */
export declare function generateImageObjectSchema(asset: MediaAsset): MediaSchemaOutput;
/**
 * Generates a Schema.org VideoObject for a video media asset.
 */
export declare function generateVideoObjectSchema(asset: MediaAsset): MediaSchemaOutput;
/**
 * Generates the appropriate Schema.org media schema based on the asset type.
 */
export declare function generateMediaSchema(asset: MediaAsset): MediaSchemaOutput | undefined;
