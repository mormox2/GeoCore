import type { MediaAsset } from "@mormox2/geocore";
import {
  formatImageHtml,
  formatVideoHtml,
  formatMediaAttribution,
  getMediaAltText,
  getMediaCaption,
} from "@mormox2/geocore";

/**
 * Renders a full accessible media figure element containing the media and caption/attribution.
 */
export function renderMediaFigureHtml(media: MediaAsset): string {
  const isVideo = media.type === "video";
  const mediaElement = isVideo ? formatVideoHtml(media) : formatImageHtml(media);

  const caption = getMediaCaption(media);
  const attribution = formatMediaAttribution(media);

  const captionParts: string[] = [];
  if (caption) captionParts.push(`<span class="geocore-caption-text">${caption}</span>`);
  if (attribution) captionParts.push(`<span class="geocore-attribution-text">${attribution}</span>`);

  const figcaption =
    captionParts.length > 0 ? `  <figcaption>${captionParts.join(" — ")}</figcaption>\n` : "";

  return (
    `<figure class="geocore-media-figure" data-media-type="${media.type}">\n` +
    `  ${mediaElement}\n` +
    figcaption +
    `</figure>`
  );
}
