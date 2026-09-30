'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { BottomSheet } from '@/components/BottomSheet';
import Button from '@/components/Button';
import { Card } from '@/components/Cards';
import { TextField } from '@/components/TextField';
import { createClient } from '@/lib/supabase/client';
import { isValidName } from '@/lib/validateName';
import { istTime, type PublicQueue } from '@/lib/publicQueue';
import { t, tf } from '@/lib/i18n';

interface Props { code: string; info: PublicQueue; defaultName: string; online: boolean; onStale: () => void; }

/** ETA: waiting x avg_time_min, +-20% (QUESTIONS.md). avg nahi ya kisi ke aage nahi = row nahi. */
function etaText(info: PublicQueue): string | null {
  const avg = info.avg_time_min;
  const ahead = (info.waiting ?? 0) + (info.serving != null ? 1 : 0);
  if (!avg || ahead < 1) return null;
  const mid = ahead * avg;
  return tf('confirm.eta', { a: Math.max(1, Math.round(mid * 0.8)), b: Math.max(2, Math.round(mid * 1.2)) });
}

export default function ConfirmSheet({ code, info, defaultName, online, onStale }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [name, setName] = useState(defaultName);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eta = etaText(info);
  const blocked = info.state !== 'live';

  const take = async () => {
    if (busy || blocked) return;
    if (!isValidName(name)) { setError(t('name.error')); return; }
    setBusy(true); setError(null);
    const { data, error: err } = await createClient().rpc('issue_token', { p_code: code, p_name: name.trim() });
    if (err || !data) { setBusy(false); setError(t('confirm.error')); return; }
    const r = data as { result: string; token_id?: string; number?: number };
    if (r.result === 'issued' && r.token_id) {
      if ('vibrate' in navigator) navigator.vibrate(15);
      const changed = info.next_number != null && r.number !== info.next_number;
      router.replace(`/app/tokens/${r.token_id}?t=${changed ? 'changed' : 'issued'}&n=${r.number}`);
      return;
    }
    if (r.result === 'existing' && r.token_id) { router.replace(`/app/tokens/${r.token_id}?t=existing`); return; }
    setBusy(false);
    if (r.result === 'rate') setError(t('confirm.rate'));
    else if (r.result === 'name') setError(t('name.error'));
    else if (r.result === 'closed' || r.result === 'paused' || r.result === 'limit' || r.result === 'invalid') onStale();
    else setError(t('confirm.error'));
  };

  const title = info.counter_name ? `${info.name} · ${info.counter_name}` : info.name ?? '';
  return (
    <BottomSheet
      isOpen={open} onClose={() => { setOpen(false); router.push('/app/scan'); }} title={title} dismissible testId="confirm"
      subtitle={info.started_at ? tf('land.started', { time: istTime(info.started_at) }) : undefined}
      primaryAction={<Button variant="primary" size="md" fullWidth loading={busy} disabled={blocked || !online} onClick={take} testId="confirm.cta">{t('confirm.cta')}</Button>}
      secondaryAction={<Button variant="tertiary" size="md" fullWidth onClick={() => { setOpen(false); router.push('/app/scan'); }} testId="confirm.cancel">{t('confirm.cancel')}</Button>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }} data-testid="confirm.tiles">
        <Card style={{ padding: 'var(--sp-3)' }}>
          <div className="t-overline c2">{t('confirm.now')}</div>
          <div className="t-number-m">{info.serving ?? '—'}</div>
        </Card>
        <Card style={{ padding: 'var(--sp-3)' }}>
          <div className="t-overline c2">{t('confirm.mine')}</div>
          <div className="t-number-m" style={{ color: 'var(--c-accent)' }}>{info.next_number ?? '—'}</div>
        </Card>
      </div>
      {eta && (
        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', marginTop: 'var(--sp-3)' }} data-testid="confirm.eta">
          <Clock size={20} aria-hidden="true" /><span className="t-body-sm c2">{eta}</span>
        </div>
      )}
      <div style={{ marginTop: 'var(--sp-4)' }} data-testid="confirm.name">
        <div className="t-caption c2">{t('confirm.nameLabel')}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-2)' }}>
          {editing
            ? <TextField label={t('name.label')} value={name} autoFocus maxLength={40} onChange={e => setName(e.target.value)} testId="confirm.name.field" />
            : <span className="t-body" style={{ fontWeight: 600, overflowWrap: 'anywhere' }} >{name}</span>}
          {!editing && <Button variant="tertiary" size="sm" onClick={() => setEditing(true)} testId="confirm.name.edit">{t('confirm.change')}</Button>}
        </div>
      </div>
      <p className="t-caption c2" style={{ marginTop: 'var(--sp-2)' }} data-testid="confirm.note">{t('confirm.note')}</p>
      <p className="t-caption c2" style={{ marginTop: 'var(--sp-1)' }} data-testid="confirm.group">{t('confirm.group')}</p>
      {blocked && <p className="t-caption c2" style={{ marginTop: 'var(--sp-3)' }} data-testid="confirm.paused">{t('land.paused.help')}</p>}
      {error && <p role="alert" className="t-caption" style={{ color: 'var(--c-danger)', marginTop: 'var(--sp-3)' }} data-testid="confirm.error">{error}</p>}
    </BottomSheet>
  );
}
