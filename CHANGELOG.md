# Changelog

All notable changes to `type-to-table`. Dates are release dates; versions follow
[semver](https://semver.org/).

## 1.0.1 — 2026-07-29

- Internal and tooling changes only.

## 1.0.0 — 2026-07-29

- Initial release: auto-generate React component props tables in README
- Fix @example JSDoc tags leaking into prop descriptions
- Support nested imported types in component fixtures

## 0.0.0 — 2026-07-28

- Initial setup: `tttGet` (parse a `.tsx` component's props via `react-docgen-typescript`,
  build a markdown table) and `tttWrite` (inject that table into a README between
  `taglify` marker comments), plus the `docs:props` CLI script.
