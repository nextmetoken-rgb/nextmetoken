export const DEFAULT_HOME = '/app/scan';
/** Sirf app ke andar ka path; open-redirect band. */
export function safeNext(next?: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return DEFAULT_HOME;
  return next;
}
