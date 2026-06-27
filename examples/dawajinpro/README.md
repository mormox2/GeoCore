# Dawajin Pro GeoCore Example

This example demonstrates how Dawajin Pro can use GeoCore to manage structured product and business knowledge.

It includes:

- SaaS product Knowledge Objects;
- poultry distribution business Entities;
- product workflow Entities;
- glossary entries;
- graph relationships;
- product review citations;
- media metadata;
- validation pipeline;
- static export generation.

## Commands

```bash
npm run validate
npm run export
npm run inspect
```

## Product Safety

This example does not include real customer data, tenant data, private financial data, API keys, Supabase service role keys, or Konnect secrets.

Konnect is documented as pre-production until the merchant account is activated, validated, and tested with real controlled payments and webhooks.

## Expected outputs

The export command generates:

* Markdown
* JSON
* JSON-LD
* search-index.json
* llms.txt
* llms-full.txt
* sitemap.xml
* manifest.json
