import type {
  KnowledgeObject,
  KnowledgeDataset,
  ResolvedMetadata,
} from "@mormox2/geocore";
import { resolveMetadata } from "@mormox2/geocore";

/**
 * Next.js compatible Metadata interface (App Router).
 */
export type NextMetadata = {
  title?: string;
  description?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
  keywords?: string[];
  authors?: Array<{ name: string; url?: string }>;
  other?: Record<string, string | number | boolean>;
};

export type GenerateNextMetadataOptions = {
  siteName?: string;
  defaultLocale?: string;
  fallbackSiteUrl?: string;
  customDefaults?: Partial<ResolvedMetadata>;
};

/**
 * Generates a full Next.js App Router `Metadata` object from a KnowledgeObject
 * and its KnowledgeDataset.
 */
export function generateNextMetadata(
  object: KnowledgeObject,
  dataset: KnowledgeDataset,
  options: GenerateNextMetadataOptions = {}
): NextMetadata {
  const { siteName, defaultLocale = "fr_FR", fallbackSiteUrl } = options;

  // Resolve metadata for the object
  const metadata: ResolvedMetadata = resolveMetadata({
    object,
    entities: dataset.entities,
    collections: dataset.collections,
    defaults: options.customDefaults ?? {},
  });

  const title = metadata.seo?.title || object.title;
  const description = metadata.seo?.description || metadata.summary || object.summary;
  const canonicalUrl = metadata.canonicalUrl || (fallbackSiteUrl ? `${fallbackSiteUrl}/${object.slug}` : undefined);

  // Alternate links
  const alternates: NextMetadata["alternates"] = {};
  if (canonicalUrl) {
    alternates.canonical = canonicalUrl;
  }
  if (object.translations) {
    alternates.languages = object.translations;
  }

  // OpenGraph images from attached media
  const ogImages: NonNullable<NonNullable<NextMetadata["openGraph"]>["images"]> = [];
  if (dataset.media) {
    const linkedMedia = dataset.media.filter(
      (m) =>
        m.relatedObjectIds?.includes(object.id) &&
        m.status === "active" &&
        m.visibility === "public" &&
        (m.type === "image" || m.type === "diagram" || m.type === "screenshot")
    );

    for (const media of linkedMedia) {
      const url = media.canonicalUrl || media.source;
      if (url) {
        ogImages.push({
          url,
          width: media.width,
          height: media.height,
          alt: media.altText || media.title,
        });
      }
    }
  }

  const openGraph: NextMetadata["openGraph"] = {
    title,
    description,
    url: canonicalUrl,
    siteName,
    locale: object.language ? `${object.language}_${object.language.toUpperCase()}` : defaultLocale,
    type: "article",
    images: ogImages.length > 0 ? ogImages : undefined,
  };

  // Robots
  const isPublished = object.status === "published";
  const robots: NextMetadata["robots"] = {
    index: isPublished,
    follow: isPublished,
  };

  // Authors
  const authors: NextMetadata["authors"] = [];
  if (object.author) {
    authors.push({ name: object.author });
  }

  // Keywords
  const keywords = metadata.seo?.keywords || object.tags || [];

  return {
    title,
    description,
    alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
    openGraph,
    robots,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: authors.length > 0 ? authors : undefined,
  };
}
