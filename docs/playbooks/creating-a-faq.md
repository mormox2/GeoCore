# Playbook — Creating a FAQ output

A FAQ is **not** a content type. It is a [Knowledge Renderer](../concepts/knowledge-renderer.md) layout applied to one or more [Knowledge Objects](../concepts/knowledge-object.md).

## Steps

1. Identify or create knowledge objects (question/answer pairs or structured Q&A payload).
2. Group into a [Knowledge Collection](../concepts/knowledge-collection.md) if needed.
3. Select the FAQ renderer and channel.
4. Configure presentation (order, grouping, schema.org FAQPage if required).
5. Publish and verify output.

## Do not

- Create standalone FAQ markdown outside the knowledge model
- Duplicate object data in HTML when the object already holds the truth
