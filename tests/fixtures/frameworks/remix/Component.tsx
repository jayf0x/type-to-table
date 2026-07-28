// A Remix route component. Route modules also export `loader`/`action`, but
// those aren't part of the component's props — only the default export matters here.
export type ProfileProps = {
  /** User display name. */
  name: string;
};

export default function Profile({ name }: ProfileProps) {
  return name;
}
