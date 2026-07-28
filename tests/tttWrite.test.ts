import { describe, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { taglRead } from 'taglify';
import { tttWrite } from '../src/tttWrite';

const FIXTURE = `${import.meta.dir}/fixtures/Widget.tsx`;

const tempReadme = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'type-to-table-'));
  const readmePath = join(dir, 'README.md');
  writeFileSync(readmePath, '# Demo\n\n<!-- PROPS-TABLE:START -->\n<!-- PROPS-TABLE:END -->\n');
  return readmePath;
};

describe('tttWrite', () => {
  test('writes the props table between the README markers', () => {
    const readmePath = tempReadme();

    const changed = tttWrite(FIXTURE, readmePath);

    expect(changed).toBe(true);
    const table = taglRead(readFileSync(readmePath, 'utf8'), 'PROPS-TABLE');
    expect(table).toContain('| nrCols? | number | 7 | Number of columns. |');
  });

  test('is idempotent — re-running with unchanged props reports no change', () => {
    const readmePath = tempReadme();

    tttWrite(FIXTURE, readmePath);
    const changedAgain = tttWrite(FIXTURE, readmePath);

    expect(changedAgain).toBe(false);
  });
});
