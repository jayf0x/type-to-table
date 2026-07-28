import type { FC } from 'react';
import type { Address, Variant } from './Shared';

export type CardProps = {
  /** Visual style. @default 'primary' */
  variant?: Variant;
  /** Shipping address, resolved from an imported interface. */
  address: Address;
  /**
   * Card title.
   * @default 'Untitled'
   * @example
   * <Card title="Hi" />
   */
  title?: string;
};

export const Card: FC<CardProps> = ({ title }) => title;
