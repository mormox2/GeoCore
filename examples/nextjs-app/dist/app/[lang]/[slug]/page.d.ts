export type PageProps = {
    params: {
        lang: string;
        slug: string;
    };
};
/**
 * Next.js 14+ App Router Server Component metadata generator.
 */
export declare function generateMetadata({ params }: PageProps): Promise<import("@mormox2/geocore-next").NextMetadata>;
/**
 * Next.js 14+ Page component rendering Knowledge Object with SEO Schema, Citations & Media.
 */
export default function KnowledgePage({ params }: PageProps): Promise<{
    status: number;
    body: string;
    title?: undefined;
    summary?: undefined;
    jsonLdHtml?: undefined;
    citationBadges?: undefined;
    mediaViews?: undefined;
} | {
    status: number;
    title: string;
    summary: string;
    body: string;
    jsonLdHtml: string;
    citationBadges: string[];
    mediaViews: string[];
}>;
