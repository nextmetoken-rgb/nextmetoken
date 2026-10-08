'use client';
import { TextField } from '@/components/TextField';
import { t } from '@/lib/i18n';
import { QUEUE_LIMITS } from '@/lib/queueInput';

interface Props { name: string; showError: boolean; onName: (v: string) => void }

export function StepName({ name, showError, onName }: Props) {
  return (
    <div className="form-stack" data-testid="new.step1">
      <h1 className="t-h1">{t('new.s1.h')}</h1>
      <TextField label={t('new.s1.name')} placeholder={t('new.s1.name.ph')} value={name} maxLength={QUEUE_LIMITS.nameMax}
        onChange={e => onName(e.target.value)} onClear={() => onName('')} error={showError ? t('v.name') : undefined} testId="new.name" autoFocus />
    </div>
  );
}
