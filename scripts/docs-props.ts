import { tttWrite } from '../src/index';

const [filePath, componentName] = process.argv.slice(2);
if (!filePath) {
  console.error('Usage: docs:props -- path/to/Component.tsx [componentName]');
  process.exit(1);
}

const changed = tttWrite(filePath, 'README.md', componentName ? { componentName } : undefined);
console.log(changed ? 'README.md updated.' : 'README.md already up to date.');
