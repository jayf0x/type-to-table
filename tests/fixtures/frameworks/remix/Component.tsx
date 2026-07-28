import type { Role, SocialLinks } from './shared';

// A Remix route component. Route modules also export `loader`/`action`, but
// those aren't part of the component's props — only the default export matters here.
export type ProfileProps = {
  /** User display name. */
  name: string;
  /** Social handles, resolved from an imported interface. */
  links: SocialLinks;
  /**
   * Account role.
   * @default 'member'
   * @example
   * <Profile role="admin" />
   */
  role?: Role;
};

export default function Profile({ name }: ProfileProps) {
  return name;
}
