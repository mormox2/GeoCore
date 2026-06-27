import { ResolvedMetadata } from "../types/metadata.js";

export function dedupeMetadataArray(values?: string[]): string[] {
  if (!values) return [];
  return Array.from(new Set(values.filter(Boolean)));
}

export function mergeMetadataArrays(...arrays: Array<string[] | undefined>): string[] {
  const merged: string[] = [];
  for (const arr of arrays) {
    if (arr) {
      merged.push(...arr);
    }
  }
  return dedupeMetadataArray(merged);
}

export function hasCanonicalUrl(metadata: ResolvedMetadata): boolean {
  return !!metadata.canonicalUrl || !!metadata.seo?.canonicalUrl;
}

export function isPublished(metadata: ResolvedMetadata): boolean {
  return metadata.status === "published";
}
