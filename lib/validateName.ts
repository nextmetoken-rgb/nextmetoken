export const NAME_MIN = 2;
export const NAME_MAX = 40;
/** true = theek hai */
export function isValidName(raw: string): boolean {
  const n = raw.trim();
  return n.length >= NAME_MIN && n.length <= NAME_MAX && !/^\d+$/.test(n);
}
