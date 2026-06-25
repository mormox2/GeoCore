# Playbook — Publishing an Article output

An article is a renderer output — typically narrative layout over one primary [Knowledge Object](../concepts/knowledge-object.md) plus related objects.

## Steps

1. Ensure the canonical object is complete and reviewed.
2. Choose article renderer and channel (web, syndication, LLM excerpt).
3. Set metadata (publishedAt, author, geo scope if any).
4. Render and publish.
5. Register output URL or API endpoint back as metadata on the object (optional relation).

## Do not

- Fork content into a separate "articles" folder that diverges from the object
