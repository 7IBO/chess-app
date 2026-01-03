/**
 * Logger conditionnel - n'affiche les logs qu'en développement
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
    // Les erreurs sont toujours affichées
    console.error(...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
};
