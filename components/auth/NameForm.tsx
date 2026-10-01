'use client';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { TextField } from '@/components/TextField';
import { StickyBar } from '@/components/StickyBar';
import { Toast } from '@/components/Toast';
import { createClient } from '@/lib/supabase/client';
import { isValidName, NAME_MAX } from '@/lib/validateName';
import { t } from '@/lib/i18n';

export default function NameForm({ defaultName, next }: { defaultName: string; next: string }) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const dismiss = useCallback(() => setSaveFailed(false), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const clean = name.trim();
    if (!isValidName(clean)) { setError(t('name.error')); return; }
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = user
      ? await supabase.from('users').update({ name: clean }).eq('id', user.id)
      : { error: new Error('no user') };
    if (err) { setLoading(false); setSaveFailed(true); return; }
    router.replace(next);
    router.refresh();
  };

  return (
    <form onSubmit={submit} noValidate data-testid="name">
      <main className="container name-page">
        <h1 className="t-h1" data-testid="name.title">{t('name.title')}</h1>
        <p className="t-body-sm c2" style={{ marginTop: 'var(--sp-2)' }} data-testid="name.sub">{t('name.sub')}</p>
        <div style={{ marginTop: 'var(--sp-6)' }}>
          <TextField
            label={t('name.label')} value={name} error={error} testId="name.field"
            autoComplete="name" maxLength={NAME_MAX + 20} enterKeyHint="done"
            onChange={(ev) => { setName(ev.target.value); if (error) setError(''); }}
            onClear={() => setName('')}
          />
        </div>
      </main>
      <StickyBar testId="name.cta.bar">
        <Button type="submit" size="md" fullWidth loading={loading} testId="name.cta">{t('name.cta')}</Button>
      </StickyBar>
      {saveFailed && <Toast type="error" message={t('name.saveError')} hasBottomNav={false} onDismiss={dismiss} />}
    </form>
  );
}
