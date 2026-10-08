'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { Banner } from '@/components/Banner';
import { Button } from '@/components/Button';
import { StepDots } from '@/components/StepDots';
import { StickyBar } from '@/components/StickyBar';
import { Toast } from '@/components/Toast';
import { TextField } from '@/components/TextField';
import { createQueueAction } from '@/app/app/business/new/actions';
import { EMPTY_QUEUE_INPUT, nameOk, validateStep, type QueueErrors, type QueueInput } from '@/lib/queueInput';
import { t } from '@/lib/i18n';
import { useOnline } from '@/lib/useOnline';
import { createClient } from '@/lib/supabase/client';
import { StepName } from './StepName';
import { StepLimit } from './StepLimit';
import { StepTime } from './StepTime';

type BookState = 'idle'|'checking'|'available'|'taken'|'invalid';
function suggestBookId(name:string){return name.normalize('NFKD').replace(/[^\w\s-]/g,'').trim().toLowerCase().replace(/[\s_]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,30)}

export default function NewQueueFlow() {
  const router = useRouter(); const online = useOnline();
  const [step,setStep]=useState<1|2|3|4>(1); const [v,setV]=useState<QueueInput>(EMPTY_QUEUE_INPUT); const [bookId,setBookId]=useState('');
  const [manualBook,setManualBook]=useState(false); const [bookState,setBookState]=useState<BookState>('idle');
  const [errors,setErrors]=useState<QueueErrors>({}); const [loading,setLoading]=useState(false); const [failed,setFailed]=useState(false);const [failedMessage,setFailedMessage]=useState('');
  const set=<K extends keyof QueueInput>(k:K,val:QueueInput[K])=>setV(p=>({...p,[k]:val}));
  useEffect(()=>{if(!manualBook)setBookId(suggestBookId(v.name))},[v.name,manualBook]);
  useEffect(()=>{if(step!==2||!online)return;const value=bookId.trim().toLowerCase();if(!/^[a-z0-9][a-z0-9-]{2,29}$/.test(value)){setBookState('invalid');return}setBookState('checking');const timer=window.setTimeout(async()=>{const {data,error}=await createClient().rpc('book_id_available',{p_book_id:value,p_queue_id:null});setBookState(error?'idle':data?'available':'taken')},250);return()=>window.clearTimeout(timer)},[bookId,step,online]);
  const back=()=>step>1?setStep((step-1) as 1|2|3|4):router.push('/app/business');
  const submit=async()=>{setLoading(true);const res=await createQueueAction(v,bookId).catch(()=>({error:'save' as const}));if('id'in res){router.push(`/app/business/${res.id}/qr?created=1`);return}setLoading(false);if(res.error==='book_taken'){setStep(2);setBookState('taken');return}setFailedMessage(res.error==='exists'?'Aapke account me business pehle se hai. Business tab kholein.':res.error==='save'?'Business save nahi hua. Agar Business tab me bhi queue nahi khul rahi, corrected Supabase migration 009 run karke refresh karein.':'Business details check karein.');setFailed(true)};
  const next=()=>{if(step===1){const e=validateStep(1,v);setErrors(e);if(Object.values(e).some(Boolean))return}
    if(step===2&&bookState!=='available')return;
    if(step===3){const e=validateStep(2,v);setErrors(e);if(Object.values(e).some(Boolean))return}
    if(step===4){const e=validateStep(3,v);setErrors(e);if(Object.values(e).some(Boolean))return;void submit();return}
    setStep((step+1) as 2|3|4)};
  return <>
    <AppBar title={t('new.title')} onBack={back} testId="new.appbar"/>{!online&&<Banner variant="offline" testId="new.offline"/>}
    <main className="container page tight" data-testid="new"><StepDots totalSteps={4} currentStep={step}/>
      {step===1&&<StepName name={v.name} showError={errors.name===true} onName={x=>set('name',x)}/>}
      {step===2&&<div className="form-stack" data-testid="new.book"><h1 className="t-h1">Apna Book ID chunein</h1><p className="t-body-sm c2">Customer QR ke bina bhi is ID se aapki queue dhoondh sakte hain.</p><TextField label="Book ID" value={bookId} maxLength={30} onChange={e=>{setManualBook(true);setBookId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'').replace(/--+/g,'-'))}} helperText="3–30 letters, numbers ya hyphen. URL mein isi ID ka use hoga." testId="new.book-id"/>{bookState==='checking'&&<p className="t-caption c2">Availability check ho rahi hai…</p>}{bookState==='available'&&<p className="book-availability available"><Check size={18}/> Yeh Book ID available hai</p>}{bookState==='taken'&&<p className="book-availability taken"><X size={18}/> Yeh ID pehle se li gayi hai. Doosri ID chunein.</p>}{bookState==='invalid'&&<p className="t-caption c2">Kam se kam 3 characters likhein.</p>}</div>}
      {step===3&&<StepLimit noLimit={v.noLimit} limit={v.limit} showError={errors.limit===true} onNoLimit={x=>set('noLimit',x)} onLimit={x=>set('limit',x)}/>}
      {step===4&&<StepTime avgMode={v.avgMode} minutes={v.minutes} start={v.start} errors={errors} onMode={x=>set('avgMode',x)} onMinutes={x=>set('minutes',x)} onStart={x=>set('start',x)}/>}
      <div className="sticky-space"/>
    </main>
    <StickyBar testId="new.cta"><Button fullWidth loading={loading} disabled={!online||(step===1&&!nameOk(v.name))||(step===2&&bookState!=='available')} onClick={next}>{step===4?t('new.create'):'Aage badhein'}</Button></StickyBar>
    {failed&&<Toast type="error" message={failedMessage||t('new.saveError')} hasBottomNav={false} onDismiss={()=>setFailed(false)}/>}
  </>;
}
