'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { CircleHelp, Clock3, MoreVertical, QrCode, Ticket } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { TokenCard } from '@/components/TokenCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { BottomSheet } from '@/components/BottomSheet';
import { createClient } from '@/lib/supabase/client';
import { BookLookup } from '@/components/home/BookLookup';

type Item={id:string;number:number;token_status:string;queue_name:string;queue_id:string;current_number:number|null;ahead:number;started_at:string;ended_at?:string|null;done_at?:string|null;created_at:string;result?:string};

const FINISHED=['done','left','removed','expired'];
const KEEP_MS=10*60*1000;
const SEEN_KEY='nmt_finished_seen';

function readSeen():Record<string,number>{try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')}catch{return {}}}
function writeSeen(v:Record<string,number>){try{localStorage.setItem(SEEN_KEY,JSON.stringify(v))}catch{/* ignore */}}

export default function TokensTab(){
  const [items,setItems]=React.useState<Item[]>([]),[loaded,setLoaded]=React.useState(false),[menu,setMenu]=React.useState(false),[now,setNow]=React.useState(()=>Date.now());
  const seenRef=React.useRef<Record<string,number>>({});
  const router=useRouter();const db=React.useMemo(()=>createClient(),[]);

  React.useEffect(()=>{
    let alive=true;
    seenRef.current=readSeen();
    const load=async()=>{
      const {data}=await db.rpc('customer_my_tokens');
      if(!alive)return;
      const list:Item[]=Array.isArray(data)?data.filter((x:Item)=>x?.result==='ok'):[];
      // Jis token ka poora hone ka time server se nahi aata, uska pehli baar dekha hua time yaad rakho
      const seen=seenRef.current;let changed=false;
      for(const x of list){if(FINISHED.includes(x.token_status)&&!x.done_at&&!x.ended_at&&!seen[x.id]){seen[x.id]=Date.now();changed=true}}
      const ids=new Set(list.map(x=>x.id));
      for(const k of Object.keys(seen)){if(!ids.has(k)){delete seen[k];changed=true}}
      if(changed)writeSeen(seen);
      setItems(list);setNow(Date.now());setLoaded(true);
    };
    void load();
    const timer=setInterval(()=>{if(document.visibilityState==='visible')void load()},15000);
    const tick=setInterval(()=>setNow(Date.now()),20000);
    return()=>{alive=false;clearInterval(timer);clearInterval(tick)};
  },[db]);

  const finishedAt=(x:Item)=>x.done_at?Date.parse(x.done_at):x.ended_at?Date.parse(x.ended_at):(seenRef.current[x.id]??now);

  const live=items.filter(x=>['waiting','serving'].includes(x.token_status)||(x.token_status==='skipped'&&!x.ended_at));
  const recent=items
    .filter(x=>FINISHED.includes(x.token_status)&&now-finishedAt(x)<KEEP_MS)
    .sort((a,b)=>finishedAt(b)-finishedAt(a));
  const shown=live.length+recent.length;

  const openToken=(id:string)=>router.push(`/app/tokens/${id}`);

  return <><AppBar title="Mere Tokens" isRootTab testId="tokens.appbar" rightActions={<IconButton icon={<MoreVertical/>} aria-label="Options" onClick={()=>setMenu(true)}/>}/>
  <main className="container page tight" data-testid="tokens">
    {!loaded?<p className="t-body-sm c2">Load ho raha hai…</p>:shown===0?<EmptyState icon={<Ticket/>} title="Abhi koi token nahi" body="QR scan karke token lein." actionLabel="Scan karein" onAction={()=>router.push('/app/scan')}/>:<>
      <div className="t-overline c2 tk-section">ABHI KE TOKENS</div>
      <div className="tk-list">
        {live.map(x=><TokenCard key={x.id} businessName={x.queue_name} servingNumber={x.current_number??0} yourNumber={x.number} aheadCount={x.token_status==='waiting'?x.ahead:undefined} progressPercentage={100/((x.ahead||0)+1)} state={x.token_status==='skipped'?'skipped':x.token_status==='serving'?'now':x.ahead===0?'next':'waiting'} onClick={()=>openToken(x.id)}/>)}
        {recent.map(x=>{const mins=Math.max(1,Math.ceil((KEEP_MS-(now-finishedAt(x)))/60000));return <TokenCard key={x.id} businessName={x.queue_name} servingNumber={x.current_number??0} yourNumber={x.number} state={x.token_status} footnote={`${mins} min me History me chala jayega`} onClick={()=>router.push(`/app/tokens/history/${x.id}`)}/>})}
      </div>
    </>}
    <Button variant="tertiary" size="sm" onClick={()=>router.push('/app/scan')}>Scan karein</Button>
    <BookLookup/>
  </main>
  <BottomSheet isOpen={menu} onClose={()=>setMenu(false)} title="Options">
    <div className="sheet-menu">
      <button type="button" onClick={()=>{setMenu(false);router.push('/app/tokens/history')}}><span className="sheet-menu-ico"><Clock3 size={20}/></span><span><b>History</b><small>Purane tokens aur dobara token lein</small></span></button>
      <button type="button" onClick={()=>{setMenu(false);router.push('/app/scan')}}><span className="sheet-menu-ico"><QrCode size={20}/></span><span><b>QR scan karein</b><small>Naya token lene ke liye</small></span></button>
      <button type="button" onClick={()=>{setMenu(false);router.push('/app/guide')}}><span className="sheet-menu-ico"><CircleHelp size={20}/></span><span><b>Madad (Guide)</b><small>App kaise chalate hain</small></span></button>
    </div>
  </BottomSheet></>;
}
