const isDev = import.meta.env.DEV;

export const logger = {
  log:   (...args) => isDev && console.log('[Crickbait]', ...args),
  warn:  (...args) => isDev && console.warn('[Crickbait]', ...args),
  error: (...args) => console.error('[Crickbait]', ...args), // always log errors
  info:  (...args) => isDev && console.info('[Crickbait]', ...args),
};
