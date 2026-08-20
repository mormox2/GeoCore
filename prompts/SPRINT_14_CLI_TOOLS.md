# GeoCore Sprint 14 — CLI Tools

You are working on the GeoCore project.

GeoCore is an AI-native Knowledge Operating System.

Sprint 13 implemented the Validation Pipeline in `packages/geocore`.

This sprint must implement **Sprint 14 only**.

Do not start Sprint 15.

---

# Goal

Implement the **GeoCore CLI Package**:

```txt
packages/geocore-cli
```

The CLI enables developers and CI/CD pipelines to initialize knowledge repositories, discover files, validate entire knowledge datasets against the validation pipeline, inspect dataset statistics, and write static multi-projection export bundles to disk.

This sprint must focus only on:

* CLI package setup (`packages/geocore-cli`);
* configuration loading (`geocore.config.json`);
* recursive file discovery (`discoverKnowledgeFiles`) with glob include/exclude patterns;
* file system reading (`readKnowledgeFiles`) into `RawKnowledgeInput` items;
* atomic file system writing (`writeExportBundle`);
* 4 core CLI commands:
  * `geocore init`: Scaffolds `geocore.config.json` and starter directories;
  * `geocore validate`: Discovers, loads, and executes the validation pipeline;
  * `geocore export`: Validates and writes all static export assets to disk;
  * `geocore inspect`: Discovers, loads, and prints dataset inventory summaries;
* pretty terminal output formatters and `--json` machine-readable output;
* exit code conventions (`EXIT_CODES`: 0 = Success, 1 = Validation Error, 2 = Config/CLI Error);
* comprehensive CLI unit and integration tests.

---

# Required package structure

```txt
packages/geocore-cli/
├── src/
│   ├── index.ts
│   ├── bin.ts
│   ├── cli.ts
│   ├── commands/
│   │   ├── init.command.ts
│   │   ├── validate.command.ts
│   │   ├── export.command.ts
│   │   └── inspect.command.ts
│   ├── config/
│   │   ├── geocore-config.ts
│   │   ├── load-config.ts
│   │   └── default-config.ts
│   ├── fs/
│   │   ├── discover-files.ts
│   │   ├── read-knowledge-files.ts
│   │   └── write-export-bundle.ts
│   ├── output/
│   │   ├── format-validation-report.ts
│   │   ├── format-export-summary.ts
│   │   └── format-inspect-output.ts
│   └── utils/
│       ├── exit-codes.ts
│       ├── parse-args.ts
│       └── cli-error.ts
├── tests/
│   ├── config.test.ts
│   ├── discover-files.test.ts
│   ├── init-command.test.ts
│   ├── validate-command.test.ts
│   ├── export-command.test.ts
│   ├── inspect-command.test.ts
│   └── cli-args.test.ts
├── package.json
└── tsconfig.json
```

---

# CLI Command Specifications

### 1. `geocore init`
Creates a standard `geocore.config.json` configuration file and starter `knowledge/` folder structure.

### 2. `geocore validate`
* Loads `geocore.config.json`.
* Discovers knowledge markdown and json files recursively.
* Ingests raw files via `loadKnowledgeDataset`.
* Runs `runValidationPipeline`.
* Prints human-friendly or JSON report.
* Returns exit code 0 if valid, exit code 1 if errors found.

### 3. `geocore export`
* Discovers and validates knowledge dataset.
* Generates `StaticExportBundle` via `generateStaticExport`.
* Writes all assets (`.md`, `.json`, `.schema.json`, `search-index.json`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `manifest.json`) to target `outputDir`.
* Returns exit code 0 on success.

### 4. `geocore inspect`
* Discovers and loads dataset.
* Prints summary breakdown: count of Knowledge Objects, Entities, Relationships, Taxonomies, Glossaries, Citations, Media, and Diagnostics.

---

# Acceptance Criteria

1. CLI binary `geocore` runs correctly across platforms.
2. `geocore validate` catches errors and outputs formatted diagnostics.
3. `geocore export` writes all 8 artifact types to disk.
4. Relative configuration paths (`knowledgeDir`, `outputDir`) resolve correctly.
5. All CLI test suites pass with 100% success.
