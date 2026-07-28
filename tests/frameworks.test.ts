import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { taglRead, taglWrite } from 'taglify';
import { tttWrite } from '../src/tttWrite';

/**
 * One fixture folder per stack under fixtures/frameworks/<name>/ — a component
 * file plus a README.md carrying the same PROPS-TABLE markers a real consumer
 * would use. `supported` reflects react-docgen-typescript's real boundary: it
 * only recognizes React FC/class components, so non-React formats (Vue SFC,
 * Angular class, Svelte, Astro) parse to zero docs — documented, not fought.
 */
const cases: { name: string; component: string; supported: boolean }[] = [
  { name: 'react', component: 'Component.tsx', supported: true },
  { name: 'nextjs', component: 'Component.tsx', supported: true },
  { name: 'remix', component: 'Component.tsx', supported: true },
  { name: 'vue', component: 'Component.vue', supported: false },
  { name: 'angular', component: 'component.ts', supported: false },
  { name: 'svelte', component: 'Component.svelte', supported: false },
  { name: 'astro', component: 'Component.astro', supported: false },
];

describe('framework fixtures', () => {
  for (const { name, component, supported } of cases) {
    test(`${name}: ${supported ? 'writes a props table' : 'is documented as unsupported'}`, () => {
      const dir = `${import.meta.dir}/fixtures/frameworks/${name}`;
      const readmePath = `${dir}/README.md`;
      const componentPath = `${dir}/${component}`;

      try {
        expect(taglRead(readFileSync(readmePath, 'utf8'), 'PROPS-TABLE')).toBe('');

        if (supported) {
          const changed = tttWrite(componentPath, readmePath);
          expect(changed).toBe(true);
          const table = taglRead(readFileSync(readmePath, 'utf8'), 'PROPS-TABLE');
          expect(table).toContain('| Prop | Type | Default | Description |');
        } else {
          expect(() => tttWrite(componentPath, readmePath)).toThrow(/No component found/);
        }
      } finally {
        taglWrite(readmePath, { 'PROPS-TABLE': '' });
      }
    });
  }
});
