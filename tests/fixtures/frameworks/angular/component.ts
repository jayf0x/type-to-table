// Angular component classes aren't the React FC/class shape react-docgen-typescript
// looks for, and `@angular/core` isn't installed here — either reason is enough
// for parse() to return no docs for this file.
export class FooComponent {
  /** The foo value. @default 'bar' */
  foo = 'bar';
}
