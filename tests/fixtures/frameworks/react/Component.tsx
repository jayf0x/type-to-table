import type { FC } from 'react';

export type BadgeProps = {
  /** Badge text. @default 'New' */
  label?: string;
};

export const Badge: FC<BadgeProps> = ({ label }) => label;
