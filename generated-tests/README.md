# Generated Tests

Files in this directory are generated artifacts.

- They are intentionally outside the default WDIO spec path.
- They can be overwritten at any time by the prompt spec generator.
- Do not hand-edit them unless you are explicitly prototyping something temporary.

Use the prompt specs under `prompts/android/` as the source of truth and regenerate artifacts with:

```bash
npm run spec:generate -- prompts/android/auth/login.md
```
