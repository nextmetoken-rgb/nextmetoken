export const QUEUE_LIMITS = { nameMin: 2, nameMax: 40, counterMax: 40, tokenMax: 9999, minutesMax: 120 } as const;

export type AvgMode = 'auto' | 'manual';

export interface QueueInput {
  name: string;
  counter: string;
  noLimit: boolean;
  limit: string;
  avgMode: AvgMode;
  minutes: string;
  start: string;
}

export type QueueErrors = Partial<Record<'name' | 'limit' | 'minutes' | 'start', true>>;

export const EMPTY_QUEUE_INPUT: QueueInput = {
  name: '', counter: '', noLimit: true, limit: '', avgMode: 'auto', minutes: '', start: '1',
};

export const toInt = (s: string): number | null => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : null);
const inRange = (s: string, max: number) => { const n = toInt(s); return n !== null && n >= 1 && n <= max; };

export const nameOk = (name: string) => name.trim().length >= QUEUE_LIMITS.nameMin && name.trim().length <= QUEUE_LIMITS.nameMax;

export function validateStep(step: 1 | 2 | 3, v: QueueInput): QueueErrors {
  const e: QueueErrors = {};
  if (step === 1 && !nameOk(v.name)) e.name = true;
  if (step === 2 && !v.noLimit && !inRange(v.limit, QUEUE_LIMITS.tokenMax)) e.limit = true;
  if (step === 3) {
    if (v.avgMode === 'manual' && !inRange(v.minutes, QUEUE_LIMITS.minutesMax)) e.minutes = true;
    if (!inRange(v.start, QUEUE_LIMITS.tokenMax)) e.start = true;
  }
  return e;
}

export function validateAll(v: QueueInput): QueueErrors {
  return { ...validateStep(1, v), ...validateStep(2, v), ...validateStep(3, v) };
}
