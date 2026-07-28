import { taglWrite } from 'taglify';
import { type TttGetOptions, tttGet } from './tttGet';

/**
 * Builds the props table for `filePath` and writes it into `readmePath`
 * between `<!-- PROPS-TABLE:START -->` / `<!-- PROPS-TABLE:END -->` markers.
 * Returns whether the file changed (see taglify's `taglWrite`).
 */
export const tttWrite = (filePath: string, readmePath: string, options?: TttGetOptions): boolean => {
  const table = tttGet(filePath, options);
  return taglWrite(readmePath, { 'PROPS-TABLE': table }, { throwOnError: true });
};
