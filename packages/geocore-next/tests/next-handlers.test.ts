import { describe, it, expect } from "vitest";
import {
  handleLlmsTxt,
  handleLlmsFullTxt,
  handleSitemapXml,
  handleSearchApi,
  handleContextApi,
} from "../src/handlers/route-handler.js";
import { formatJsonLdScript, renderJsonLdTag } from "../src/components/json-ld.js";
import { createCitationBadgeData, renderCitationBadgeHtml } from "../src/components/citation-badge.js";
import { renderMediaFigureHtml } from "../src/components/media-view.js";
import {
  apiDatasetFixture,
  scalingCitation,
  whoOralHealthSource,
  scalingBeforeAfterMedia,
} from "../../geocore/src/index.js";

describe("Next.js Route Handlers", () => {
  it("handleLlmsTxt returns a plain text response", async () => {
    const res = handleLlmsTxt(apiDatasetFixture, { siteUrl: "https://rtimidental.tn" });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/plain");
    const text = await res.text();
    expect(text).toContain("# API Test Dataset");
  });

  it("handleLlmsFullTxt returns full documentation", async () => {
    const res = handleLlmsFullTxt(apiDatasetFixture, { siteUrl: "https://rtimidental.tn" });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("# API Test Dataset");
  });

  it("handleSitemapXml returns valid XML", async () => {
    const res = handleSitemapXml(apiDatasetFixture, { siteUrl: "https://rtimidental.tn" });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/xml");
    const xml = await res.text();
    expect(xml).toContain("<urlset");
  });

  it("handleSearchApi returns JSON search results", async () => {
    const res = handleSearchApi(apiDatasetFixture, "détartrage");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.data.length).toBeGreaterThan(0);
  });

  it("handleContextApi returns AI context bundle", async () => {
    const res = handleContextApi(apiDatasetFixture, "ko_detartrage_abime_dents");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.data.object.id).toBe("ko_detartrage_abime_dents");
  });
});

describe("Next.js Components Helpers", () => {
  it("formatJsonLdScript sanitizes against script injection", () => {
    const schema = { "@type": "Article", headline: "</script><script>alert(1)</script>" };
    const formatted = formatJsonLdScript(schema);
    expect(formatted).not.toContain("</script>");
    expect(formatted).toContain("\\u003c/script\\u003e");
  });

  it("renderJsonLdTag wraps in script tag", () => {
    const tag = renderJsonLdTag({ "@type": "Article" });
    expect(tag).toContain('<script type="application/ld+json">');
    expect(tag).toContain("</script>");
  });

  it("createCitationBadgeData generates UI badge data", () => {
    const data = createCitationBadgeData(scalingCitation, whoOralHealthSource);
    expect(data.isAuthoritative).toBe(true);
    expect(data.badgeLabel).toContain("Authoritative");
    expect(data.sourceText).toContain("WHO Oral Health");
  });

  it("renderCitationBadgeHtml produces accessible markup", () => {
    const html = renderCitationBadgeHtml(scalingCitation, whoOralHealthSource);
    expect(html).toContain('class="geocore-citation-badge"');
    expect(html).toContain('href="https://www.who.int');
  });

  it("renderMediaFigureHtml produces figure markup with caption", () => {
    const html = renderMediaFigureHtml(scalingBeforeAfterMedia);
    expect(html).toContain('<figure class="geocore-media-figure"');
    expect(html).toContain("<img");
    expect(html).toContain("<figcaption>");
  });
});
