'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CircleHelp, Clock3, MoreVertical, Pause, Play, QrCode, Settings, Trash2, UserPlus, Volume2, Moon, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Banner } from '@/components/Banner';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Card, PersonRow } from '@/components/Cards';
import { Chip } from '@/components/Chip';
import { Dialog } from '@/components/Dialog';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { NumberFlip } from '@/components/NumberFlip';
import { Skeleton } from '@/components/Skeleton';
import { StickyBar } from '@/components/StickyBar';
import { TextField } from '@/components/TextField';
import { Toast, type ToastType } from '@/components/Toast';
import { ToggleRow } from '@/components/Toggle';
import { createClient } from '@/lib/supabase/client';
import { useOnline } from '@/lib/useOnline';

export type ConsoleToken = { id: string; number: number; display_name: string; is_walkin: boolean; status: string; hidden_for_owner: boolean; created_at: string; called_at: string | null };
export type ConsoleData = { queue: { id: string; name: string; status: 'live'|'paused'|'closed'; start_number: number; token_limit: number|null }; session: { id: string; started_at: string; current_number: number|null; version: number } | null; tokens: ConsoleToken[] };

type ToastState = { message: string; type: ToastType; undo?: boolean } | null;

function digitFont(n: number | null) { const len = String(n ?? '—').length; return len <= 3 ? 'clamp(88px,30vw,120px)' : len === 4 ? 'clamp(64px,22vw,88px)' : 'clamp(48px,16vw,64px)'; }
function fmtTime(v: string) { return new Intl.DateTimeFormat('en-IN', { hour:'numeric', minute:'2-digit', hour12:true, timeZone:'Asia/Kolkata' }).format(new Date(v)); }

