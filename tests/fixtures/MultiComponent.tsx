import type { FC } from 'react';

export type CardProps = {
  /** Card title. @default 'Untitled' */
  title?: string;
};

export type ButtonProps = {
  /** Button label. */
  label: string;
};

export const Card: FC<CardProps> = ({ title }) => title;
export const Button: FC<ButtonProps> = ({ label }) => label;
