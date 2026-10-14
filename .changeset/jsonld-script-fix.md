---
"@mormo_mossaab/geocore-next": patch
---

Fix `renderJsonLdTag` / `formatJsonLdScript` with the output of `generateJsonLd`: the function looked for a `jsonld` property while `SchemaOutput` names it `jsonLd`, so the whole wrapper (id, diagnostics, …) was embedded in the `<script type="application/ld+json">` tag instead of the Schema.org document, which search engines could not read.
