import { JsonLdObject } from "../types/json-ld.js";
export type BreadcrumbItem = {
    name: string;
    url?: string;
};
/**
 * Creates a Schema.org BreadcrumbList JSON-LD object.
 */
export declare function createBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject;
