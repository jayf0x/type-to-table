import type { FC } from 'react';

export type ButtonProps = {
  /** Button label. */
  label: string;
  /** Visual style. @default 'primary' */
  variant?: 'primary' | 'secondary';
  /** Disables interaction. @default false */
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({ label }) => label;
