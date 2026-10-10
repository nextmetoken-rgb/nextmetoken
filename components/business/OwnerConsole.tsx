'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp, ChevronLeft, ChevronRight, CircleHelp, Clock3, Globe, MoreVertical, Moon, Pause, Play, QrCode, Search, Settings, Share2, Trash2, UserPlus, Users, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Banner } from '@/components/Banner';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Card, PersonRow } from '@/components/Cards';
import { Chip } from '@/components/Chip';
import { Dialog } from '@/components/Dialog';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { NumberFlip } from '@/components/NumberFlip';
import { StickyBar } from '@/components/StickyBar';
import { TextField } from '@/components/TextField';
import { ToggleRow } from '@/components/Toggle';
import { createClient } from '@/lib/supabase/client';
import { useOnline } from '@/lib/useOnline';
import { QRCodeSVG } from '@/components/QRCodeSVG';

/* ───────────────────────── Types ───────────────────────── */

export type ConsoleToken = { id: string; number: number; display_name: string; is_walkin: boolean; status: string; hidden_for_owner: boolean; created_at: string; called_at: string | null };
export type ConsoleData = { queue: { id: string; name: string; code: string; book_id: string; status: 'live' | 'paused' | 'closed'; start_number: number; token_limit: number | null; paid_days: number; test_days: number; trial_ends_at: string; intake_enabled: boolean; announcement_enabled: boolean; announcement_repeat_count: number; sound_box_enabled: boolean }; session: { id: string; started_at: string; current_number: number | null; version: number } | null; tokens: ConsoleToken[] };

type RawSession = { id: string; started_at: string; current_number: number | null; version: number; ended_at: string | null; tokens: ConsoleToken[] };
type NumberMove = { from: number | null; to: number; direction: 'ahead' | 'back' };
type Filter = 'all' | 'waiting' | 'done';
type ToastKind = 'info' | 'success' | 'error';
type Toast = { id: number; text: string; kind: ToastKind; undo: boolean };
type VoiceLang = 'en' | 'hi' | 'both';

/* ───────────────────────── Constants / helpers ───────────────────────── */

const MAX_VOICE = 300;          // /sounds/voice/{en,hi}/token.mp3 + 1..300.mp3
const VOICE_RATE = 44100;
const VOICE_LANG_KEY = 'nmt_voice_lang';
const VIRTUAL_AFTER = 60;       // itne rows ke baad list virtualize hogi
const VIRTUAL_WINDOW = 18;
const TOAST_MS = 5000;
const GREY_STATUSES = ['done', 'left', 'expired', 'skipped', 'removed'];

function digitFont(n: number | null) {
  const len = String(n ?? '—').length;
  return len <= 3 ? 'clamp(88px,30vw,120px)' : len === 4 ? 'clamp(64px,22vw,88px)' : 'clamp(48px,16vw,64px)';
}
function fmtTime(v: string) {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date(v));
}
function fmtDate(v: string) {
  return new Date(v).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
}
function makeSilentWavUrl(seconds = 10, rate = 8000) {
  const n = seconds * rate;
  const buf = new ArrayBuffer(44 + n);
  const v = new DataView(buf);
  const w = (o: number, t: string) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  w(36, 'data'); v.setUint32(40, n, true);
  new Uint8Array(buf, 44).fill(128);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}
function statusChip(token: ConsoleToken): string {
  switch (token.status) {
    case 'serving': return 'Ab chal raha';
    case 'waiting': return token.is_walkin ? 'Walk-in' : '';
    case 'done': return 'Poora hua';
    case 'left': return 'Line chhod di';
    case 'expired': return 'Khatam';
    case 'removed': return 'Hata diya';
    case 'skipped': return 'Nikal gaya';
    default: return '';
  }
}
function chipVariantFor(token: ConsoleToken): 'now' | 'left' | 'walkin' | undefined {
  if (token.status === 'serving') return 'now';
  if (GREY_STATUSES.includes(token.status)) return 'left';
  if (token.is_walkin) return 'walkin';
  return undefined;
}

