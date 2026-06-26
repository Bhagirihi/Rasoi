# Branch workflow

## Frozen production — `main`

- **Commit:** `92a4765` (2026-06-26)
- **Live:** https://rasoiapplication.in (Vercel production)
- **Rule:** No feature work on `main` unless explicitly releasing.

## Active development — `development`

- Created from the same frozen baseline as `main`.
- **All new changes** go on `development` first.
- Merge to `main` only after QA and an explicit release.

## Cursor agent

See `.cursor/rules/code-freeze-change-review.mdc` — review feasibility and warn once before implementing changes.
