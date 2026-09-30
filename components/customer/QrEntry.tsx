'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket } from 'lucide-react';
import Button from '@/components/Button';
import { Banner } from '@/components/Banner';
import { StickyBar } from '@/components/StickyBar';
import { Skeleton } from '@/components/Skeleton';
import { LandingTicket } from './LandingTicket';
import ConfirmSheet from './ConfirmSheet';
import { createClient } from '@/lib/supabase/client';
import { istTime, usePublicQueue, type PublicQueue } from '@/lib/publicQueue';
import { useOnline } from '@/lib/useOnline';
import { t, tf } from '@/lib/i18n';
import { brand } from '@/lib/brand';

interface Props { code: string; initial: PublicQueue; userName: string | null; }

export default function QrEntry({ code, initial, userName }: Props) {
  const router = useRouter();
  const online = useOnline();
  const { data, stale, lastOk, refetch } = usePublicQueue(code, initial);
  const [loginBusy, setLoginBusy] = useState(false);
  const q = data ?? initial;
  const loggedIn = userName !== null;
  const canTake = q.state === 'live';
  const sheetOpen = loggedIn && (q.state === 'live' || q.state === 'paused');
  const title = q.name ?? '';
  const minutesAgo = Math.max(1, Math.round((Date.now() - lastOk) / 60000));

  const login = async () => {
    setLoginBusy(true);
    const next = `/q/${code}`;
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setLoginBusy(false);
  };

  const banner = !online ? <Banner variant="offline" minutesAgo={minutesAgo} testId="land.offline" />
    : stale ? <Banner variant="reconnecting" testId="land.reconnecting" />
    : q.state === 'paused' ? <Banner variant="paused" testId="land.paused" /> : null;

  return (
    <>
      {banner && <div style={{ position: 'sticky', top: 0, zIndex: 'var(--z-banner)' }}>{banner}</div>}
      <main className="container" style={{ paddingBottom: 140 }} data-testid="land">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', paddingTop: 'calc(24px + var(--safe-top))' }} data-testid="land.logo">
          <Ticket size={32} aria-hidden="true" />
          <h3 className="t-h3">{brand.name}</h3>
        </div>
        {title && <h1 className="t-h1" style={{ marginTop: 'var(--sp-6)', overflowWrap: 'anywhere' }} data-testid="land.title">{title}</h1>}
        {q.started_at && <p className="t-body-sm c2" style={{ marginTop: 'var(--sp-1)' }} data-testid="land.started">{tf('land.started', { time: istTime(q.started_at) })}</p>}
        <div style={{ marginTop: 'var(--sp-6)' }}>
          {sheetOpen ? <Skeleton variant="card" height={200} testId="land.ticket.skeleton" /> : <LandingTicket state={q.state} serving={q.serving} next={q.next_number} />}
        </div>
        {!sheetOpen && (q.state === 'live' || q.state === 'paused') && (
          <p className="t-body-sm c2" style={{ textAlign: 'center', marginTop: 'var(--sp-4)' }} data-testid="land.note">
            {tf('land.note', { n: q.next_number ?? '—' })}
          </p>
        )}
      </main>

      {!loggedIn && (q.state === 'live' || q.state === 'paused') && (
        <StickyBar testId="land.bar">
          <div style={{ width: '100%' }}>
            <p className="t-caption c2" style={{ textAlign: 'center', marginBottom: 'var(--sp-2)' }} data-testid="land.foot">
              {q.state === 'paused' ? t('land.paused.help') : t('land.foot')}
            </p>
            <Button variant="primary" size="md" fullWidth loading={loginBusy} disabled={!canTake || !online} onClick={login} testId="land.cta">{t('land.cta')}</Button>
          </div>
        </StickyBar>
      )}
      {q.state === 'invalid' && (
        <StickyBar testId="land.bar">
          <Button variant="tertiary" size="md" fullWidth onClick={() => router.push('/')} testId="land.home">{t('land.home')}</Button>
        </StickyBar>
      )}

      {sheetOpen && (
        <ConfirmSheet code={code} info={q} defaultName={userName} online={online} onStale={refetch} />
      )}
    </>
  );
}
