'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Clock3, MoreVertical, Ticket } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { TokenCard } from '@/components/Cards';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { BottomSheet } from '@/components/BottomSheet';
import { createClient } from '@/lib/supabase/client';
import { BookLookup } from '@/components/home/BookLookup';
type Item={id:string;number:number;token_status:string;queue_name:string;queue_id:string;current_number:number|null;ahead:number;started_at:string;created_at:string;result?:string};
export default function TokensTab(){
  const [items,setItems]=React.useState<Item[]>([]),[loaded,setLoaded]=React.useState(false),[menu,setMenu]=React.useState(false);const router=useRouter();const db=React.useMemo(()=>createClient(),[]);
  React.useEffect(()=>{let alive=true;const load=async()=>{const {data}=await db.rpc('customer_my_tokens');if(alive){setItems(Array.isArray(data)?data.filter((x:Item)=>x?.result==='ok'):[]);setLoaded(true)}};void load();const timer=setInterval(()=>{if(document.visibilityState==='visible')void load()},15000);return()=>{alive=false;clearInterval(timer)}},[db]);
  const live=items.filter(x=>['waiting','serving'].includes(x.token_status));
  return <><AppBar title="Mere Tokens" isRootTab testId="tokens.appbar" rightActions={<IconButton icon={<MoreVertical/>} aria-label="Options" onClick={()=>setMenu(true)}/>}/><main className="container page tight" data-testid="tokens">
    {!loaded?<p className="t-body-sm c2">Load ho raha hai…</p>:live.length===0?<EmptyState icon={<Ticket/>} title="Abhi koi token nahi" body="QR scan karke token lein." actionLabel="Scan karein" onAction={()=>router.push('/app/scan')}/>:<><div className="t-overline c2" style={{paddingInline:'var(--sp-2)'}}>ABHI KE TOKENS</div>{live.map(x=><TokenCard key={x.id} businessName={x.queue_name} servingNumber={x.current_number??0} yourNumber={x.number} state={x.token_status==='serving'?'now':x.ahead===0?'next':'waiting'} onClick={()=>router.push(`/app/tokens/${x.id}`)}/>)}</>}
    <Button variant="tertiary" size="sm" onClick={()=>router.push('/app/scan')}>Scan karein</Button><div style={{marginTop:16}}><BookLookup/></div></main><BottomSheet isOpen={menu} onClose={()=>setMenu(false)} title="Options"><button type="button" className="token-history-menu" onClick={()=>{setMenu(false);router.push('/app/tokens/history')}}><Clock3 size={20}/>History dekhein</button></BottomSheet></>;
}
