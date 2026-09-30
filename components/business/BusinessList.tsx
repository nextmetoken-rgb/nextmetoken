'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Plus, Store } from 'lucide-react';
import { Banner } from '@/components/Banner';
import { Button } from '@/components/Button';
import { QueueCard } from '@/components/Cards';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { queueTitle, sortQueues, type QueueRow } from '@/lib/queueView';
import { t } from '@/lib/i18n';
import { useOnline } from '@/lib/useOnline';

type Load = { kind: 'loading' } | { kind: 'error' } | { kind: 'ok'; rows: QueueRow[]; at: number };

export default function BusinessList() {
  const router = useRouter();
  const online = useOnline();
  const [state, setState] = useState<Load>({ kind: 'loading' });

  const load = useCallback(async () => {
    const { data, error } = await createClient()
      .from('queues')
      .select('id,name,counter_name,status,created_at,sessions(id,started_at,ended_at,current_number,tokens(status))')
      .is('deleted_at', null);
    setState(prev => (error || !data ? (prev.kind === 'ok' ? prev : { kind: 'error' }) : { kind: 'ok', rows: data as unknown as QueueRow[], at: Date.now() }));
  }, []);

  useEffect(() => { if (online) void load(); }, [online, load]);
  useEffect(()=>{const refresh=()=>void load();window.addEventListener('queues-changed',refresh);return()=>window.removeEventListener('queues-changed',refresh)},[load]);

  const banner = !online ? <Banner variant="offline" minutesAgo={state.kind === 'ok' ? Math.floor((Date.now() - state.at) / 60000) : 0} testId="biz.offline" /> : null;

  if (state.kind === 'loading' && online) {
    return <main className="container page tight" data-testid="biz.loading"><div className="biz-list">{[0, 1, 2].map(i => <Skeleton key={i} variant="card" height={88} />)}</div></main>;
  }
  if (state.kind !== 'ok') {
    return (
      <>{banner}
        <main className="container page tight">
          <EmptyState icon={<AlertTriangle />} title={t('biz.error.title')} body={t('biz.error.body')} actionLabel={t('biz.error.cta')} onAction={() => { setState({ kind: 'loading' }); void load(); }} testId="biz.error" />
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

  return (
    <>{banner}
      <main className="container page tight" data-testid="business">
        {active.length > 0 && (
          <div className="biz-list" data-testid="biz.list">
            {active.map(({ q, s }) => (
              <QueueCard key={q.id} queueName={queueTitle(q)} status={s.status} servingNumber={s.serving} waitingCount={s.waiting}
                onClick={() => router.push(`/app/business/${q.id}`)} testId={`biz.card.${q.id}`} />
            ))}
          </div>
        )}
        <Button fullWidth icon={<Plus size={20} />} onClick={() => router.push('/app/business/new')} testId="biz.new">{t('biz.new')}</Button>
        {old.length > 0 && (
          <section className="biz-old" data-testid="biz.old">
            <h2 className="t-overline biz-old-h">{t('biz.old')}</h2>
            {old.map(({ q, s }) => (
              <QueueCard key={q.id} queueName={queueTitle(q)} status="closed" servingNumber={s.serving} waitingCount={s.waiting} subText={s.lastLine} testId={`biz.old.${q.id}`} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}
