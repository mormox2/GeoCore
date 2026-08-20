import type { MediaAsset } from "../types/media.js";

// ─── RTimi Dental Media ───────────────────────────────────────────────────────

export const implantDiagramMedia: MediaAsset = {
  id: "media_implant_diagram_001",
  type: "diagram",
  title: "Dental Implant Anatomy Diagram",
  status: "active",
  visibility: "public",
  source: "/assets/media/implant-anatomy-diagram.svg",
  canonicalUrl: "https://rtimidental.fr/media/implant-anatomy-diagram.svg",
  altText: "Diagram showing the anatomy of a dental implant with crown, abutment, and fixture labeled.",
  caption: "Structure d'un implant dentaire. Source: Dr Mossaab Rtimi.",
  language: "fr",
  mimeType: "image/svg+xml",
  width: 800,
  height: 600,
  author: "Dr Mossaab Rtimi",
  owner: "RTimi Dental",
  copyright: "RTimi Dental 2026",
  relatedObjectIds: ["ko_dental_implant_guide"],
  relatedEntityIds: ["entity_dental_implant"],
  consentStatus: "not-required",
  createdAt: "2026-06-25T10:00:00Z",
  updatedAt: "2026-06-25T10:00:00Z",
};

export const scalingBeforeAfterMedia: MediaAsset = {
  id: "media_scaling_before_after_001",
  type: "image",
  title: "Dental Scaling Before and After",
  status: "active",
  visibility: "public",
  source: "/assets/media/scaling-before-after.jpg",
  canonicalUrl: "https://rtimidental.fr/media/scaling-before-after.jpg",
  altText: "Before and after images showing the effect of professional dental scaling on plaque removal.",
  caption: "Détartrage professionnel — résultats avant/après.",
  language: "fr",
  mimeType: "image/jpeg",
  width: 1200,
  height: 630,
  author: "RTimi Dental",
  copyright: "RTimi Dental 2026",
  relatedObjectIds: ["ko_detartrage_abime_dents"],
  relatedEntityIds: ["entity_scaling", "entity_tartar"],
  consentStatus: "not-required",
  createdAt: "2026-06-25T10:00:00Z",
  updatedAt: "2026-06-25T10:00:00Z",
};

// ─── Dawajin Pro Media ────────────────────────────────────────────────────────

export const dawajinDashboardScreenshotMedia: MediaAsset = {
  id: "media_dawajin_dashboard_screenshot_001",
  type: "screenshot",
  title: "Dawajin Pro Customer Balance Dashboard",
  status: "active",
  visibility: "public",
  source: "/assets/media/dawajin-balance-dashboard.png",
  canonicalUrl: "https://dawajin.pro/media/balance-dashboard.png",
  altText: "Screenshot of the Dawajin Pro customer balance dashboard showing balance history and payment status.",
  caption: "Tableau de bord des soldes clients dans Dawajin Pro.",
  language: "fr",
  mimeType: "image/png",
  width: 1440,
  height: 900,
  author: "Dawajin Team",
  copyright: "Dawajin Pro 2026",
  relatedObjectIds: ["ko_customer_balance_management"],
  relatedEntityIds: ["entity_customer_balance"],
  consentStatus: "not-required",
  createdAt: "2026-06-25T10:00:00Z",
  updatedAt: "2026-06-25T10:00:00Z",
};

export const dawajinInternalDocMedia: MediaAsset = {
  id: "media_dawajin_internal_flowchart_001",
  type: "pdf",
  title: "Internal Customer Balance Workflow Flowchart",
  status: "active",
  visibility: "internal",
  source: "/assets/internal/balance-workflow.pdf",
  language: "fr",
  mimeType: "application/pdf",
  author: "Dawajin Team",
  copyright: "Dawajin Pro 2026",
  consentStatus: "not-required",
  createdAt: "2026-06-25T10:00:00Z",
  updatedAt: "2026-06-25T10:00:00Z",
};

export const missingAltTextMedia: MediaAsset = {
  id: "media_no_alt_text_001",
  type: "image",
  title: "Image Without Alt Text",
  status: "active",
  visibility: "public",
  source: "/assets/media/no-alt.jpg",
  consentStatus: "not-required",
  createdAt: "2026-06-25T10:00:00Z",
  updatedAt: "2026-06-25T10:00:00Z",
};

export const allPublicMediaFixture: MediaAsset[] = [
  implantDiagramMedia,
  scalingBeforeAfterMedia,
  dawajinDashboardScreenshotMedia,
];

export const allMediaFixture: MediaAsset[] = [
  ...allPublicMediaFixture,
  dawajinInternalDocMedia,
];
