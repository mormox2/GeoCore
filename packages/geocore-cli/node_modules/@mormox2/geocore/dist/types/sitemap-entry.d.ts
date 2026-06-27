import { SitemapChangeFrequency, SitemapVisibility, SitemapAlternateLink, SitemapImage } from "./sitemap.js";
export type SitemapEntry = {
    id: string;
    sourceId: string;
    sourceType: string;
    url: string;
    language?: string;
    lastModified?: string;
    changeFrequency?: SitemapChangeFrequency;
    priority?: number;
    visibility: SitemapVisibility;
    status: string;
    alternates: SitemapAlternateLink[];
    images: SitemapImage[];
    generatedAt: string;
};
