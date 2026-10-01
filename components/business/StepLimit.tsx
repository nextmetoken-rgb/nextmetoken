'use client';
import { TextField } from '@/components/TextField';
import { ToggleRow } from '@/components/Toggle';
import { t } from '@/lib/i18n';

interface Props { noLimit: boolean; limit: string; showError: boolean; onNoLimit: (v: boolean) => void; onLimit: (v: string) => void }

export function StepLimit({ noLimit, limit, showError, onNoLimit, onLimit }: Props) {
  return (
    <div className="form-stack" data-testid="new.step2">
      <div className="form-head">
        <h1 className="t-h1">{t('new.s2.h')}</h1>
        <p className="t-body-sm sub-text">{t('new.s2.sub')}</p>
      </div>
      <ToggleRow label={t('new.s2.nolimit')} checked={noLimit} onChange={onNoLimit} testId="new.nolimit" />
      {!noLimit && (
        <TextField label={t('new.s2.max')} inputMode="numeric" maxLength={4} value={limit}
          onChange={e => onLimit(e.target.value.replace(/\D/g, ''))} error={showError ? t('v.limit') : undefined} testId="new.limit" autoFocus />
      )}
    </div>
  );
}
