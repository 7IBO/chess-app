/**
 * Conditional logger - only displays logs in development
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Errors are always displayed
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
};
