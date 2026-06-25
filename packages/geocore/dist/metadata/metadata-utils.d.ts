import { ResolvedMetadata } from "../types/metadata.js";
export declare function dedupeMetadataArray(values?: string[]): string[];
export declare function mergeMetadataArrays(...arrays: Array<string[] | undefined>): string[];
export declare function hasCanonicalUrl(metadata: ResolvedMetadata): boolean;
export declare function isPublished(metadata: ResolvedMetadata): boolean;
