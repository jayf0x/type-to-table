import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, '../src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    target: 'es2020',
    minify: 'oxc',
    sourcemap: false,
    rollupOptions: {
      // Node-only tool — ship as thin wrappers, don't bundle the TS compiler in transitively via
      // react-docgen-typescript.
      external: ['react-docgen-typescript', 'taglify', /^node:/],
      output: { exports: 'named' },
    },
  },
});
