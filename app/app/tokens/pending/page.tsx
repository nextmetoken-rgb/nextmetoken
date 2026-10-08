'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { t } from '@/lib/i18n';

type Pending = { code: string; name: string; expected: number | null };

export default function PendingTokenPage() {
  const router = useRouter();
  const started = useRef(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);

  const issue = useCallback(async (request: Pending) => {
    setBusy(true); setError('');
    const { data, error: rpcError } = await createClient().rpc('issue_token', { p_code: request.code, p_name: request.name });
    if (rpcError || !data) { setBusy(false); setError(t('confirm.error')); return; }
    const result = data as { result: string; token_id?: string; number?: number };
    if ((result.result === 'issued' || result.result === 'existing') && result.token_id) {
      sessionStorage.removeItem('tokenapp-pending-issue');
      if (result.result === 'issued' && 'vibrate' in navigator) navigator.vibrate(15);
      const type = result.result === 'existing' ? 'existing' : result.number === request.expected ? 'issued' : 'changed';
      router.replace(`/app/tokens/${result.token_id}?t=${type}&n=${result.number ?? ''}`);
      return;
    }
    setBusy(false);
    if (result.result === 'rate') setError(t('confirm.rate'));
    else if (result.result === 'name') setError(t('name.error'));
    else setError(t('confirm.error'));
  }, [router]);

  useEffect(() => {
    const raw = sessionStorage.getItem('tokenapp-pending-issue');
    if (!raw) { router.replace('/app/scan'); return; }
    try {
      const request = JSON.parse(raw) as Pending;
      setPending(request);
      if (!started.current) { started.current = true; void issue(request); }
    } catch { router.replace('/app/scan'); }
  }, [issue, router]);

  return <main className="container page tight pending-ticket" aria-busy={busy}>
    <p className="t-overline c2">{busy ? 'TOKEN BAN RAHA HAI' : 'TOKEN NAHI MIL PAYA'}</p>
    <div className="ticket-skeleton"><Skeleton variant="custom" height={20}/><Skeleton variant="custom" height={88}/><div className="ticket-skeleton-perf"/><Skeleton variant="custom" height={56}/></div>
    {error && <><p role="alert" className="t-body-sm c2">{error}</p><Button fullWidth loading={busy} onClick={() => pending && void issue(pending)}>Dobara koshish karein</Button><Button fullWidth variant="tertiary" href="/app/scan">Wapas scan par jayein</Button></>}
  </main>;
}
