import { MediaAsset } from "../types/media.js";
/**
 * Recursively omits keys with undefined values from an object or array.
 * Does not mutate the input.
 */
export declare function omitUndefined<T extends Record<string, unknown>>(value: T): Partial<T>;
/**
 * Creates a deterministic SchemaOutput ID.
 */
export declare function createSchemaOutputId(sourceType: string, sourceId: string, schemaType: string): string;
/**
 * Safely stringifies schema content.
 */
export declare function safeStringifySchemaContent(content: unknown): string;
/**
 * Returns true if the MediaAsset is public.
 */
export declare function isPublicMediaAsset(media: MediaAsset): boolean;
/**
 * Maps a media type string to a Schema.org type string.
 */
export declare function mapMediaTypeToSchemaType(mediaType: string): string;
