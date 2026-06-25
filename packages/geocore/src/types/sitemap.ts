import { KnowledgeObject } from "./knowledge-object.js";
import { ResolvedMetadata } from "./metadata.js";
import { MediaAsset } from "./media.js";
import { SitemapEntry } from "./sitemap-entry.js";
import { SitemapDiagnostic } from "./sitemap-diagnostic.js";

export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SitemapVisibility =
  | "public"
  | "internal"
  | "private"
  | "hidden";

export type SitemapAlternateLink = {
  language: string;
  url: string;
};

export type SitemapImage = {
  url: string;
  title?: string;
  caption?: string;
};

export type GenerateSitemapInput = {
  id: string;
  siteUrl?: string;
  language?: string;

  objects: KnowledgeObject[];
  metadata?: Record<string, ResolvedMetadata>;
  media?: MediaAsset[];

  alternates?: Record<string, SitemapAlternateLink[]>;
  explicitUrls?: Record<string, string>;

  defaultChangeFrequency?: SitemapChangeFrequency;
  defaultPriority?: number;

  visibility?: "public" | "internal";
};

export type SitemapOutputType = "urlset" | "index";

export type SitemapOutput = {
  id: string;
  type: SitemapOutputType;
  siteUrl?: string;
  language?: string;
  entries: SitemapEntry[];
  xml: string;
  generatedAt: string;
  diagnostics: SitemapDiagnostic[];
};
