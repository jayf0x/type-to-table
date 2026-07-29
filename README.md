# type-to-table

<!-- README_HEAD:START -->

[![npm version](https://img.shields.io/npm/v/type-to-table)](https://www.npmjs.com/package/type-to-table)
[![types](https://img.shields.io/npm/types/type-to-table)](./src/index.ts)
[![CI](https://github.com/jayf0x/type-to-table/actions/workflows/ci.yml/badge.svg)](https://github.com/jayf0x/type-to-table/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/type-to-table)](./LICENSE)

<!-- README_HEAD:END -->

**Type in, table out.** 📐

Your component's props are already documented — in the JSDoc above each field. `type-to-table`
reads a `.tsx` component, resolves its props type with the real TypeScript checker, and writes a
markdown table straight into your README. Re-run it after every prop change to keep the table in
sync with the type.

## Why not just write it by hand?

|                 | type-to-table                                  | hand-maintained table           | Storybook autodocs                |
| --------------- | ---------------------------------------------- | ------------------------------- | --------------------------------- |
| Source of truth | the type + its JSDoc                           | whatever you remember to update | the type, via a running Storybook |
| Drift           | none — re-run after any prop change            | guaranteed, eventually          | none, but only inside Storybook   |
| Output          | one markdown table, in your README             | markdown, wherever you put it   | a browsable UI, not your README   |
| Setup           | one exported component + JSDoc `@default` tags | none                            | Storybook + a story per component |
| Runtime deps    | zero (dev-only)                                | zero                            | a whole Storybook instance        |

Use Storybook when you want an interactive playground. Reach for this when you just want the
README table that's already true.

## What's new

<!-- WHATSNEW:START -->
| Version | Highlights |
| ------- | ---------- |
| `1.0.0` | Auto-generate React props documentation tables in README from JSDoc |
| `0.0.0` | Initial setup — `tttGet` / `tttWrite` / `docs:props` CLI |
<!-- WHATSNEW:END -->

Full history in [CHANGELOG.md](./CHANGELOG.md).

## Install

```bash
bun add -D type-to-table   # npm / pnpm / yarn all fine
```

## Quick start

Write JSDoc above each prop, `@default` included:

```tsx
// examples/Button.tsx
import type { FC } from "react";

export type ButtonProps = {
  /** Button label. */
  label: string;
  /** Visual style. @default 'primary' */
  variant?: "primary" | "secondary";
  /** Disables interaction. @default false */
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({ label }) => label;
```

Drop a pair of marker comments into your README — `type-to-table` replaces whatever sits between
them, so name the tag whatever you like (this repo uses `PROPS-TABLE`, see below). Then run:

```bash
bun run docs:props -- examples/Button.tsx
```

The content between the markers gets replaced with the generated table — see
[Props table](#props-table) below, generated from this exact file.

## The rules

Three things, and you've seen the whole tool.

**1 · A component has to anchor the type.** `react-docgen-typescript` resolves props from a real
component using the type — `FC<Props>`, a class component, `forwardRef`, etc. A type sitting alone
with nothing rendering it has nothing to anchor resolving on, and `tttGet` throws
`No component found`. Don't fight this — export the type from the file that also exports the
component using it.

**2 · `@default` is the only source of the Default column.** A type has no runtime value: no
`defaultProps`, usually no destructured default either. Without a `@default X` tag in the JSDoc,
the Default column is just empty for that prop.

**3 · One pass, safe by construction.** `|` gets escaped and newlines become `<br>` before a row is
built, so a multi-line or pipe-containing description can't break the table. Long descriptions can
be capped with `maxDescriptionLength`; a file with more than one exported component needs
`componentName` to say which one.

## API

```ts
import { tttGet, tttWrite } from "type-to-table";
```

### `tttGet(filePath, options?)`

Parses `filePath` and returns the props table as a markdown string.

| Option                 | Type            | Default | What it does                                                                                                             |
| ---------------------- | --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `componentName`        | `string`        | —       | Which component to document when the file exports more than one.                                                         |
| `maxDescriptionLength` | `number`        | —       | Truncates each prop's description to this many characters, with `…`.                                                     |
| `parserOptions`        | `ParserOptions` | —       | Passed straight through to `react-docgen-typescript`'s `parse()` — e.g. `componentNameResolver`, `customComponentTypes`. |

### `tttWrite(filePath, readmePath, options?)`

Calls `tttGet(filePath, options)` and writes the result into `readmePath` between the tag's marker
comments (via `taglify`'s `taglWrite`). Returns whether the file changed.

### CLI

```bash
bun run docs:props -- path/to/Component.tsx [componentName]
```

Writes into `./README.md`, tag `PROPS-TABLE`. Wraps `tttWrite` — see
[scripts/docs-props.ts](./scripts/docs-props.ts) if you need a different target file or tag.

## Props table

Generated by running `bun run docs:props -- examples/Button.tsx` against
[examples/Button.tsx](./examples/Button.tsx) — this section is the tool's own test case.

<!-- PROPS-TABLE:START -->

| Prop      | Type                     | Default   | Description           |
| --------- | ------------------------ | --------- | --------------------- |
| label     | string                   |           | Button label.         |
| variant?  | "primary" \| "secondary" | 'primary' | Visual style.         |
| disabled? | boolean                  | false     | Disables interaction. |

<!-- PROPS-TABLE:END -->

## Development

```bash
bun install
bun run test        # bun test
bun run typecheck
bun run build       # vite → dist/
bun run format      # biome check --write
```

## License

[MIT](./LICENSE) © [jayF0x](https://github.com/jayf0x)
