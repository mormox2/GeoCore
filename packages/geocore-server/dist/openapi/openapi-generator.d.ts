export type OpenApiInfo = {
    title?: string;
    version?: string;
    description?: string;
};
/**
 * Generates an OpenAPI 3.1.0 specification for the GeoCore REST API.
 */
export declare function generateOpenApiSpec(info?: OpenApiInfo): object;