export default function OwnerConsole({ initial }: { initial: ConsoleData }) {
  const router = useRouter(); const online = useOnline();
  const [data, setData] = useState(initial); const [loading, setLoading] = useState(false); const [sheet, setSheet] = useState<'more'|'walkin'|null>(null); const [dialog, setDialog] = useState<ConsoleToken|null>(null); const [toast, setToast] = useState<ToastState>(null); const [walkName, setWalkName] = useState(''); const [sound, setSound] = useState(false); const [menuBusy, setMenuBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null); const lockRef = useRef(false); const undoRef = useRef<{queueId:string}|null>(null); const wakeRef = useRef<any>(null);

  const load = useCallback(async () => {
    const sb = createClient();
    const [{ data:q }, { data:s }, { data:tokens }] = await Promise.all([
      sb.from('queues').select('id,name,status,start_number,token_limit').eq('id',initial.queue.id).is('deleted_at',null).maybeSingle(),
      sb.from('sessions').select('id,started_at,current_number,version').eq('queue_id',initial.queue.id).is('ended_at',null).order('started_at',{ascending:false}).limit(1).maybeSingle(),
      sb.from('tokens').select('id,number,display_name,is_walkin,status,hidden_for_owner,created_at,called_at').eq('session_id',initial.session?.id || '').eq('hidden_for_owner',false).order('number',{ascending:true}),
    ]);
    if (q) setData({ queue:q as ConsoleData['queue'], session:s as ConsoleData['session'], tokens:(tokens||[]) as ConsoleToken[] });
  }, [initial.queue.id, initial.session?.id]);

  useEffect(() => { if (!online) return; const id = window.setInterval(() => void load(), 5000); return () => window.clearInterval(id); }, [online, load]);
  useEffect(() => { const sb=createClient(); const ch=sb.channel(`queue-${data.queue.id}`).on('postgres_changes',{event:'*',schema:'public',table:'tokens',filter:`session_id=eq.${data.session?.id||'none'}`},()=>void load()).on('postgres_changes',{event:'*',schema:'public',table:'sessions',filter:`queue_id=eq.${data.queue.id}`},()=>void load()).on('postgres_changes',{event:'*',schema:'public',table:'queues',filter:`id=eq.${data.queue.id}`},()=>void load()).subscribe(); return ()=>{ void sb.removeChannel(ch); }; }, [data.queue.id,data.session?.id,load]);
  useEffect(() => { const fn=()=>void load(); document.addEventListener('visibilitychange',fn); return ()=>document.removeEventListener('visibilitychange',fn); },[load]);
  useEffect(() => { const nav=navigator as Navigator & { wakeLock?: any }; if (!nav.wakeLock) return; let active=true; const acquire=async()=>{ try { if(active) wakeRef.current=await nav.wakeLock.request('screen'); } catch {} }; void acquire(); return ()=>{ active=false; void wakeRef.current?.release?.(); }; }, []);

  const current = data.tokens.find(t=>t.status==='serving') || null; const waiting = data.tokens.filter(t=>t.status==='waiting'); const list = data.tokens;
  const focusCurrent = useCallback((smooth=false) => { const box=listRef.current; if(!box) return; const target=box.querySelector<HTMLElement>('[data-current-row="true"]') || box.querySelector<HTMLElement>('[data-first-row="true"]'); if(!target) return; const top=Math.max(0,target.offsetTop - target.offsetHeight*2); box.scrollTo({top,behavior:smooth?'smooth':'auto'}); },[]);
  useEffect(()=>{ const id=window.setTimeout(()=>focusCurrent(false),0); return()=>window.clearTimeout(id); },[data.session?.id]);

  const act = useCallback(async (fn:string,args:unknown[], opts?:{focus?:boolean}) => { if(lockRef.current) return; if(!online){setToast({message:'Offline. Dobara connect hone par koshish karein.',type:'error'});return;} lockRef.current=true; setLoading(true); try { const {data:r,error}=await createClient().rpc(fn,Object.fromEntries(args as any)); if(error || !r){setToast({message:'Number badal nahi paya. Dobara koshish karein.',type:'error'});return;} if(r.result==='empty'){setToast({message:'Ab line me koi nahi hai.',type:'info'});return;} if(r.result==='no_prev'){setToast({message:'Pichla number nahi hai.',type:'info'});return;} if(r.result==='stale'){setToast({message:'Undo ab available nahi hai.',type:'info'});return;} if(r.result!=='ok'){setToast({message:'Number badal nahi paya. Dobara koshish karein.',type:'error'});return;} await load(); if(opts?.focus) window.setTimeout(()=>focusCurrent(true),50); return r; } finally { setLoading(false); window.setTimeout(()=>{lockRef.current=false;},300); } },[online,load,focusCurrent]);

  const next = async()=>{ const r=await act('owner_next',[['p_queue_id',data.queue.id]],{focus:true}); if(r?.result==='ok'){navigator.vibrate?.(12); if(sound) speak(`Token number ${r.number}`); undoRef.current={queueId:data.queue.id}; setToast({message:`Number ${r.number} par gaye`,type:'info',undo:true});} };
  const prev = async()=>{ const r=await act('owner_prev',[['p_queue_id',data.queue.id]],{focus:true}); if(r?.result==='ok'){navigator.vibrate?.(12); setToast({message:`Number ${r.number} par gaye`,type:'info',undo:true});} };
  const undo = async()=>{ const r=await act('owner_undo',[['p_queue_id',data.queue.id]],{focus:true}); if(r?.result==='ok') setToast({message:'Undo ho gaya.',type:'success'}); };
  const speak=(text:string)=>{ if(typeof window!=='undefined' && 'speechSynthesis' in window){ window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); } };
  const addWalkin=async()=>{ const name=walkName.trim(); if(!name){setToast({message:'Naam likhein.',type:'error'});return;} const {data:r,error}=await createClient().rpc('owner_walkin',{p_queue_id:data.queue.id,p_name:name}); if(error||!r||r.result!=='ok'){setToast({message:r?.result==='limit'?'Token limit poori ho gayi.':'Walk-in nahi jud paya. Dobara koshish karein.',type:'error'});return;} setSheet(null);setWalkName('');await load();setToast({message:`${name} ko number ${r.number} mila`,type:'success'}); };
  const remove=async()=>{ if(!dialog)return; const t=dialog; setDialog(null); const {data:r,error}=await createClient().rpc('owner_remove',{p_queue_id:data.queue.id,p_token_id:t.id}); if(error||!r||r.result!=='ok'){setToast({message:'Hata nahi paye. Dobara koshish karein.',type:'error'});return;} await load(); setToast({message:`#${t.number} hata diya`,type:'info',undo:true}); };
  const togglePause=async()=>{ const nextStatus=data.queue.status==='paused'?'live':'paused'; setMenuBusy(true); const {data:r,error}=await createClient().rpc('owner_set_status',{p_queue_id:data.queue.id,p_status:nextStatus}); setMenuBusy(false); if(error||r?.result!=='ok'){setToast({message:'Line ka status nahi badal paya.',type:'error'});return;} setSheet(null);await load();if(nextStatus==='live')setToast({message:'Line chalu ho gayi.',type:'success'}); };
  const endDay=async()=>{ setMenuBusy(true); const {data:r,error}=await createClient().rpc('owner_end_day',{p_queue_id:data.queue.id});setMenuBusy(false);if(error||r?.result!=='ok'){setToast({message:'Din khatam nahi ho paya.',type:'error'});return;}setSheet(null);await load(); };
  const restart=async()=>{ setMenuBusy(true);const {data:r,error}=await createClient().rpc('owner_restart',{p_queue_id:data.queue.id});setMenuBusy(false);if(error||r?.result!=='ok'){setToast({message:'Line dobara shuru nahi ho payi.',type:'error'});return;}await load(); };

  const avgWait=useMemo(()=>{ const done=list.filter(t=>t.status==='done'&&t.called_at); if(done.length<3)return 3; const vals=done.slice(-10).map(t=>Math.max(1,Math.round((new Date(t.called_at!).getTime()-new Date(t.created_at).getTime())/60000))).sort((a,b)=>a-b); const trim=vals.length>4?vals.slice(1,-1):vals; return Math.max(1,Math.round(trim.reduce((a,b)=>a+b,0)/trim.length)); },[list]);
  const statsCount=list.length; const isClosed=data.queue.status==='closed';

  if(!data.session && !isClosed) return <main className="container page"><Skeleton variant="card" height={220}/>{[1,2,3,4,5].map(i=><Skeleton key={i} variant="line" height={64}/>)}</main>;
  return <>
    {!online && <Banner variant="offline" minutesAgo={2} testId="con.offline"/>}
    {online && data.queue.status==='paused' && <Banner variant="paused" testId="con.paused"/>}
    <main className="owner-console" data-testid="console">
      <header className="owner-appbar" data-testid="con.appbar"><IconButton icon={<ArrowLeft size={22}/>} aria-label="Wapas" onClick={()=>router.push('/app/business')} testId="con.back"/><h1 className="t-h3 owner-title">{data.queue.name}</h1><div className="owner-actions"><Chip variant={data.queue.status==='live'?'live':data.queue.status==='paused'?'paused':'closed'} label={data.queue.status==='live'?'Live':data.queue.status==='paused'?'Paused':'Closed'}/><IconButton icon={<MoreVertical size={22}/>} aria-label="More" onClick={()=>setSheet('more')} testId="con.more"/></div></header>
      <div className="owner-grid">
        <section className="owner-main">
          <Card testId="con.hero"><div className="t-overline c2">ABHI CHAL RAHA HAI</div><div className={`owner-hero-number ${isClosed?'owner-closed':''}`}><NumberFlip value={current?.number ?? '—'} style={{fontSize:digitFont(current?.number??null),lineHeight:1,fontWeight:800}} testId="con.hero.number"/></div><div className="owner-current-name">{isClosed?'Line band hai':current ? <>{current.display_name}{current.is_walkin?' (Walk-in)':''}</>:'Abhi kisi ko nahi bulaya'}</div><div className="t-caption c2">{data.session?`Shuru: ${fmtTime(data.session.started_at)} · Aaj ${statsCount} token`:' '}</div></Card>
          <Card testId="con.sound"><ToggleRow icon={<Volume2 size={24}/>} label="Awaaz announcement" helperText="Awaaz tabhi aayegi jab ye screen chalu ho. Phone off ya lock karne par awaaz nahi aayegi." checked={sound} onChange={v=>{setSound(v);if(v)speak('Awaaz chalu ho gayi')}}/></Card>
          {!isClosed && <Button variant="secondary" fullWidth icon={<UserPlus size={20}/>} onClick={()=>setSheet('walkin')} testId="con.walkin">Walk-in add karein</Button>}
          <div className="owner-stats t-caption" data-testid="con.stats">Aaj: {statsCount} token · Ausat wait {avgWait} min</div>
          <div className="owner-list-head"><h2 className="t-h3">Intezar me ({waiting.length})</h2><Button variant="tertiary" size="sm" onClick={()=>focusCurrent(true)} testId="con.jump">Abhi ke number par</Button></div>
          <div className="owner-list-box" ref={listRef} data-testid="con.list">
            {list.length===0 ? <EmptyState icon={<Users/>} title="Abhi koi intezar me nahi" body="Customer QR scan karke judenge." testId="con.empty"/> : list.map((token,i)=>{ const active=token.status==='serving'; const grey=['done','left','expired'].includes(token.status); const chip=token.status==='waiting'?(token.is_walkin?'Walk-in':''):token.status==='done'?'Poora hua':token.status==='left'?'Line chhod di':token.status==='expired'?'Khatam':token.status==='removed'?'Hata diya':active?'Ab chal raha':''; return <div key={token.id} data-current-row={active?'true':undefined} data-first-row={i===0?'true':undefined} className={`owner-person-row ${grey?'is-grey':''}`}><PersonRow number={token.number} name={`${token.display_name} #${token.number}`} metaText={token.status==='waiting'?`Kitne der se: ${Math.max(0,Math.floor((Date.now()-new Date(token.created_at).getTime())/60000))} min`:undefined} isNow={active} chipVariant={active?'now':token.status==='done'?'done':token.status==='left'?'left':token.is_walkin?'walkin':undefined} chipLabel={chip} testId={`con.row.${token.number}`}/>{(token.status==='waiting'||token.status==='left')&&<IconButton icon={<Trash2 size={18}/>} aria-label="Hatao" onClick={()=>setDialog(token)} testId={`con.row.${token.number}.remove`}/>}</div> })}
          </div>
        </section>
      </div>
    </main>
    {!isClosed && <StickyBar testId="con.bar"><div className="console-bar"><Button variant="secondary" size="lg" onClick={prev} disabled={loading||!online} icon={<ChevronLeft size={22}/>} testId="con.prev">Pichla</Button><Button size="lg" fullWidth onClick={next} disabled={loading||!online} testId="con.next">Agla <ChevronRight size={22}/></Button></div></StickyBar>}
    {isClosed && <div className="owner-closed-bar"><Button fullWidth onClick={restart} loading={menuBusy} testId="con.restart">Dobara shuru karein</Button></div>}
    <BottomSheet isOpen={sheet==='walkin'} onClose={()=>setSheet(null)} title="Walk-in add karein" subtitle="Jinke paas phone nahi hai unka naam likhein." primaryAction={<Button fullWidth onClick={addWalkin} testId="walkin.cta">Number dein</Button>} secondaryAction={<Button fullWidth variant="tertiary" onClick={()=>setSheet(null)}>Wapas</Button>} testId="walkin.sheet"><TextField label="Naam" value={walkName} onChange={e=>setWalkName(e.target.value.slice(0,40))} autoFocus autoCapitalize="words" maxLength={40} testId="walkin.name"/></BottomSheet>
    <BottomSheet isOpen={sheet==='more'} onClose={()=>setSheet(null)} title="Queue options" testId="con.more.sheet"><div className="console-menu"><button type="button" onClick={()=>router.push(`/app/business/${data.queue.id}/qr`)}><QrCode size={20}/>QR dikhao / print</button><button type="button" disabled={menuBusy} onClick={()=>void togglePause()}>{data.queue.status==='paused'?<Play size={20}/>:<Pause size={20}/>} {data.queue.status==='paused'?'Line chalu karein':'Line rok dein'}</button><button type="button" onClick={()=>void endDay()}><Moon size={20}/>Din khatam (End day)</button><button type="button" onClick={()=>setSheet(null)}><Clock3 size={20}/>History</button><button type="button" onClick={()=>setSheet(null)}><Settings size={20}/>Settings</button><button type="button" onClick={()=>setSheet(null)}><Trash2 size={20}/>Delete karein</button><button type="button" onClick={()=>setSheet(null)}><CircleHelp size={20}/>Guide (Madad)</button></div></BottomSheet>
    <Dialog isOpen={!!dialog} title="Pakka list se hatana hai?" body={dialog?.status==='left'?`#${dialog.number} ${dialog.display_name} ka naam list se hat jayega. 5 second me Undo kar sakte hain.`:`#${dialog?.number} ${dialog?.display_name} ko line se hata diya jayega aur unhe "Owner ne aapko line se hata diya" dikhega. 5 second me Undo kar sakte hain.`} primaryLabel="Haan, hatao" primaryVariant="danger-filled" onPrimary={remove} onCancel={()=>setDialog(null)} testId="con.remove.confirm"/>
    {toast && <Toast message={toast.message} type={toast.type} actionLabel={toast.undo?'Undo':undefined} onAction={toast.undo?undo:undefined} onDismiss={()=>setToast(null)} hasBottomNav={false} durationMs={toast.undo?5000:undefined} testId="con.toast"/>}
  </>;
}
