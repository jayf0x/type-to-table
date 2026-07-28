import { describe, expect, test } from 'bun:test';
import { tttGet } from '../src/tttGet';

const FIXTURE = `${import.meta.dir}/fixtures/Widget.tsx`;
const TYPE_ONLY_FIXTURE = `${import.meta.dir}/fixtures/TypeOnly.tsx`;
const MULTI_FIXTURE = `${import.meta.dir}/fixtures/MultiComponent.tsx`;

describe('tttGet', () => {
  test('builds a markdown table with @default resolved into the Default column', () => {
    const table = tttGet(FIXTURE);
    expect(table).toContain('| Prop | Type | Default | Description |');
    expect(table).toContain('| nrCols? | number | 7 | Number of columns. |');
  });

  test('leaves Default empty when the prop has no @default tag', () => {
    const table = tttGet(FIXTURE);
    expect(table).toContain('| required | string |  | No default given. |');
  });

  test('escapes pipes and collapses newlines in the description so the table stays valid', () => {
    const table = tttGet(FIXTURE);
    const row = table.split('\n').find((line) => line.startsWith('| label?'));
    expect(row).toBe('| label? | string |  | A value with a \\| pipe and<br>a line break in the description. |');
  });

  test('truncates the description when maxDescriptionLength is set', () => {
    const table = tttGet(FIXTURE, { maxDescriptionLength: 10 });
    expect(table).toContain('| nrCols? | number | 7 | Number of … |');
  });

  test('throws with a clear message when the file has no component anchoring the props type', () => {
    expect(() => tttGet(TYPE_ONLY_FIXTURE)).toThrow(/No component found/);
  });

  test('throws asking for componentName when the file exports multiple components', () => {
    expect(() => tttGet(MULTI_FIXTURE)).toThrow(/exports multiple components/);
  });

  test('picks the requested component when componentName disambiguates', () => {
    const table = tttGet(MULTI_FIXTURE, { componentName: 'Button' });
    expect(table).toContain('| label | string |  | Button label. |');
    expect(table).not.toContain('title');
  });

  test('throws when componentName does not match any exported component', () => {
    expect(() => tttGet(MULTI_FIXTURE, { componentName: 'Missing' })).toThrow(/not found/);
  });
});
