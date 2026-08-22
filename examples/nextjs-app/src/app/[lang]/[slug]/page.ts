import {
  generateNextMetadata,
  renderJsonLdTag,
  renderCitationBadgeHtml,
  renderMediaFigureHtml,
} from "@mormox2/geocore-next";
import { appDataset } from "../../../data/dataset.js";

export type PageProps = {
  params: {
    lang: string;
    slug: string;
  };
};

/**
 * Next.js 14+ App Router Server Component metadata generator.
 */
export async function generateMetadata({ params }: PageProps) {
  const object = appDataset.objects.find(
    (o) => o.slug === params.slug && (o.language === params.lang || !params.lang)
  );

  if (!object) return {};

  return generateNextMetadata(object, appDataset, {
    siteName: "RTimi Dental",
    fallbackSiteUrl: "https://rtimidental.tn",
    defaultLocale: params.lang || "fr",
  });
}

/**
 * Next.js 14+ Page component rendering Knowledge Object with SEO Schema, Citations & Media.
 */
export default async function KnowledgePage({ params }: PageProps) {
  const object = appDataset.objects.find(
    (o) => o.slug === params.slug && (o.language === params.lang || !params.lang)
  );

  if (!object) {
    return {
      status: 404,
      body: "Knowledge Object Not Found",
    };
  }

  // Related citations and media
  const citations = appDataset.citations.filter((c) => c.targetId === object.id);
  const mediaList = appDataset.media.filter((m) => m.relatedObjectIds?.includes(object.id));

  const jsonLdHtml = renderJsonLdTag({
    object,
    siteUrl: "https://rtimidental.tn",
    schemaType: "MedicalWebPage",
  });

  const citationBadges = citations.map((c) => {
    const source = appDataset.sources.find((s) => s.id === c.sourceId);
    return renderCitationBadgeHtml(c, source);
  });

  const mediaViews = mediaList.map((m) => renderMediaFigureHtml(m));

  return {
    status: 200,
    title: object.title,
    summary: object.summary,
    body: object.body,
    jsonLdHtml,
    citationBadges,
    mediaViews,
  };
}
