import { type ComponentDoc, type ParserOptions, parse } from 'react-docgen-typescript';

/** Escapes `|` and newlines so a value can't break a markdown table row. */
const escapeCell = (value: string): string => value.replace(/\|/g, '\\|').replace(/\r\n|\r|\n/g, '<br>');

const truncate = (value: string, maxLength?: number): string =>
  maxLength && value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;

export interface TttGetOptions {
  /** Which component to document when the file exports more than one. Required in that case. */
  componentName?: string;
  /** Truncates each prop's description to this many characters (with an ellipsis). Off by default. */
  maxDescriptionLength?: number;
  /** Passed through to react-docgen-typescript's `parse()` — e.g. `componentNameResolver`, `customComponentTypes`. */
  parserOptions?: ParserOptions;
}

const pickComponent = (docs: ComponentDoc[], filePath: string, componentName?: string): ComponentDoc => {
  if (docs.length === 0) {
    throw new Error(
      `No component found in ${filePath}. react-docgen-typescript needs an exported component ` +
        `using the props type — a type with no component referencing it returns nothing.`,
    );
  }

  if (componentName) {
    const match = docs.find((doc) => doc.displayName === componentName);
    if (!match) {
      throw new Error(
        `Component "${componentName}" not found in ${filePath}. Found: ${docs.map((doc) => doc.displayName).join(', ')}`,
      );
    }
    return match;
  }

  if (docs.length > 1) {
    throw new Error(
      `${filePath} exports multiple components (${docs.map((doc) => doc.displayName).join(', ')}) — ` +
        `pass componentName to pick one.`,
    );
  }

  return docs[0];
};

/**
 * Parses a .tsx component file and returns its props as a markdown table
 * (`Prop | Type | Default | Description`).
 *
 * Requires an exported component using the props type — a type with no
 * component referencing it has nothing for react-docgen-typescript to
 * anchor resolving on, and parse() returns no docs for the file.
 */
export const tttGet = (filePath: string, options: TttGetOptions = {}): string => {
  const docs = parse(filePath, options.parserOptions);
  const doc = pickComponent(docs, filePath, options.componentName);

  const rows = Object.values(doc.props).map((prop) => {
    const name = prop.required ? prop.name : `${prop.name}?`;
    const type = escapeCell(prop.type.name);
    const defaultValue = prop.defaultValue?.value ?? '';
    const description = escapeCell(truncate(prop.description, options.maxDescriptionLength));
    return `| ${name} | ${type} | ${defaultValue} | ${description} |`;
  });

  return ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...rows].join('\n');
};
