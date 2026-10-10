export type QueueStatus = 'live' | 'paused' | 'closed';

export interface QueueRow {
  id: string;
  name: string;
  counter_name: string | null;
  book_id: string;
  paid_days: number;
  test_days: number;
  trial_ends_at: string;
  status: string;
  intake_enabled?: boolean;
  start_number?: number;
  created_at: string;
  sessions: { id: string; started_at: string; ended_at: string | null; current_number: number | null; tokens: { status: string }[] }[];
}

export const queueTitle = (q: { name: string; counter_name: string | null }) =>
  q.counter_name ? `${q.name} · ${q.counter_name}` : q.name;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (iso: string) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };

const RANK: Record<QueueStatus, number> = { live: 0, paused: 1, closed: 2 };
export const asStatus = (s: string): QueueStatus => (s === 'live' || s === 'paused' ? s : 'closed');

export function summarize(q: QueueRow) {
  const last = [...q.sessions].sort((a, b) => b.started_at.localeCompare(a.started_at))[0];
  return {
    status: asStatus(q.status),
    serving: last?.current_number ?? null,
    waiting: last ? last.tokens.filter(x => x.status === 'waiting').length : 0,
    lastUsed: last?.started_at ?? q.created_at,
    lastLine: `Aakhri baar: ${shortDate(last?.started_at ?? q.created_at)} · ${last ? last.tokens.length : 0} token`,
  };
}

export function sortQueues(rows: QueueRow[]) {
  return rows
    .map(q => ({ q, s: summarize(q) }))
    .sort((a, b) => RANK[a.s.status] - RANK[b.s.status] || b.s.lastUsed.localeCompare(a.s.lastUsed));
}

/** Bache hue din = paid + test + trial ke bache din. */
export const balanceDays = (q: { paid_days: number; test_days: number; trial_ends_at: string }, now = Date.now()) =>
  (q.paid_days || 0) + (q.test_days || 0) + Math.max(0, Math.ceil((Date.parse(q.trial_ends_at) - now) / 86400000));
