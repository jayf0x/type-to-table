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
/**
 * The supported (React-family) fixtures each import a nested prop type from a
 * sibling `shared.ts` and carry an `@example` tag alongside `@default`, so this
 * suite also proves imported-type resolution and JSDoc-tag stripping survive
 * end to end through tttWrite, not just in tttGet's own unit tests.
 */
const cases: { name: string; component: string; supported: boolean; nestedTypeName?: string }[] = [
  { name: 'react', component: 'Component.tsx', supported: true, nestedTypeName: 'Address' },
  { name: 'nextjs', component: 'Component.tsx', supported: true, nestedTypeName: 'Author' },
  { name: 'remix', component: 'Component.tsx', supported: true, nestedTypeName: 'SocialLinks' },
  { name: 'vue', component: 'Component.vue', supported: false },
  { name: 'angular', component: 'component.ts', supported: false },
  { name: 'svelte', component: 'Component.svelte', supported: false },
  { name: 'astro', component: 'Component.astro', supported: false },
];

describe('framework fixtures', () => {
  for (const { name, component, supported, nestedTypeName } of cases) {
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
          expect(table).toContain(`| ${nestedTypeName} |`);
          expect(table).not.toContain('@example');
          expect(table).not.toContain('```');
        } else {
          expect(() => tttWrite(componentPath, readmePath)).toThrow(/No component found/);
        }
      } finally {
        taglWrite(readmePath, { 'PROPS-TABLE': '' });
      }
    });
  }
});
