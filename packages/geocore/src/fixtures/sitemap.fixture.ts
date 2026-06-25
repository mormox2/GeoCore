import { rtimidentalFixture } from "./rtimidental.fixture.js";
import { dawajinproFixture } from "./dawajinpro.fixture.js";
import { rtimiDentalResolvedMetadata, dawajinProResolvedMetadata } from "./search.fixture.js";
import { GenerateSitemapInput } from "../types/sitemap.js";

export const rtimiDentalSitemapInput: GenerateSitemapInput = {
  id: "sitemap_rtimi",
  siteUrl: "https://rtimidental.example.com",
  language: "fr",
  objects: [rtimidentalFixture],
  metadata: {
    ko_detartrage_abime_dents: rtimiDentalResolvedMetadata,
  },
  explicitUrls: {
    ko_detartrage_abime_dents:
      "https://rtimidental.example.com/fr/soins/detartrage-abime-t-il-les-dents",
  },
  alternates: {
    ko_detartrage_abime_dents: [
      {
        language: "ar",
        url: "https://rtimidental.example.com/ar/soins/detartrage-abime-t-il-les-dents",
      },
    ],
  },
  defaultChangeFrequency: "monthly",
  defaultPriority: 0.8,
};

export const dawajinProSitemapInput: GenerateSitemapInput = {
  id: "sitemap_dawajin",
  siteUrl: "https://dawajinpro.example.com",
  language: "fr",
  objects: [dawajinproFixture],
  metadata: {
    ko_customer_balance_management: dawajinProResolvedMetadata,
  },
  explicitUrls: {
    ko_customer_balance_management:
      "https://dawajinpro.example.com/fr/guide/gestion-creances-clients",
  },
  defaultChangeFrequency: "weekly",
  defaultPriority: 0.7,
};
