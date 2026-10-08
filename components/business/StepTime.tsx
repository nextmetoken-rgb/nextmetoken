'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { TextField } from '@/components/TextField';
import { t } from '@/lib/i18n';
import type { AvgMode, QueueErrors } from '@/lib/queueInput';

interface Props {
  avgMode: AvgMode; minutes: string; start: string; errors: QueueErrors;
  onMode: (v: AvgMode) => void; onMinutes: (v: string) => void; onStart: (v: string) => void;
}

function RadioCard({ checked, title, help, onSelect, testId }: { checked: boolean; title: string; help?: string; onSelect: () => void; testId: string }) {
  return (
    <button type="button" role="radio" aria-checked={checked} className="radio-card" onClick={onSelect} data-testid={testId}>
      <span className="t-label">{title}</span>
      {help && <span className="t-caption sub-text">{help}</span>}
    </button>
  );
}

export function StepTime({ avgMode, minutes, start, errors, onMode, onMinutes, onStart }: Props) {
  const [advOpen, setAdvOpen] = useState(errors.start === true || start !== '1');
  const Chevron = advOpen ? ChevronUp : ChevronDown;
  return (
    <div className="form-stack" data-testid="new.step3">
      <div className="form-head">
        <h1 className="t-h1">{t('new.s3.h')}</h1>
        <p className="t-body-sm sub-text">{t('new.s3.sub')}</p>
      </div>
      <div role="radiogroup" className="form-stack" style={{ gap: 'var(--sp-3)' }}>
        <RadioCard checked={avgMode === 'auto'} title={t('new.s3.auto')} help={t('new.s3.auto.d')} onSelect={() => onMode('auto')} testId="new.avg.auto" />
        <RadioCard checked={avgMode === 'manual'} title={t('new.s3.manual')} onSelect={() => onMode('manual')} testId="new.avg.manual" />
      </div>
      {avgMode === 'manual' && (
        <TextField label={t('new.s3.min')} inputMode="numeric" maxLength={3} value={minutes}
          onChange={e => onMinutes(e.target.value.replace(/\D/g, ''))} error={errors.minutes ? t('v.minutes') : undefined} testId="new.minutes" />
      )}
      <div>
        <button type="button" className="adv-row t-label" aria-expanded={advOpen} onClick={() => setAdvOpen(o => !o)} data-testid="new.adv">
          <span>{t('new.s3.adv')}</span><Chevron size={20} />
        </button>
        {advOpen && (
          <TextField label={t('new.s3.start')} helperText={t('new.s3.start.help')} inputMode="numeric" maxLength={4} value={start}
            onChange={e => onStart(e.target.value.replace(/\D/g, ''))} error={errors.start ? t('v.start') : undefined} testId="new.start" />
        )}
      </div>
    </div>
  );
}