// "Token number" + number ki clip(s) ko ek hi WAV me jodta hai (repeat aur English+Hindi dono ke liye)
function buildVoiceWav(phrases: { token: Float32Array; num: Float32Array }[], times: number) {
  const gapIn = Math.round(VOICE_RATE * 0.12), gapMid = Math.round(VOICE_RATE * 0.4), gapOut = Math.round(VOICE_RATE * 0.45);
  const parts: (Float32Array | number)[] = [];
  for (let t = 0; t < times; t++) {
    phrases.forEach((p, i) => { parts.push(p.token, gapIn, p.num); if (i < phrases.length - 1) parts.push(gapMid); });
    if (t < times - 1) parts.push(gapOut);
  }
  let total = 0;
  for (const x of parts) total += typeof x === 'number' ? x : x.length;
  const pcm = new Int16Array(total);
  let o = 0;
  for (const x of parts) {
    if (typeof x === 'number') { o += x; continue; }
    for (let i = 0; i < x.length; i++) { const v = Math.max(-1, Math.min(1, x[i])); pcm[o++] = v < 0 ? v * 0x8000 : v * 0x7fff; }
  }
  const buf = new ArrayBuffer(44 + pcm.length * 2);
  const v = new DataView(buf);
  const w = (p: number, t: string) => { for (let i = 0; i < t.length; i++) v.setUint8(p + i, t.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + pcm.length * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, VOICE_RATE, true); v.setUint32(28, VOICE_RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, pcm.length * 2, true);
  new Int16Array(buf, 44).set(pcm);
  return new Blob([buf], { type: 'audio/wav' });
}

const hiddenAudio = { position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', left: -100, top: 0 } as const;

/* ───────────────────────── Component ───────────────────────── */

export default function OwnerConsole({ initial }: { initial: ConsoleData }) {
  const router = useRouter();
  const online = useOnline();

  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [sheet, setSheet] = useState<'more' | 'walkin' | 'restart' | 'skip-menu' | null>(null);
  const [dialog, setDialog] = useState<ConsoleToken | null>(null);
  const [skipTarget, setSkipTarget] = useState<ConsoleToken | null>(null);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [lifeDialog, setLifeDialog] = useState<'end' | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lastMove, setLastMove] = useState<NumberMove | null>(null);
  const [walkName, setWalkName] = useState('');
  const [walkBusy, setWalkBusy] = useState(false);
  const [restartNumber, setRestartNumber] = useState('1');
  const [restartError, setRestartError] = useState('');
  const [sound, setSound] = useState(initial.queue.announcement_enabled);
  const [repeatCount, setRepeatCount] = useState(initial.queue.announcement_repeat_count);
  const [soundBox, setSoundBox] = useState(initial.queue.sound_box_enabled);
  const [volumeKeys, setVolumeKeys] = useState(false);
  const [mediaActive, setMediaActive] = useState(false);
  const [mediaStatus, setMediaStatus] = useState('');
  const [menuBusy, setMenuBusy] = useState(false);
  const [origin, setOrigin] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [voiceLang, setVoiceLangState] = useState<VoiceLang>('en');
  const [voiceNote, setVoiceNote] = useState('');

  const listRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const loadingRef = useRef(false);
  const pendingRef = useRef(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const loadTimer = useRef<number | undefined>(undefined);
  const mediaAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const silentUrlRef = useRef('');
  const speechQueueRef = useRef<{ text: string; remaining: number } | null>(null);
  const actionsRef = useRef<{ next: () => void; prev: () => void }>({ next: () => {}, prev: () => {} });
  const blockKeysRef = useRef(false);
  const lastMediaKeyRef = useRef(0);
  const voiceCacheRef = useRef<Map<string, ArrayBuffer>>(new Map());   // key: "en/5", "hi/token"
  const voicePcmRef = useRef<Map<string, Float32Array>>(new Map());    // sirf token clips decode hoke yaad rehti hain
  const voiceInflightRef = useRef<Set<string>>(new Set());
  const voiceSeqRef = useRef(0);
  const rowsRef = useRef<ConsoleToken[]>([]);
  const filterRef = useRef<Filter>('all');

  /* ── one-time setup ── */

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const h = Number.parseFloat(root.getPropertyValue('--owner-row-height')) * Number.parseFloat(root.fontSize);
    setRowHeight(Number.isFinite(h) && h > 0 ? h : 0);
  }, []);
  useEffect(() => {
    const url = makeSilentWavUrl();
    silentUrlRef.current = url;
    if (mediaAudioRef.current) mediaAudioRef.current.src = url;
    return () => { URL.revokeObjectURL(url); silentUrlRef.current = ''; };
  }, []);
  useEffect(() => {
    const cache = voiceCacheRef.current; const pcm = voicePcmRef.current; const audio = voiceAudioRef.current;
    return () => { cache.clear(); pcm.clear(); if (audio?.dataset.url) URL.revokeObjectURL(audio.dataset.url); };
  }, []);
  useEffect(() => {
    try { const v = localStorage.getItem(VOICE_LANG_KEY); if (v === 'en' || v === 'hi' || v === 'both') setVoiceLangState(v); } catch { /* ignore */ }
  }, []);
  // "Upar jayein" button: hero 3 sec tak screen se bahar rahe tabhi
  useEffect(() => {
    const hero = document.querySelector('[data-testid="con.hero"]');
    if (!hero) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(entries => {
      const visible = entries[0]?.isIntersecting ?? true;
      window.clearTimeout(timer);
      if (visible) setShowTop(false);
      else timer = window.setTimeout(() => setShowTop(true), 3000);
    }, { threshold: 0.1 });
    observer.observe(hero);
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, []);
  // Screen sleep na ho jab console khula ho
  useEffect(() => {
    type Lock = { release: () => Promise<void> };
    let lock: Lock | null = null;
    let cancelled = false;
    const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<Lock> } }).wakeLock;
    if (!wl) return;
    const acquire = async () => {
      try { if (document.visibilityState === 'visible' && !lock) { const l = await wl.request('screen'); if (cancelled) void l.release(); else lock = l; } } catch { /* ignore */ }
    };
    const onVis = () => { if (document.visibilityState === 'visible') { lock = null; void acquire(); } };
    void acquire();
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelled = true; document.removeEventListener('visibilitychange', onVis); void lock?.release().catch(() => {}); };
  }, []);

  /* ── toast ── */

  const notify = useCallback((text: string, kind: ToastKind = 'info', undo = false) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text, kind, undo });
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }, []);
  useEffect(() => () => { window.clearTimeout(toastTimer.current); window.clearTimeout(loadTimer.current); }, []);

  /* ── data loading (coalesced, never drops a refresh) ── */

  const fetchOnce = useCallback(async () => {
    const sb = createClient();
    const { data: q, error } = await sb
      .from('queues')
      .select('id,name,code,status,start_number,token_limit,book_id,paid_days,test_days,trial_ends_at,intake_enabled,announcement_enabled,announcement_repeat_count,sound_box_enabled,sessions(id,started_at,current_number,version,ended_at,tokens(id,number,display_name,is_walkin,status,hidden_for_owner,created_at,called_at))')
      .eq('id', initial.queue.id)
      .is('deleted_at', null)
      .order('started_at', { ascending: false, foreignTable: 'sessions' })
      .limit(1, { foreignTable: 'sessions' })
      .maybeSingle();
    if (error || !q) return;
    const { sessions, ...queue } = q as unknown as ConsoleData['queue'] & { sessions?: RawSession[] };
    const session = (sessions || []).find(s => !s.ended_at) || null;
    setData({
      queue: queue as ConsoleData['queue'],
      session: session ? { id: session.id, started_at: session.started_at, current_number: session.current_number, version: session.version } : null,
      tokens: (session?.tokens || []).filter(t => !t.hidden_for_owner),
    });
  }, [initial.queue.id]);

  const load = useCallback(async () => {
    if (document.visibilityState === 'hidden') return;
    if (loadingRef.current) { pendingRef.current = true; return; }
    loadingRef.current = true;
    try {
      do { pendingRef.current = false; await fetchOnce(); } while (pendingRef.current);
    } catch { /* network blip — next poll will retry */ } finally { loadingRef.current = false; }
  }, [fetchOnce]);

  const scheduleLoad = useCallback(() => {
    window.clearTimeout(loadTimer.current);
    loadTimer.current = window.setTimeout(() => void load(), 200);
  }, [load]);

  useEffect(() => { if (!online) return; void load(); const id = window.setInterval(() => void load(), 15000); return () => window.clearInterval(id); }, [online, load]);
  useEffect(() => {
    const sb = createClient();
    const ch = sb.channel(`queue-${data.queue.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tokens', filter: `session_id=eq.${data.session?.id || 'none'}` }, scheduleLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions', filter: `queue_id=eq.${data.queue.id}` }, scheduleLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queues', filter: `id=eq.${data.queue.id}` }, scheduleLoad)
      .subscribe();
    return () => { void sb.removeChannel(ch); };
  }, [data.queue.id, data.session?.id, scheduleLoad]);
  useEffect(() => {
    const fn = () => { if (document.visibilityState === 'visible') void load(); };
    document.addEventListener('visibilitychange', fn);
    return () => document.removeEventListener('visibilitychange', fn);
  }, [load]);

  /* ── derived state ── */

  const isClosed = data.queue.status === 'closed';
  const current = data.tokens.find(t => t.status === 'serving' && (data.session?.current_number == null || t.number === data.session.current_number)) || data.tokens.find(t => t.status === 'serving') || null;
  const visibleNumber = current?.number ?? data.session?.current_number ?? data.queue.start_number;
  const byNumber = (a: ConsoleToken, b: ConsoleToken) => a.number - b.number || a.created_at.localeCompare(b.created_at);

  const waiting = useMemo(() => data.tokens.filter(t => t.status === 'waiting').sort(byNumber), [data.tokens]);
  const finished = useMemo(() => data.tokens.filter(t => t.status !== 'waiting' && t.status !== 'serving').sort(byNumber), [data.tokens]);
  const waitPos = useMemo(() => new Map(waiting.map((t, i) => [t.id, i])), [waiting]);
  const servedCount = useMemo(() => data.tokens.filter(t => t.status === 'done').length, [data.tokens]);

  // Poori history list me rehti hai — "Sab" me number ke order me (ho chuke upar, aane wale neeche)
  const rows = useMemo(() => {
    const base = filter === 'waiting' ? data.tokens.filter(t => t.status === 'waiting' || t.status === 'serving')
      : filter === 'done' ? finished
      : data.tokens;
    const q = query.trim().toLowerCase();
    const filtered = q ? base.filter(t => String(t.number).includes(q.replace('#', '')) || t.display_name.toLowerCase().includes(q)) : base;
    return [...filtered].sort(byNumber);
  }, [data.tokens, finished, filter, query]);
  rowsRef.current = rows;
  filterRef.current = filter;

  // Har token ke beech ka gap = asli "ek token me kitna time". Lambe idle gaps ignore.
  const avgMinutes = useMemo(() => {
    const times = data.tokens.filter(t => t.called_at).map(t => new Date(t.called_at!).getTime()).sort((a, b) => a - b);
    const gaps = times.slice(1).map((t, i) => (t - times[i]) / 60000).filter(g => g >= 0.1 && g <= 30);
    if (gaps.length < 3) return 3;
    const recent = gaps.slice(-10).sort((a, b) => a - b);
    const trimmed = recent.length > 4 ? recent.slice(1, -1) : recent;
    return Math.max(1, Math.round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length));
  }, [data.tokens]);

  const total = data.tokens.length;
  const progress = total ? Math.min(100, Math.round((servedCount / total) * 100)) : 0;
  const limit = data.queue.token_limit;
  const balanceDays = data.queue.paid_days + data.queue.test_days + Math.max(0, Math.ceil((Date.parse(data.queue.trial_ends_at) - now) / 86400000));
  const virtual = rows.length > VIRTUAL_AFTER && rowHeight > 0;
  const virtualStart = virtual ? Math.max(0, Math.min(rows.length - VIRTUAL_WINDOW, Math.floor(scrollTop / rowHeight) - 2)) : 0;
  const visibleRows = virtual ? rows.slice(virtualStart, virtualStart + VIRTUAL_WINDOW) : rows;
  const firstWaitingId = rows.find(t => t.status === 'waiting')?.id;

  /* ── list focus ── */

  const focusCurrent = useCallback((smooth = false) => {
    const box = listRef.current;
    if (!box) return;
    const behavior: ScrollBehavior = smooth ? 'smooth' : 'auto';
    const list = rowsRef.current;
    if (filterRef.current === 'done') { box.scrollTo({ top: box.scrollHeight, behavior }); return; }
    const servingIdx = list.findIndex(t => t.status === 'serving');
    const idx = servingIdx >= 0 ? servingIdx : Math.max(0, list.findIndex(t => t.status === 'waiting'));
    if (list.length > VIRTUAL_AFTER && rowHeight) { box.scrollTo({ top: Math.max(0, idx * rowHeight - rowHeight * 2), behavior }); return; }
    const target = box.querySelector<HTMLElement>('[data-current-row="true"]') || box.querySelector<HTMLElement>('[data-first-waiting="true"]') || box.querySelector<HTMLElement>('[data-first-row="true"]');
    if (target) box.scrollTo({ top: Math.max(0, target.offsetTop - target.offsetHeight * 2), behavior });
  }, [rowHeight]);
  useEffect(() => { const id = window.setTimeout(() => focusCurrent(false), 0); return () => window.clearTimeout(id); }, [data.session?.id, rowHeight, filter, focusCurrent]);

  /* ── server actions ── */

  const act = useCallback(async (fn: string, args: [string, unknown][], opts?: { focus?: boolean }) => {
    if (lockRef.current) return;
    if (!online) { notify('Offline. Dobara connect hone par koshish karein.', 'error'); return; }
    lockRef.current = true; setLoading(true);
    try {
      const { data: r, error } = await createClient().rpc(fn, Object.fromEntries(args));
      if (error || !r) { notify('Number badal nahi paya. Dobara koshish karein.', 'error'); return; }
      if (r.result === 'empty') { notify('Ab line me koi nahi hai.', 'info'); return; }
      if (r.result === 'no_prev') { notify('Pichla number nahi hai.', 'info'); return; }
      if (r.result === 'stale') { notify('Undo ab available nahi hai.', 'info'); return; }
      if (r.result !== 'ok') { notify('Number badal nahi paya. Dobara koshish karein.', 'error'); return; }
      if (opts?.focus) window.setTimeout(() => focusCurrent(true), 60);
      return r;
    } finally { setLoading(false); lockRef.current = false; }
  }, [online, notify, focusCurrent]);

  /* ── voice ── */

  const speakTts = useCallback((text: string, count: number, lang = 'en-IN') => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    speechQueueRef.current = { text, remaining: Math.max(1, Math.min(4, count)) };
    const speakNext = () => {
      const q = speechQueueRef.current;
      if (!q || q.remaining <= 0) { speechQueueRef.current = null; return; }
      const u = new SpeechSynthesisUtterance(q.text);
      u.lang = lang;
      u.onend = () => { if (speechQueueRef.current) { speechQueueRef.current.remaining -= 1; speakNext(); } };
      u.onerror = () => { speechQueueRef.current = null; };
      synth.speak(u);
    };
    speakNext();
  }, []);

  // Clip ko cache se, warna network se laata hai. Token clip decode hoke yaad rakhta hai.
  const loadClip = useCallback(async (key: string): Promise<Float32Array | null> => {
    const isToken = key.endsWith('/token');
    if (isToken) { const hit = voicePcmRef.current.get(key); if (hit) return hit; }
    let buf = voiceCacheRef.current.get(key);
    if (!buf) {
      try { const r = await fetch(`/sounds/voice/${key}.mp3`); if (r.ok) { buf = await r.arrayBuffer(); voiceCacheRef.current.set(key, buf); } } catch { /* offline */ }
    }
    if (!buf) return null;
    const ctx = new OfflineAudioContext(1, 1, VOICE_RATE);
    const pcm = (await ctx.decodeAudioData(buf.slice(0))).getChannelData(0);
    if (isToken) voicePcmRef.current.set(key, pcm);
    return pcm;
  }, []);

  const speakNumber = useCallback(async (num: number, count: number) => {
    const times = Math.max(1, Math.min(4, count));
    const seq = ++voiceSeqRef.current;
    const langs: string[] = voiceLang === 'both' ? ['en', 'hi'] : [voiceLang];
    const note = (r: string) => setVoiceNote(`#${num} · ${document.visibilityState === 'hidden' ? 'screen off' : 'screen on'} · ${r}`);
    const fallback = (why: string) => {
      note(`clip fail (${why}) → TTS`);
      if (voiceLang === 'hi') speakTts(`टोकन नंबर ${num}`, times, 'hi-IN'); else speakTts(`Token number ${num}`, times, 'en-IN');
    };
    const a = voiceAudioRef.current;
    if (!a || !Number.isInteger(num) || num < 1 || num > MAX_VOICE) { fallback('no clip'); return; }
    a.onended = null; a.onerror = null; a.pause();
    window.speechSynthesis?.cancel();
    speechQueueRef.current = null;
    try {
      const phrases: { token: Float32Array; num: Float32Array }[] = [];
      const missing: string[] = [];
      for (const l of langs) {
        const token = await loadClip(`${l}/token`);
        const n = await loadClip(`${l}/${num}`);
        if (token && n) phrases.push({ token, num: n }); else missing.push(!token ? `${l}/token.mp3` : `${l}/${num}.mp3`);
      }
      if (seq !== voiceSeqRef.current) return;
      if (!phrases.length) { fallback(`${missing.join(', ')} nahi mili`); return; }
      const url = URL.createObjectURL(buildVoiceWav(phrases, times));
      const old = a.dataset.url; a.dataset.url = url; a.src = url;
      if (old) URL.revokeObjectURL(old);
      a.currentTime = 0;
      a.onended = () => { a.onended = null; note('poora baja'); };
      a.onerror = () => { a.onended = null; if (seq === voiceSeqRef.current) fallback(`media error ${a.error?.code ?? ''}`); };
      await a.play();
      if (seq === voiceSeqRef.current) note(`play shuru (${langs.join('+')}${missing.length ? ` · missing: ${missing.join(', ')}` : ''})`);
    } catch (e) {
      if (seq === voiceSeqRef.current) fallback((e as Error)?.name || 'error');
    }
  }, [speakTts, loadClip, voiceLang]);

  // Sirf zaroorat ke number (abhi + agle 6 + pichle 2) + token clip preload, sirf chuni hui bhasha ke liye
  useEffect(() => {
    if (!sound) return;
    const cache = voiceCacheRef.current; const inflight = voiceInflightRef.current;
    const langs = voiceLang === 'both' ? ['en', 'hi'] : [voiceLang];
    const before = finished.filter(t => t.number < visibleNumber).slice(-2).map(t => t.number);
    const nums = [visibleNumber, ...waiting.slice(0, 6).map(t => t.number), ...before].filter((n): n is number => typeof n === 'number' && n >= 1 && n <= MAX_VOICE);
    const keys = langs.flatMap(l => ['token', ...nums.map(String)].map(k => `${l}/${k}`));
    keys.forEach(k => {
      if (cache.has(k) || inflight.has(k)) return;
      inflight.add(k);
      fetch(`/sounds/voice/${k}.mp3`).then(r => (r.ok ? r.arrayBuffer() : null)).then(b => { if (b && !cache.has(k)) cache.set(k, b); }).catch(() => {}).finally(() => inflight.delete(k));
    });
  }, [sound, voiceLang, visibleNumber, waiting, finished]);

  const unlockVoice = useCallback(() => {
    const voice = voiceAudioRef.current;
    if (voice && !voice.dataset.unlocked && silentUrlRef.current) {
      voice.dataset.unlocked = '1';
      voice.src = silentUrlRef.current;
      voice.play().then(() => voice.pause()).catch(() => { delete voice.dataset.unlocked; });
    }
  }, []);

  const setVoiceLang = (v: VoiceLang) => {
    setVoiceLangState(v);
    try { localStorage.setItem(VOICE_LANG_KEY, v); } catch { /* ignore */ }
    unlockVoice();
  };

  /* ── token movement ── */

  const next = async () => {
    if (lockRef.current || !online) { if (!online) notify('Offline. Dobara connect hone par koshish karein.', 'error'); return; }
    const before = data; const cur = current; const nxt = waiting[0];
    if (nxt) {
      setData(v => ({
        ...v,
        session: v.session ? { ...v.session, current_number: nxt.number, version: v.session.version + 1 } : null,
        tokens: v.tokens.map(t => (t.id === nxt.id ? { ...t, status: 'serving' } : t.id === cur?.id ? { ...t, status: 'done' } : t)),
      }));
    }
    const r = await act('owner_next', [['p_queue_id', data.queue.id]], { focus: true });
    if (r?.result === 'ok') {
      navigator.vibrate?.(12);
      if (sound) speakNumber(Number(r.number), repeatCount);
      setLastMove({ from: cur?.number ?? null, to: Number(r.number), direction: 'ahead' });
      notify(`Number ${r.number} par gaye`, 'info', true);
      void load();
    } else setData(before);
  };

  const prev = async () => {
    const from = current?.number ?? null;
    const r = await act('owner_prev', [['p_queue_id', data.queue.id]], { focus: true });
    if (r?.result === 'ok') {
      navigator.vibrate?.(12);
      if (sound && r.number != null) speakNumber(Number(r.number), repeatCount);
      setLastMove({ from, to: Number(r.number), direction: 'back' });
      notify(`Number ${r.number} par gaye`, 'info', true);
      void load();
    }
  };

  const skip = async () => {
    if (!skipTarget) return;
    const target = skipTarget; const from = current?.number ?? null;
    setSkipTarget(null); setSkipConfirm(false); setSheet(null);
    const r = await act('owner_skip', [['p_queue_id', data.queue.id], ['p_token_id', target.id]], { focus: true });
    if (r?.result === 'ok') {
      if (sound && r.number != null) speakNumber(Number(r.number), repeatCount);
      setLastMove({ from, to: Number(r.number), direction: 'ahead' });
      notify(`#${target.number} nikal gaya`, 'info', true);
      void load();
    }
  };

  const undo = async () => {
    setToast(null);
    const r = await act('owner_undo', [['p_queue_id', data.queue.id]], { focus: true });
    if (r?.result === 'ok') { setLastMove(null); await load(); notify('Undo ho gaya', 'success'); }
  };

  const callAgain = () => {
    if (!current) return;
    if (!sound) { notify('Awaaz announcement band hai. Neeche se chalu karein.', 'info'); return; }
    unlockVoice();
    speakNumber(current.number, repeatCount);
    navigator.vibrate?.(8);
  };

  /* ── other actions ── */

  const addWalkin = async () => {
    const name = walkName.trim();
    if (!name) { notify('Naam likhein.', 'error'); return; }
    if (walkBusy) return;
    setWalkBusy(true);
    const { data: r, error } = await createClient().rpc('owner_walkin', { p_queue_id: data.queue.id, p_name: name });
    setWalkBusy(false);
    if (error || !r || r.result !== 'ok') { notify(r?.result === 'limit' ? 'Token limit poori ho gayi.' : 'Walk-in nahi jud paya. Dobara koshish karein.', 'error'); return; }
    setSheet(null); setWalkName('');
    await load();
    notify(`${name} ko number ${r.number} mila`, 'success');
  };

  const remove = async () => {
    if (!dialog) return;
    const t = dialog; setDialog(null);
    const { data: r, error } = await createClient().rpc('owner_remove', { p_queue_id: data.queue.id, p_token_id: t.id });
    if (error || !r || r.result !== 'ok') { notify('Hata nahi paye. Dobara koshish karein.', 'error'); return; }
    await load();
    notify(`#${t.number} hata diya`, 'info', true);
  };

  const togglePause = async () => {
    const nextStatus = data.queue.status === 'paused' ? 'live' : 'paused';
    setMenuBusy(true);
    const { data: r, error } = await createClient().rpc('owner_set_status', { p_queue_id: data.queue.id, p_status: nextStatus });
    setMenuBusy(false);
    if (error || r?.result !== 'ok') { notify('Line ka status nahi badal paya.', 'error'); return; }
    setSheet(null); await load();
    notify(nextStatus === 'live' ? 'Line chalu ho gayi.' : 'Line rok di gayi.', 'success');
  };

  const toggleIntake = async () => {
    setMenuBusy(true);
    const enabled = !data.queue.intake_enabled;
    const { data: r, error } = await createClient().rpc('owner_update_intake', { p_queue_id: data.queue.id, p_enabled: enabled });
    setMenuBusy(false);
    if (error || r?.result !== 'ok') { notify('Online token setting save nahi hui.', 'error'); return; }
    await load();
    notify(enabled ? 'Online token chalu.' : 'Online token band; walk-in chalu rahega.', 'success');
  };

  const endDay = async () => {
    setMenuBusy(true);
    const { data: r, error } = await createClient().rpc('owner_end_day', { p_queue_id: data.queue.id });
    setMenuBusy(false); setLifeDialog(null);
    if (error || r?.result !== 'ok') { notify('Din khatam nahi ho paya.', 'error'); return; }
    setSheet(null); await load();
    notify('Din khatam. Dobara shuru karne ke liye "Dobara shuru karein" dabayein.', 'success');
  };

  const restart = async () => {
    const n = Number(restartNumber);
    if (!Number.isInteger(n) || n < 1 || n > 9999) { setRestartError('Number 1 se 9999 ke beech likhein.'); return; }
    setMenuBusy(true);
    const { data: r, error } = await createClient().rpc('owner_restart', { p_queue_id: data.queue.id, p_start_number: n });
    setMenuBusy(false);
    if (error || r?.result !== 'ok') { setRestartError('Line dobara shuru nahi ho payi.'); return; }
    setSheet(null); setRestartError(''); setRestartNumber('1');
    await load();
    notify(`Nayi shuruaat. Number ${n} se chalu.`, 'success');
  };

  const shareLine = async () => {
    const url = `${origin}/q/${data.queue.code}`;
    try {
      if (navigator.share) { await navigator.share({ title: data.queue.name, text: `${data.queue.name} — line me token lene ke liye link kholein`, url }); return; }
      await navigator.clipboard.writeText(url);
      notify('Link copy ho gaya.', 'success');
    } catch { /* user ne share cancel kiya */ }
  };

  /* ── announcements & bluetooth / volume keys ── */

  const activateMediaControls = useCallback(async () => {
    if (!('mediaSession' in navigator)) { setMediaStatus('Is browser me Bluetooth media controls available nahi hain.'); setMediaActive(false); return; }
    const session = navigator.mediaSession;
    const audio = mediaAudioRef.current;
    if (!audio) { setMediaStatus('Media audio tayyar nahi hua.'); return; }
    // Tap ke andar, kisi await se pehle: silent audio start + voice element unlock
    if (!audio.src && silentUrlRef.current) audio.src = silentUrlRef.current;
    audio.loop = true; audio.volume = 1;
    const playPromise = audio.play();
    unlockVoice();
    const set = (a: MediaSessionAction, h: MediaSessionActionHandler | null) => { try { session.setActionHandler(a, h); return true; } catch { return false; } };
    const okNext = set('nexttrack', () => actionsRef.current.next());
    const okPrev = set('previoustrack', () => actionsRef.current.prev());
    // Speaker ka play/pause dabne par silent audio band na ho, warna Next/Previous kaam karna band kar dete hain
    set('play', () => { void mediaAudioRef.current?.play(); });
    set('pause', () => { void mediaAudioRef.current?.play(); });
    if (!okNext || !okPrev) { set('nexttrack', null); set('previoustrack', null); audio.pause(); setMediaStatus('Is browser me dono media buttons available nahi hain.'); setMediaActive(false); return; }
    try {
      session.playbackState = 'playing';
      await playPromise;
      setMediaActive(true);
      setMediaStatus('Media controls active. Ab speaker ka Next/Previous dabakar verify karein.');
    } catch (err) {
      try { session.playbackState = 'none'; } catch { /* ignore */ }
      setMediaActive(false);
      setMediaStatus(`Browser ne background audio start nahi hone diya (${(err as Error)?.name || 'error'}). Dobara isi button ko tap karein.`);
    }
  }, [unlockVoice]);

  const deactivateMediaControls = useCallback(() => {
    mediaAudioRef.current?.pause(); voiceAudioRef.current?.pause();
    setMediaActive(false); setVolumeKeys(false); setMediaStatus('');
    if ('mediaSession' in navigator) {
      try { navigator.mediaSession.setActionHandler('nexttrack', null); navigator.mediaSession.setActionHandler('previoustrack', null); navigator.mediaSession.playbackState = 'none'; } catch { /* ignore */ }
    }
    window.speechSynthesis?.cancel(); speechQueueRef.current = null;
  }, []);

  const saveAnnouncement = async (enabled = sound, repeat = repeatCount, box = soundBox) => {
    const prevState = { sound, repeatCount, soundBox };
    setSound(enabled); setRepeatCount(repeat); setSoundBox(box);
    if (enabled) unlockVoice();
    if (box) void activateMediaControls(); else deactivateMediaControls();
    const { data: r, error } = await createClient().rpc('owner_update_announcements', { p_queue_id: data.queue.id, p_enabled: enabled, p_repeat: repeat, p_sound_box: box });
    if (error || r?.result !== 'ok') {
      setSound(prevState.sound); setRepeatCount(prevState.repeatCount); setSoundBox(prevState.soundBox);
      if (!prevState.soundBox) deactivateMediaControls();
      notify('Announcement setting save nahi hui.', 'error');
    }
  };

  const toggleMediaControls = () => {
    if (soundBox && mediaActive) { void saveAnnouncement(sound, repeatCount, false); return; }
    setVolumeKeys(true);
    if (!soundBox) void saveAnnouncement(sound, repeatCount, true); else void activateMediaControls();
  };

  actionsRef.current = { next, prev };
  blockKeysRef.current = sheet !== null || !!dialog || skipConfirm || lifeDialog !== null || isClosed;

  useEffect(() => { if (!soundBox) deactivateMediaControls(); }, [soundBox, deactivateMediaControls]);
  useEffect(() => {
    if (!soundBox || !('mediaSession' in navigator)) return;
    try {
      if (typeof MediaMetadata !== 'undefined') navigator.mediaSession.metadata = new MediaMetadata({ title: `Token ${visibleNumber} · ${data.queue.name}`, artist: 'Next Me Token', album: 'Queue controls' });
      if (mediaActive) navigator.mediaSession.playbackState = 'playing';
    } catch { /* ignore */ }
  }, [soundBox, mediaActive, data.queue.name, visibleNumber]);
  useEffect(() => {
    if (!soundBox) return;
    const handleVisibility = () => { if (document.visibilityState === 'visible') { if (mediaAudioRef.current?.paused) void activateMediaControls(); else window.speechSynthesis?.resume(); } };
    const handleMediaKey = (event: KeyboardEvent) => {
      if (!volumeKeys) return;
      const { key, code } = event;
      const isNext = key === 'AudioVolumeUp' || key === 'VolumeUp' || code === 'AudioVolumeUp' || event.keyCode === 175;
      const isPrev = key === 'AudioVolumeDown' || key === 'VolumeDown' || code === 'AudioVolumeDown' || event.keyCode === 174;
      if (!isNext && !isPrev) return;
      event.preventDefault();
      if (event.repeat || Date.now() - lastMediaKeyRef.current < 250) return;
      lastMediaKeyRef.current = Date.now();
      (isNext ? actionsRef.current.next : actionsRef.current.prev)();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('keydown', handleMediaKey, true);
    return () => { document.removeEventListener('visibilitychange', handleVisibility); window.removeEventListener('keydown', handleMediaKey, true); };
  }, [soundBox, volumeKeys, activateMediaControls]);

  // Keyboard shortcuts (laptop / tablet): → ya N = Agla, ← ya P = Pichla
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || blockKeysRef.current) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowright' || k === 'n') { e.preventDefault(); actionsRef.current.next(); }
      else if (k === 'arrowleft' || k === 'p') { e.preventDefault(); actionsRef.current.prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ── render helpers ── */

  const heroLabel = current ? 'ABHI CHAL RAHA HAI' : data.session?.current_number == null ? 'SHURUATI TOKEN NUMBER' : 'LAST CALLED NUMBER';
  const heroName = isClosed ? 'Line band hai'
    : current ? <>{current.display_name}{current.is_walkin ? ' (Walk-in)' : ''}</>
    : data.session?.current_number != null ? 'Abhi koi token serve nahi ho raha'
    : waiting.length ? 'Line token ke liye tayyar hai'
    : 'Abhi kisi ko nahi bulaya';
  const heroMove = lastMove
    ? lastMove.from === null ? `Pehla token #${lastMove.to} bulaya`
      : `#${lastMove.from} se #${lastMove.to} · ${Math.abs(lastMove.to - lastMove.from)} number ${lastMove.direction === 'ahead' ? 'aage' : 'peeche'}`
    : current ? `${waiting.length} number abhi intezar me` : `Agla token ${visibleNumber} se shuru hoga`;

  const metaFor = (token: ConsoleToken): string | undefined => {
    if (token.status === 'waiting') {
      const pos = waitPos.get(token.id) ?? 0;
      const waited = Math.max(0, Math.floor((now - new Date(token.created_at).getTime()) / 60000));
      return `${pos === 0 ? 'Agla number' : `${pos} number aage`} · ~${(pos + 1) * avgMinutes} min · ${waited} min se line me`;
    }
    if (token.status === 'serving' && token.called_at) return `Bulaya gaya: ${fmtTime(token.called_at)}`;
    if (token.called_at) return `Bulaya gaya: ${fmtTime(token.called_at)}`;
    return undefined;
  };

  const filterBtn = (key: Filter, label: string, count: number) => (
    <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}
      style={{ flex: 1, minHeight: 40, padding: '8px 10px', borderRadius: 999, border: '1px solid var(--c-border, rgba(0,0,0,.14))', fontWeight: 600, fontSize: 14, cursor: 'pointer',
        background: filter === key ? 'var(--c-accent, #111)' : 'transparent', color: filter === key ? 'var(--c-on-accent, #fff)' : 'inherit' }}>
      {label} ({count})
    </button>
  );

  const emptyFor = query.trim()
    ? <EmptyState icon={<Search />} title="Koi match nahi mila" body="Number ya naam dobara check karein." testId="con.empty" />
    : filter === 'done'
      ? <EmptyState icon={<Clock3 />} title="Abhi koi token poora nahi hua" body="Jaise-jaise number aage badhenge, yahan dikhte rahenge." testId="con.empty" />
      : <EmptyState icon={<Users />} title="Abhi koi intezar me nahi" body="Customer QR scan karke judenge." testId="con.empty" />;

  /* ── render ── */

  return <>
    {!online && <Banner variant="offline" minutesAgo={2} testId="con.offline" />}
    {online && data.queue.status === 'paused' && <Banner variant="paused" testId="con.paused" />}
    <main className="owner-console" data-testid="console">
      <audio ref={mediaAudioRef} loop preload="auto" aria-hidden="true" style={hiddenAudio} />
      <audio ref={voiceAudioRef} preload="auto" aria-hidden="true" style={hiddenAudio} />

      <header className="owner-appbar" data-testid="con.appbar">
        <IconButton icon={<ArrowLeft size={22} />} aria-label="Wapas" onClick={() => router.push('/app/business')} testId="con.back" />
        <h1 className="t-h3 owner-title">{data.queue.name}</h1>
        <div className="owner-actions">
          <Chip variant={data.queue.status === 'live' ? 'live' : data.queue.status === 'paused' ? 'paused' : 'closed'} label={data.queue.status === 'live' ? 'Live' : data.queue.status === 'paused' ? 'Paused' : 'Closed'} />
          <IconButton icon={<MoreVertical size={22} />} aria-label="More" onClick={() => setSheet('more')} testId="con.more" />
        </div>
      </header>

      <div className="owner-grid">
        <section className="owner-main">
          <Card className="owner-ticket" style={{ backgroundColor: 'var(--c-accent)', borderColor: 'transparent', color: 'var(--c-on-accent)' }} testId="con.hero">
            <div className="t-overline owner-ticket-label">{heroLabel}</div>
            <div className={`owner-hero-number ${isClosed ? 'owner-closed' : ''}`}>
              <NumberFlip value={visibleNumber} style={{ fontSize: digitFont(typeof visibleNumber === 'number' ? visibleNumber : null), lineHeight: 1, fontWeight: 800 }} testId="con.hero.number" />
            </div>
            <div className="owner-current-name">{heroName}</div>
            <div className="owner-ticket-move" aria-live="polite">{heroMove}</div>
            {data.session && total > 0 && (
              <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Aaj ki progress" style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,.28)', margin: '10px 0 4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'currentColor', borderRadius: 99, transition: 'width .4s ease' }} />
              </div>
            )}
            <div className="t-caption owner-ticket-caption">{data.session ? `Shuru: ${fmtTime(data.session.started_at)} · ${servedCount}/${total} poore hue` : ' '}</div>
            {current && !isClosed && (
              <div style={{ marginTop: 8 }}>
                <button type="button" onClick={callAgain} aria-label="Number dobara bolein"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 40, padding: '8px 14px', borderRadius: 999, border: '1px solid currentColor', background: 'transparent', color: 'inherit', fontWeight: 600, cursor: 'pointer' }}>
                  <Volume2 size={18} /> Dobara bolein
                </button>
              </div>
            )}
          </Card>

          <div className="owner-quick" role="group" aria-label="Quick options" data-testid="con.quick">
            {!isClosed && <button type="button" className="owner-quick-btn" disabled={menuBusy} onClick={() => void togglePause()} data-testid="con.quick.pause">{data.queue.status === 'paused' ? <Play size={18} /> : <Pause size={18} />}<span>{data.queue.status === 'paused' ? 'Line chalu' : 'Line roko'}</span></button>}
            {!isClosed && <button type="button" className="owner-quick-btn" disabled={menuBusy} aria-pressed={data.queue.intake_enabled} onClick={() => void toggleIntake()} data-testid="con.quick.online"><span className="owner-quick-ico"><Globe size={18} /><i className={`owner-dot ${data.queue.intake_enabled ? 'on' : 'off'}`} /></span><span>{data.queue.intake_enabled ? 'Online band' : 'Online chalu'}</span></button>}
            {!isClosed && <button type="button" className="owner-quick-btn" onClick={() => setLifeDialog('end')} data-testid="con.quick.end"><Moon size={18} /><span>Din khatam</span></button>}
            <button type="button" className="owner-quick-btn" onClick={() => router.push(`/app/business/${data.queue.id}/history`)} data-testid="con.quick.history"><Clock3 size={18} /><span>History</span></button>
            <button type="button" className="owner-quick-btn" onClick={() => router.push(`/app/business/${data.queue.id}/settings`)} data-testid="con.quick.settings"><Settings size={18} /><span>Settings</span></button>
          </div>

          {!isClosed && <Button variant="secondary" fullWidth icon={<UserPlus size={20} />} onClick={() => setSheet('walkin')} testId="con.walkin">Walk-in add karein</Button>}

          <div className="owner-stats t-caption" data-testid="con.stats">
            Aaj: {total}{limit ? `/${limit}` : ''} token · Ausat ~{avgMinutes} min/token{waiting.length ? ` · Line khatam hone me ~${waiting.length * avgMinutes} min` : ''}
          </div>

          <div className="owner-list-head">
            <h2 className="t-h3">Token list</h2>
            <Button variant="tertiary" size="sm" onClick={() => focusCurrent(true)} testId="con.jump">Abhi ke number par</Button>
          </div>

          <div role="group" aria-label="List filter" style={{ display: 'flex', gap: 8, margin: '4px 0 8px' }}>
            {filterBtn('all', 'Sab', total)}
            {filterBtn('waiting', 'Intezar me', waiting.length)}
            {filterBtn('done', 'Ho gaye', finished.length)}
          </div>
          {total > 8 && (
            <div style={{ position: 'relative', margin: '0 0 8px' }}>
              <Search size={18} aria-hidden="true" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.55, pointerEvents: 'none' }} />
              <input type="search" inputMode="search" value={query} onChange={e => { setQuery(e.target.value.slice(0, 40)); setScrollTop(0); }} placeholder="Number ya naam khojein" aria-label="Token khojein"
                style={{ width: '100%', minHeight: 44, padding: '10px 12px 10px 38px', borderRadius: 12, border: '1px solid var(--c-border, rgba(0,0,0,.14))', background: 'transparent', color: 'inherit', fontSize: 16 }} />
            </div>
          )}

          <div className="owner-list-box" ref={listRef} onScroll={e => { if (virtual) setScrollTop(e.currentTarget.scrollTop); }} data-testid="con.list">
            {rows.length === 0 ? emptyFor : <>
              {virtual && <div aria-hidden="true" style={{ height: `${virtualStart * rowHeight}px` }} />}
              {visibleRows.map((token, visibleIndex) => {
                const i = virtualStart + visibleIndex;
                const active = token.status === 'serving';
                const grey = GREY_STATUSES.includes(token.status);
                return (
                  <div key={token.id} data-current-row={active ? 'true' : undefined} data-first-waiting={token.id === firstWaitingId ? 'true' : undefined} data-first-row={i === 0 ? 'true' : undefined} className={`owner-person-row ${grey ? 'is-grey' : ''}`}>
                    <PersonRow number={token.number} name={`${token.display_name} #${token.number}`} metaText={metaFor(token)} isNow={active} chipVariant={chipVariantFor(token)} chipLabel={statusChip(token)} testId={`con.row.${token.number}`} />
                    {active && <IconButton icon={<MoreVertical size={18} />} aria-label={`Number ${token.number} options`} onClick={() => { setSkipTarget(token); setSheet('skip-menu'); }} testId={`con.row.${token.number}.menu`} />}
                    {(token.status === 'waiting' || token.status === 'left') && <IconButton icon={<Trash2 size={18} />} aria-label={`Number ${token.number} hatao`} onClick={() => setDialog(token)} testId={`con.row.${token.number}.remove`} />}
                  </div>
                );
              })}
              {virtual && <div aria-hidden="true" style={{ height: `${Math.max(0, rows.length - virtualStart - visibleRows.length) * rowHeight}px` }} />}
            </>}
          </div>

          <Card testId="con.qr">
            <p className="t-overline c2">SCAN KARKE TOKEN LEIN</p>
            <div className="console-qr-code">{origin && <QRCodeSVG value={`${origin}/q/${data.queue.code}`} size="100%" label={`Queue QR: ${data.queue.name}`} />}</div>
            <p className="t-label" style={{ textAlign: 'center' }}>{data.queue.name}</p>
            <p className="t-body-sm" style={{ textAlign: 'center' }}>Book ID: <strong>{data.queue.book_id}</strong></p>
            <p className="t-caption" style={{ textAlign: 'center' }}>Balance: {balanceDays} din</p>
            <Button variant="secondary" fullWidth icon={<Share2 size={18} />} onClick={() => void shareLine()}>Link share karein</Button>
            <Button variant="tertiary" fullWidth href={`/app/business/${data.queue.id}/qr`}>QR dikhao / print</Button>
            <Button variant="tertiary" fullWidth href="/app/business/funds">Days add karein</Button>
          </Card>

          <Card testId="con.sound">
            <ToggleRow icon={<Volume2 size={24} />} label="Awaaz announcement" helperText="Customer ka number bolkar batayein." checked={sound} onChange={v => void saveAnnouncement(v)} />
            <div className="owner-announcement-repeat" style={{ flexWrap: 'wrap' }}>
              <span className="t-body-sm">Bhasha</span>
              {([['en', 'English'], ['hi', 'हिंदी'], ['both', 'Dono']] as [VoiceLang, string][]).map(([k, label]) => <button key={k} type="button" aria-pressed={voiceLang === k} onClick={() => setVoiceLang(k)}>{label}</button>)}
              <span className="t-body-sm" style={{ marginLeft: 12 }}>Repeat</span>
              {[1, 2, 3, 4].map(n => <button key={n} type="button" aria-pressed={repeatCount === n} onClick={() => void saveAnnouncement(sound, n)}>{n}×</button>)}
            </div>
            <p className="t-body-sm c2">Bluetooth ke Next/Previous aur supported phone volume keys se token control karein. Laptop par → / ← keys bhi chalti hain.</p>
            <Button fullWidth variant={mediaActive ? 'tertiary' : 'secondary'} onClick={toggleMediaControls} disabled={!online}>
              {mediaActive ? 'Bluetooth controls band karein' : soundBox ? 'Bluetooth controls test / start karein' : 'Bluetooth / volume controls enable karein'}
            </Button>
            {mediaStatus && <p role="status" className="t-caption" aria-live="polite">{mediaStatus}</p>}
            {voiceNote && <p className="t-caption">Awaaz: {voiceNote}</p>}
          </Card>
        </section>
      </div>
    </main>

    {toast && (
      <div className="owner-toast-wrap" key={toast.id}>
        <div role="status" aria-live="polite" className={`owner-toast is-${toast.kind}`}>
          <span className="owner-toast-text">{toast.text}</span>
          {toast.undo && <button type="button" className="owner-toast-undo" onClick={() => void undo()}>Undo</button>}
        </div>
      </div>
    )}

    {!isClosed && (
      <StickyBar testId="con.bar">
        <div className="console-bar">
          <Button variant="secondary" size="md" onClick={prev} disabled={loading || !online || !data.session} icon={<ChevronLeft size={20} />} testId="con.prev">Pichla</Button>
          <Button size="md" fullWidth onClick={next} disabled={loading || !online || !data.session} testId="con.next"><span className="console-next-label">Agla <ChevronRight size={20} /></span></Button>
        </div>
      </StickyBar>
    )}
    {isClosed && <div className="owner-closed-bar"><Button fullWidth onClick={() => { setRestartNumber('1'); setRestartError(''); setSheet('restart'); }} testId="con.restart">Dobara shuru karein</Button></div>}

    <BottomSheet isOpen={sheet === 'walkin'} onClose={() => setSheet(null)} title="Walk-in add karein" subtitle="Jinke paas phone nahi hai unka naam likhein."
      primaryAction={<Button fullWidth loading={walkBusy} onClick={addWalkin} testId="walkin.cta">Number dein</Button>}
      secondaryAction={<Button fullWidth variant="tertiary" onClick={() => setSheet(null)}>Wapas</Button>} testId="walkin.sheet">
      <form onSubmit={e => { e.preventDefault(); void addWalkin(); }}>
        <TextField label="Naam" value={walkName} onChange={e => setWalkName(e.target.value.slice(0, 40))} autoFocus autoCapitalize="words" maxLength={40} enterKeyHint="done" testId="walkin.name" />
      </form>
    </BottomSheet>

    <BottomSheet isOpen={sheet === 'restart'} onClose={() => setSheet(null)} title="Dobara shuru karein" subtitle="Token kis number se shuru ho? Jaise 1, 10 ya 145."
      primaryAction={<Button fullWidth loading={menuBusy} onClick={restart} testId="restart.cta">Shuru karein</Button>}
      secondaryAction={<Button fullWidth variant="tertiary" onClick={() => setSheet(null)}>Wapas</Button>} testId="restart.sheet">
      <TextField label="Shuruaati number" type="number" inputMode="numeric" min={1} max={9999} value={restartNumber} onChange={e => setRestartNumber(e.target.value)}
        helperText={`Pichhli baar: ${data.queue.start_number} se shuru hua tha. Purani history safe rehti hai.`} error={restartError || undefined} testId="restart.number" />
    </BottomSheet>

    <BottomSheet isOpen={sheet === 'more'} onClose={() => setSheet(null)} title="Queue options" testId="con.more.sheet">
      <div className="console-menu">
        <button type="button" onClick={() => router.push(`/app/business/${data.queue.id}/qr`)}><QrCode size={20} />QR dikhao / print</button>
        <button type="button" onClick={() => { setSheet(null); void shareLine(); }}><Share2 size={20} />Link share karein</button>
        {!isClosed && <button type="button" disabled={menuBusy} onClick={() => void togglePause()}>{data.queue.status === 'paused' ? <Play size={20} /> : <Pause size={20} />} {data.queue.status === 'paused' ? 'Line chalu karein' : 'Line rok dein'}</button>}
        {!isClosed && <button type="button" disabled={menuBusy} onClick={() => void toggleIntake()}>{data.queue.intake_enabled ? 'Online token band karein' : 'Online token chalu karein'} · walk-in chalu</button>}
        {!isClosed && <button type="button" onClick={() => setLifeDialog('end')}><Moon size={20} />Din khatam (End day)</button>}
        <button type="button" onClick={() => router.push(`/app/business/${data.queue.id}/history`)}><Clock3 size={20} />History</button>
        <button type="button" onClick={() => router.push(`/app/business/${data.queue.id}/settings`)}><Settings size={20} />Settings</button>
        <button type="button" onClick={() => router.push('/app/guide')}><CircleHelp size={20} />Guide (Madad)</button>
      </div>
    </BottomSheet>

    <BottomSheet isOpen={sheet === 'skip-menu'} onClose={() => setSheet(null)} title={`Number ${skipTarget?.number ?? ''}`} testId="con.skip.menu">
      <div className="console-menu"><button type="button" onClick={() => { setSheet(null); setSkipConfirm(true); }}>Number nikal gaya (Skip)</button></div>
      <Button fullWidth variant="secondary" onClick={() => { setSkipTarget(null); setSheet(null); }}>Wapas</Button>
    </BottomSheet>

    <Dialog isOpen={lifeDialog === 'end'} title="Aaj ka kaam khatam karein?" body="Bache hue token khatam ho jayenge. Customer scan karenge toh 'Ye line band hai' dikhega." primaryLabel={menuBusy ? 'Rukiye…' : 'Din khatam karein'} onPrimary={endDay} onCancel={() => setLifeDialog(null)} testId="con.endday.confirm" />
    <Dialog isOpen={!!dialog} title="Pakka list se hatana hai?"
      body={dialog?.status === 'left' ? `#${dialog.number} ${dialog.display_name} ka naam list se hat jayega. 5 second me Undo kar sakte hain.` : `#${dialog?.number} ${dialog?.display_name} ko line se hata diya jayega aur unhe "Owner ne aapko line se hata diya" dikhega. 5 second me Undo kar sakte hain.`}
      primaryLabel="Haan, hatao" primaryVariant="danger-filled" onPrimary={remove} onCancel={() => setDialog(null)} testId="con.remove.confirm" />
    <Dialog isOpen={skipConfirm} title="Number nikal gaya?" body={`Number ${skipTarget?.number ?? ''} ko skip karke agle waiting number ko bulaya jayega.`} primaryLabel="Haan, skip karein" primaryVariant="danger-filled" onPrimary={skip} onCancel={() => { setSkipConfirm(false); setSkipTarget(null); }} testId="con.skip.confirm" />

    {showTop && <button className="owner-back-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Upar jayein"><ArrowUp size={18} /></button>}
  </>;
}
