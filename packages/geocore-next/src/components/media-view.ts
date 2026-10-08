import type { MediaAsset } from "@mormo_mossaab/geocore";
import {
  formatImageHtml,
  formatVideoHtml,
  formatMediaAttribution,
  getMediaAltText,
  getMediaCaption,
  escapeHtml,
} from "@mormo_mossaab/geocore";

/**
 * Renders a full accessible media figure element containing the media and caption/attribution.
 */
export function renderMediaFigureHtml(media: MediaAsset): string {
  const isVideo = media.type === "video";
  const mediaElement = isVideo ? formatVideoHtml(media) : formatImageHtml(media);

  const caption = getMediaCaption(media);
  const attribution = formatMediaAttribution(media);

  const captionParts: string[] = [];
  if (caption) captionParts.push(`<span class="geocore-caption-text">${escapeHtml(caption)}</span>`);
  if (attribution) captionParts.push(`<span class="geocore-attribution-text">${escapeHtml(attribution)}</span>`);

  const figcaption =
    captionParts.length > 0 ? `  <figcaption>${captionParts.join(" — ")}</figcaption>\n` : "";

  return (
    `<figure class="geocore-media-figure" data-media-type="${escapeHtml(media.type)}">\n` +
    `  ${mediaElement}\n` +
    figcaption +
    `</figure>`
  );
}
