# Prompt Specs

Prompt specs are the human-authored source files for generated mobile test artifacts.

## Location

- Store Android specs under `prompts/android/<feature>/<journey>.md`.
- Keep one Markdown spec per user journey.
- Put multiple related scenarios inside the same journey spec instead of creating one file per variation.

## Required format

Each spec must start with YAML front matter containing:

- `title`
- `feature`
- `journey`
- `platform`
- `generated_test`
- `page_objects`
- `tags`

Each spec body must contain these sections in order:

- `## Shared Context`
- `## Shared Rules`
- `## Shared Test Data`
- One or more `## Scenario: <name>` sections

Each scenario must contain:

- `### Goal`
- `### Steps`
- `### Assertions`
- `### Notes`

## Generation notes

- Keep steps intent-focused. Describe behavior and expected outcomes, not selectors or XPath.
- Use `### Notes` for generator hints such as `- flow: owner_manual_otp_login`.
- Reuse existing page objects and helpers from `tests/pageobjects/` and `tests/utils/`.
- Generated outputs are written to the path declared by `generated_test` and can be safely regenerated.

## Commands

Generate one spec:

```bash
npm run spec:generate -- prompts/android/auth/login.md
```

Generate all specs:

```bash
npm run spec:generate:all
```
