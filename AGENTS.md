# AGENTS.md

Working notes for agents/contributors on `type-to-table`.

## What this is

A tiny doc-gen CLI/library: read a `.tsx` component, extract its props' JSDoc (via
`react-docgen-typescript` — real TS-checker resolving, not a custom AST walker), and inject the
result as a markdown table into a README between marker comments (via `taglify`). No manual
props-table sync, ever. Node/Bun only — no browser runtime, no React dependency (`@types/react` is
dev-only, for parsing `.tsx` fixtures).

## Mental model

Two functions, both in `src/`:

- **`tttGet(filePath, options?)`** (`src/tttGet.ts`) — parses `filePath` with
  `react-docgen-typescript`'s `parse()`, picks one component's doc, and returns a markdown table
  string (`Prop | Type | Default | Description`).
- **`tttWrite(filePath, readmePath, options?)`** (`src/tttWrite.ts`) — calls `tttGet`, then
  `taglify`'s `taglWrite` to replace the content between `<!-- PROPS-TABLE:START -->` /
  `<!-- PROPS-TABLE:END -->` in `readmePath`. Returns whether the file changed.

`TttGetOptions`: `componentName` (disambiguates a file with multiple exported components —
`tttGet` throws asking for it rather than silently picking one), `maxDescriptionLength`
(truncates with `…`), `parserOptions` (passed straight through to `react-docgen-typescript`'s
`ParserOptions` — the escape hatch for `componentNameResolver`, `customComponentTypes`, etc.).

**The one hard rule, and don't fight it:** `react-docgen-typescript` needs a real component
(`FC<Props>`, class, `forwardRef`, …) using the props type to anchor resolving on. A type with
nothing rendering it in the same file returns zero docs — `tttGet` throws `No component found`.
Verified empirically (see `tests/frameworks.test.ts`): Vue SFCs, Angular classes, Svelte, and Astro
files all parse to `[]`, not an error — none of them are the React-FC shape the parser looks for.
This is documented in the README, not worked around.

**Table safety:** `escapeCell` in `src/tttGet.ts` escapes `|` and collapses newlines to `<br>`
before a row is built — every cell (type included: union types like `string | number` contain
literal pipes), not just description.

## Layout

- `src/tttGet.ts` — parsing + table-building + the multi-component disambiguation logic
  (`pickComponent`).
- `src/tttWrite.ts` — thin `taglWrite` wrapper around `tttGet`.
- `src/index.ts` — package entry; re-exports both + `TttGetOptions`.
- `scripts/docs-props.ts` — the `docs:props` CLI: `bun run docs:props -- path/to/Component.tsx
  [componentName]`, writes into `./README.md`, tag `PROPS-TABLE`.
- `examples/Button.tsx` — not a demo app, just the fixture the README's own "Props table" section
  is generated from (`bun run docs:props -- examples/Button.tsx`) — the tool documents itself as
  its own test case. Keep its JSDoc (including `@default`) in sync with what the README prose
  claims about it.
- `tests/fixtures/*.tsx` — `Widget.tsx` (baseline: `@default`, no-default prop, pipe/newline
  escaping), `MultiComponent.tsx` (two exported components, for `componentName` tests),
  `TypeOnly.tsx` (a type with no component — the "no component found" case).
- `tests/fixtures/frameworks/<name>/` — one folder per stack (`react`, `nextjs`, `remix` —
  supported; `vue`, `angular`, `svelte`, `astro` — not), each a component file + a `README.md`
  carrying real `PROPS-TABLE` markers. `tests/frameworks.test.ts` loops all of them: assert the
  markers start empty (`taglRead`), run `tttWrite`, assert content or a throw depending on
  `supported`, then reset to empty via `taglWrite` in a `finally` — so the fixtures stay clean in
  git between runs. Add a new stack by adding a folder + one entry in the `cases` array.
- `tests/tttGet.test.ts` / `tests/tttWrite.test.ts` — unit tests for each function in isolation.

## Commands

```bash
bun test               # run all tests (bun:test)
bun run typecheck      # tsc --noEmit
bun run build          # vite lib build → dist/index.{js,d.ts}
bun run format          # biome check --write
bun run docs:props -- path/to/Component.tsx [componentName]   # regenerate README's props table
```

## Conventions

- No bundled runtime deps beyond `react-docgen-typescript` + `taglify` — both real `dependencies`
  (this package's whole job is wrapping them). `@types/react` is dev-only; TS resolves `.tsx`
  fixtures' `import type { FC } from 'react'` against it without an actual `react` package
  installed (verified — don't re-add `react` as a dependency without checking that's still true).
- `config/vite.config.ts` externalizes `react-docgen-typescript`, `taglify`, and `node:*` — without
  that the build bundles the entire TypeScript compiler transitively (confirmed: ~4.4MB vs ~1.3kB).
- Biome for format/lint (`biome.json` → `config/biome.json`). TS strict. `config/opengrep/` holds
  vendored security-scan rules (`scripts/opengrep-scan.sh`, scans `src/` only).
- `bun scripts/docs-props.ts` (and thus `tttWrite`) mutates whatever README you point it at —
  when adding a new fixture under `tests/fixtures/frameworks/`, follow the reset-in-`finally`
  pattern from `tests/frameworks.test.ts` so a failed test run doesn't leave a dirty fixture
  checked in.

## History

Started from a copy of a sibling project's repo scaffold (`weighted-grid`, a React grid library —
unrelated) — `git log` before the rename commit still has that scaffold's structure if anything
here looks over-built for what's actually a two-function package.
