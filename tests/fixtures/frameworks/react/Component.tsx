import type { FC } from 'react';
import type { Address, Variant } from './shared';

export type BadgeProps = {
  /** Visual style. @default 'primary' */
  variant?: Variant;
  /** Where to ship the badge. */
  address: Address;
  /**
   * Badge text.
   * @default 'New'
   * @example
   * <Badge label="Sale" />
   */
  label?: string;
};

export const Badge: FC<BadgeProps> = ({ label }) => label;
