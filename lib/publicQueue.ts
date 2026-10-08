'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type PublicState = 'live' | 'paused' | 'intake_paused' | 'limit' | 'closed' | 'expired' | 'invalid';
export interface PublicQueue {
  state: PublicState;
  name?: string;
  counter_name?: string | null;
  started_at?: string;
  serving?: number | null;
  next_number?: number;
  waiting?: number;
  avg_time_min?: number | null;
}

export const CODE_RE = /^[A-Za-z0-9_-]{10,64}$/;
const POLL_MS = 5000;

/** IST, 12-hour (9:00 AM). */
export function istTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).replace(/\bam\b/, 'AM').replace(/\bpm\b/, 'PM');
}

export async function fetchPublicQueue(code: string): Promise<PublicQueue> {
  if (!CODE_RE.test(code)) return { state: 'invalid' };
  const { data, error } = await createClient().rpc('queue_public', { p_code: code });
  if (error || !data) throw new Error('fetch');
  return data as PublicQueue;
}

/** Pehle server ka data; phir 5s polling, tab foreground par turant refetch. Fail par purana verified data rahta hai. */
export function usePublicQueue(code: string, initial: PublicQueue | null) {
  const [data, setData] = useState<PublicQueue | null>(initial);
  const [stale, setStale] = useState(false);
  const [lastOk, setLastOk] = useState<number>(Date.now());
  const busy = useRef(false);

  const refetch = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try { setData(await fetchPublicQueue(code)); setStale(false); setLastOk(Date.now()); }
    catch { setStale(true); }
    finally { busy.current = false; }
  }, [code]);

  useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === 'visible') void refetch(); }, POLL_MS);
    const vis = () => { if (document.visibilityState === 'visible') void refetch(); };
    document.addEventListener('visibilitychange', vis);
    if (!initial) void refetch();
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', vis); };
  }, [refetch, initial]);

  return { data, stale, lastOk, refetch };
}
