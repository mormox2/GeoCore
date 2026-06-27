export type GeoCoreCliConfig = {
    siteName: string;
    siteUrl?: string;
    language?: string;
    knowledgeDir: string;
    outputDir: string;
    include?: string[];
    exclude?: string[];
    validation?: {
        mode?: "public" | "internal";
        failFast?: boolean;
    };
    export?: {
        includeMarkdown?: boolean;
        includeJson?: boolean;
        includeJsonLd?: boolean;
        includeSearchIndex?: boolean;
        includeLlmsTxt?: boolean;
        includeLlmsFullTxt?: boolean;
        includeSitemap?: boolean;
    };
};
