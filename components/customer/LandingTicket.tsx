import React from 'react';
import { Moon, QrCode } from 'lucide-react';
import { NumberFlip } from '@/components/NumberFlip';
import { Skeleton } from '@/components/Skeleton';
import { t } from '@/lib/i18n';
import type { PublicState } from '@/lib/publicQueue';

/** Ticket ka rang/size TicketCard jaisa; variant="landing" spec me hai par TicketCard me nahi tha (QUESTIONS.md). */
const shell: React.CSSProperties = { borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--c-border)' };

interface Props { state: PublicState | 'loading'; serving?: number | null; next?: number; }

export function LandingTicket({ state, serving, next }: Props) {
  if (state === 'loading') return <Skeleton variant="card" height={200} testId="land.ticket.skeleton" />;
  const done = state === 'closed' || state === 'limit' || state === 'invalid' || state === 'expired' || state === 'intake_paused';
  const bg = done ? 'var(--c-surface-2)' : 'var(--c-accent)';
  const fg = done ? 'var(--c-text)' : 'var(--c-on-accent)';
  const fg2 = done ? 'var(--c-text-2)' : 'var(--c-white-80)';

  let main: React.ReactNode;
  if (done) {
    const h = state === 'closed' ? t('land.closed.h') : state === 'limit' ? t('land.limit.h') : state === 'expired' ? t('land.expired.h') : state === 'intake_paused' ? t('land.intake.h') : t('land.invalid.h');
    const b = state === 'closed' ? t('land.closed.b') : state === 'limit' ? t('land.limit.b') : state === 'expired' ? t('land.expired.b') : state === 'intake_paused' ? t('land.intake.b') : t('land.invalid.b');
    main = (
      <div style={{ textAlign: 'center' }}>
        {state === 'closed' && <Moon size={40} aria-hidden="true" />}
        {state === 'invalid' && <QrCode size={40} aria-hidden="true" />}
        {(state === 'expired'||state==='intake_paused') && <Moon size={40} aria-hidden="true" />}
        <h2 className="t-h2" style={{ marginTop: 'var(--sp-2)' }}>{h}</h2>
        <p className="t-body-sm" style={{ color: fg2, marginTop: 'var(--sp-1)' }}>{b}</p>
      </div>
    );
  } else {
    main = (
      <div>
        <div className="t-overline" style={{ color: fg2 }}>{t('land.now')}</div>
        <div className="t-display-l" style={{ marginTop: 'var(--sp-1)' }}>
          {serving == null ? '—' : <NumberFlip value={serving} />}
        </div>
      </div>
    );
  }
  return (
    <div className="landing-ticket" style={{ ...shell, background: bg, color: fg }} data-testid="land.ticket">
      <div className="landing-ticket-main">{main}</div>
      {!done && (
        <>
          <div className="landing-ticket-perf" aria-hidden="true" />
          <div className="landing-ticket-stub">
            <div className="t-overline" style={{ color: fg2 }}>{t('land.next')}</div>
            <div className="t-display-l" style={{ marginTop: 'var(--sp-1)' }}>{next ?? '—'}</div>
          </div>
        </>
      )}
    </div>
  );
}
