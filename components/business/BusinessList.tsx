'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomSheet } from '@/components/BottomSheet';
import { AlertTriangle, Clock3, Globe, Moon, Pause, Play, Plus, Settings, Store } from 'lucide-react';
import { Banner } from '@/components/Banner';
import { Button } from '@/components/Button';
import { QueueCard } from '@/components/Cards';
import { DaysCoin } from '@/components/DaysCoin';
import { Dialog } from '@/components/Dialog';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { balanceDays, queueTitle, sortQueues, type QueueRow } from '@/lib/queueView';
import { t } from '@/lib/i18n';
import { useOnline } from '@/lib/useOnline';

type Load = { kind: 'loading' } | { kind: 'error'; issue:'connection'|'migration' } | { kind: 'ok'; rows: QueueRow[]; at: number };
type Toast = { id: number; text: string; kind: 'info' | 'success' | 'error' };

export default function BusinessList() {
  const router = useRouter();
  const online = useOnline();
  const [state, setState] = useState<Load>({ kind: 'loading' });
  const [selected, setSelected] = useState<QueueRow | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [endTarget, setEndTarget] = useState<QueueRow | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = useCallback((text: string, kind: Toast['kind'] = 'info') => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text, kind });
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const load = useCallback(async () => {
    const { data, error } = await createClient()
      .from('queues')
      .select('id,name,counter_name,book_id,paid_days,test_days,trial_ends_at,status,intake_enabled,start_number,created_at,sessions(id,started_at,ended_at,current_number,tokens(status))').order('started_at',{ascending:false,foreignTable:'sessions'}).limit(1,{foreignTable:'sessions'})
      .is('deleted_at', null);
    const migrationIssue=Boolean(error&&(/column .* does not exist|schema cache|book_id|paid_days|test_days|trial_ends_at/i.test(error.message)||error.code==='42703'||error.code==='PGRST204'));
    setState(prev => (error || !data ? (prev.kind === 'ok' ? prev : { kind: 'error',issue:migrationIssue?'migration':'connection' }) : { kind: 'ok', rows: data as unknown as QueueRow[], at: Date.now() }));
  }, []);

  useEffect(() => { if (online) void load(); }, [online, load]);
  useEffect(()=>{const refresh=()=>void load();window.addEventListener('queues-changed',refresh);return()=>window.removeEventListener('queues-changed',refresh)},[load]);

  const banner = !online ? <Banner variant="offline" minutesAgo={state.kind === 'ok' ? Math.floor((Date.now() - state.at) / 60000) : 0} testId="biz.offline" /> : null;

  const closedAction = async (rpc: 'owner_resume_queue' | 'owner_restart') => {
    if (!selected || actionBusy) return;
    setActionBusy(true);
    const args = rpc === 'owner_restart' ? { p_queue_id: selected.id } : { p_queue_id: selected.id };
    const { data, error } = await createClient().rpc(rpc, args);
    setActionBusy(false);
    if (error || data?.result !== 'ok') return;
    const id = selected.id;
    setSelected(null);
    await load();
    router.push(`/app/business/${id}`);
  };

  /* ── chhote buttons ── */
  const quick = async (q: QueueRow, fn: 'pause' | 'intake' | 'end') => {
    if (busyId) return;
    if (!online) { notify('Offline. Dobara connect hone par koshish karein.', 'error'); return; }
    setBusyId(q.id);
    const db = createClient();
    try {
      if (fn === 'pause') {
        const next = q.status === 'paused' ? 'live' : 'paused';
        const { data, error } = await db.rpc('owner_set_status', { p_queue_id: q.id, p_status: next });
        if (error || data?.result !== 'ok') { notify('Line ka status nahi badal paya.', 'error'); return; }
        notify(next === 'live' ? 'Line chalu ho gayi.' : 'Line rok di gayi.', 'success');
      } else if (fn === 'intake') {
        const enabled = !(q.intake_enabled ?? true);
        const { data, error } = await db.rpc('owner_update_intake', { p_queue_id: q.id, p_enabled: enabled });
        if (error || data?.result !== 'ok') { notify('Online token setting save nahi hui.', 'error'); return; }
        notify(enabled ? 'Online token chalu.' : 'Online token band; walk-in chalu rahega.', 'success');
      } else {
        const { data, error } = await db.rpc('owner_end_day', { p_queue_id: q.id });
        if (error || data?.result !== 'ok') { notify('Din khatam nahi ho paya.', 'error'); return; }
        notify('Din khatam ho gaya.', 'success');
      }
      await load();
    } finally { setBusyId(null); setEndTarget(null); }
  };

  const renderQuick = (q: QueueRow) => {
    const paused = q.status === 'paused';
    const intake = q.intake_enabled ?? true;
    const off = busyId === q.id;
    return (
      <div className="owner-quick biz-quick" role="group" aria-label={`${queueTitle(q)} quick options`}>
        <button type="button" className="owner-quick-btn" disabled={off} onClick={() => void quick(q, 'pause')}>{paused ? <Play size={18} /> : <Pause size={18} />}<span>{paused ? 'Line chalu' : 'Line roko'}</span></button>
        <button type="button" className="owner-quick-btn" disabled={off} aria-pressed={intake} onClick={() => void quick(q, 'intake')}><span className="owner-quick-ico"><Globe size={18} /><i className={`owner-dot ${intake ? 'on' : 'off'}`} /></span><span>{intake ? 'Online band' : 'Online chalu'}</span></button>
        <button type="button" className="owner-quick-btn" disabled={off} onClick={() => setEndTarget(q)}><Moon size={18} /><span>Din khatam</span></button>
        <button type="button" className="owner-quick-btn" onClick={() => router.push(`/app/business/${q.id}/history`)}><Clock3 size={18} /><span>History</span></button>
        <button type="button" className="owner-quick-btn" onClick={() => router.push(`/app/business/${q.id}/settings`)}><Settings size={18} /><span>Settings</span></button>
      </div>
    );
  };

  if (state.kind === 'loading' && online) {
    return <main className="container page tight" data-testid="biz.loading"><div className="biz-list">{[0, 1, 2].map(i => <Skeleton key={i} variant="card" height={88} />)}</div></main>;
  }
  if (state.kind !== 'ok') {
    return (
      <>{banner}
        <main className="container page tight">
          <EmptyState icon={<AlertTriangle />} title={t('biz.error.title')} body={state.kind==='error'&&state.issue==='migration'?'Supabase database update poora nahi hua. SQL Editor me corrected migration 009 poori run karein, phir page refresh karein.':t('biz.error.body')} actionLabel={t('biz.error.cta')} onAction={() => { setState({ kind: 'loading' }); void load(); }} testId="biz.error" />
        </main>
      </>
    );
  }

  const items = sortQueues(state.rows);
  const active = items.filter(i => i.s.status !== 'closed');
  const old = items.filter(i => i.s.status === 'closed');

  if (items.length === 0) {
    return (
      <>{banner}
        <main className="container page tight">
          <EmptyState icon={<Store />} title={t('biz.empty.title')} body={t('biz.empty.body')} actionLabel={t('biz.empty.cta')} onAction={() => router.push('/app/business/new')} testId="biz.empty" />
        </main>
      </>
    );
  }

  const days = balanceDays(items[0].q);

  return (
    <>{banner}
    {toast && (
      <div className="owner-toast-wrap" key={toast.id}>
        <div role="status" aria-live="polite" className={`owner-toast is-${toast.kind}`}><span className="owner-toast-text">{toast.text}</span></div>
      </div>
    )}
    <main className="container page tight" data-testid="business">
      <button type="button" className="days-card" onClick={() => router.push('/app/business/funds')} aria-label={`${days} din bache hain. Din add karein`} data-testid="biz.days">
        <DaysCoin days={days} size="md" />
        <span className="days-card-text">
          <b>Bache hue din</b>
          <small>Trial + balance · ₹1 = 1 din</small>
        </span>
        <span className="days-card-add"><Plus size={16} />Add</span>
      </button>
      {active.length > 0 && (
        <div className="biz-list" data-testid="biz.list">
          {active.map(({ q, s }) => (
            <div className="biz-item" key={q.id}>
              <QueueCard queueName={queueTitle(q)} status={s.status} servingNumber={s.serving} waitingCount={s.waiting}
                onClick={() => router.push(`/app/business/${q.id}`)} onPrefetch={() => router.prefetch(`/app/business/${q.id}`)} testId={`biz.card.${q.id}`} />
              {renderQuick(q)}
            </div>
          ))}
        </div>
      )}
      <Button fullWidth variant="secondary" icon={<Plus size={20} />} onClick={() => router.push('/app/business/new')} testId="biz.new">{t('biz.new')}</Button>
      {old.length > 0 && (
        <section className="biz-old" data-testid="biz.old">
          <h2 className="t-overline biz-old-h">{t('biz.old')}</h2>
          {old.map(({ q, s }) => (
            <QueueCard key={q.id} queueName={queueTitle(q)} status="closed" servingNumber={s.serving} waitingCount={s.waiting} subText={s.lastLine} onClick={() => setSelected(q)} testId={`biz.old.${q.id}`} />
          ))}
        </section>
      )}
    </main>
    <BottomSheet isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? queueTitle(selected) : ''} testId="biz.closed.options">
      <div className="stack-3">
        <Button fullWidth loading={actionBusy} onClick={() => void closedAction('owner_restart')}>Dobara shuru karein</Button>
        {selected?.sessions.some(session => session.tokens.some(token => token.status === 'waiting' || token.status === 'serving')) && <Button fullWidth variant="secondary" loading={actionBusy} onClick={() => void closedAction('owner_resume_queue')}>Jahan chhoda tha wahan se</Button>}
        <Button fullWidth variant="secondary" onClick={() => selected && router.push(`/app/business/${selected.id}/history`)}>History dekhein</Button>
        <Button fullWidth variant="secondary" onClick={() => selected && router.push(`/app/business/${selected.id}/settings`)}>Settings badlein</Button>
      </div>
    </BottomSheet>
    <Dialog isOpen={!!endTarget} title="Aaj ka kaam khatam karein?" body="Bache hue token khatam ho jayenge. Customer scan karenge toh 'Ye line band hai' dikhega." primaryLabel={busyId ? 'Rukiye…' : 'Din khatam karein'} onPrimary={() => endTarget && void quick(endTarget, 'end')} onCancel={() => setEndTarget(null)} testId="biz.endday.confirm" />
    </>
  );
}
