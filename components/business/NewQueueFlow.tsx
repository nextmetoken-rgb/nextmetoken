'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/AppBar';
import { Banner } from '@/components/Banner';
import { Button } from '@/components/Button';
import { StepDots } from '@/components/StepDots';
import { StickyBar } from '@/components/StickyBar';
import { Toast } from '@/components/Toast';
import { createQueueAction } from '@/app/app/business/new/actions';
import { EMPTY_QUEUE_INPUT, nameOk, validateStep, type QueueErrors, type QueueInput } from '@/lib/queueInput';
import { t } from '@/lib/i18n';
import { useOnline } from '@/lib/useOnline';
import { StepName } from './StepName';
import { StepLimit } from './StepLimit';
import { StepTime } from './StepTime';

export default function NewQueueFlow() {
  const router = useRouter();
  const online = useOnline();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [v, setV] = useState<QueueInput>(EMPTY_QUEUE_INPUT);
  const [errors, setErrors] = useState<QueueErrors>({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const set = <K extends keyof QueueInput>(k: K, val: QueueInput[K]) => { setV(p => ({ ...p, [k]: val })); setErrors(e => ({ ...e, [k === 'noLimit' ? 'limit' : k]: undefined })); };

  const back = () => (step > 1 ? setStep((step - 1) as 1 | 2) : router.push('/app/business'));

  const submit = async () => {
    setLoading(true);
    const res = await createQueueAction(v).catch(() => ({ error: 'save' as const }));
    if ('id' in res) { router.push(`/app/business/${res.id}/qr?created=1`); return; }
    setLoading(false);
    setFailed(true);
  };

  const next = () => {
    const e = validateStep(step, v);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (step < 3) setStep((step + 1) as 2 | 3); else void submit();
  };

  return (
    <>
      <AppBar title={t('new.title')} onBack={back} testId="new.appbar" />
      {!online && <Banner variant="offline" testId="new.offline" />}
      <main className="container page tight" data-testid="new">
        <StepDots totalSteps={3} currentStep={step} />
        {step === 1 && <StepName name={v.name} counter={v.counter} showError={errors.name === true} onName={x => set('name', x)} onCounter={x => set('counter', x)} />}
        {step === 2 && <StepLimit noLimit={v.noLimit} limit={v.limit} showError={errors.limit === true} onNoLimit={x => set('noLimit', x)} onLimit={x => set('limit', x)} />}
        {step === 3 && <StepTime avgMode={v.avgMode} minutes={v.minutes} start={v.start} errors={errors} onMode={x => set('avgMode', x)} onMinutes={x => set('minutes', x)} onStart={x => set('start', x)} />}
        <div className="sticky-space" />
      </main>
      <StickyBar testId="new.cta">
        <Button fullWidth loading={loading} disabled={(step === 1 && !nameOk(v.name)) || (step === 3 && !online)} onClick={next}>
          {step === 3 ? t('new.create') : t('new.next')}
        </Button>
      </StickyBar>
      {failed && <Toast type="error" message={t('new.saveError')} hasBottomNav={false} onDismiss={() => setFailed(false)} />}
    </>
  );
}
