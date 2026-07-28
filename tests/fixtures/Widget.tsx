import type { FC, PropsWithChildren } from 'react';

export type WidgetProps = PropsWithChildren<{
  /** Number of columns. @default 7 */
  nrCols?: number;
  /** A value with a | pipe and
   * a line break in the description. */
  label?: string;
  /** No default given. */
  required: string;
}>;

export const Widget: FC<WidgetProps> = ({ children }) => children;
