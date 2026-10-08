'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVertical, Users, Volume2, CircleHelp, LogOut } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { IconButton } from '@/components/IconButton';
import { BottomSheet } from '@/components/BottomSheet';
import { Dialog } from '@/components/Dialog';
import { Card, SettingsRow } from '@/components/Cards';
import { TicketCard } from '@/components/TicketCard';
import { Button } from '@/components/Button';
import { ProgressLine } from '@/components/ProgressLine';
import { ToggleRow } from '@/components/Toggle';
import { Banner } from '@/components/Banner';
import { createClient } from '@/lib/supabase/client';

type Token = { id:string; number:number; token_status:string; queue_name:string; queue_id:string; session_id:string; current_number:number|null; ahead:number; avg_time_min:number|null; started_at:string; ended_at:string|null; eta_at_issue:string|null; called_at:string|null; done_at:string|null; };

export function LiveToken({ tokenId, initial }: { tokenId:string; initial:Token }) {
  const [token,setToken]=React.useState(initial); const [menu,setMenu]=React.useState(false); const [confirm,setConfirm]=React.useState(false);
  const [offline,setOffline]=React.useState(false); const [sound,setSound]=React.useState(false); const [busy,setBusy]=React.useState(false); const [notice,setNotice]=React.useState('');
  const router=useRouter(); const db=React.useMemo(()=>createClient(),[]);
  React.useEffect(()=>{setSound((localStorage.getItem(`token-sound-${tokenId}`)??localStorage.getItem('token-audio-all'))==='true'); const online=()=>setOffline(false); const off=()=>setOffline(true); window.addEventListener('online',online);window.addEventListener('offline',off);
    const refresh=async()=>{const {data}=await db.rpc('customer_token_detail',{p_token_id:tokenId});if(data?.result==='ok')setToken(data);};
    const timer=window.setInterval(()=>{if(document.visibilityState==='visible')refresh()},15000); const channel=db.channel(`customer-token-${tokenId}`).on('postgres_changes',{event:'*',schema:'public',table:'tokens',filter:`id=eq.${tokenId}`},refresh).on('postgres_changes',{event:'*',schema:'public',table:'sessions',filter:`id=eq.${initial.session_id}`},refresh).subscribe();
    return()=>{window.clearInterval(timer);window.removeEventListener('online',online);window.removeEventListener('offline',off);db.removeChannel(channel)};
  },[db,initial.session_id,tokenId]);

  const state=token.token_status==='serving'?'now':token.token_status==='waiting'&&token.ahead===0?'next':token.token_status==='waiting'?'waiting':token.token_status==='skipped'?'skipped':token.token_status==='done'?'done':token.token_status==='removed'?'removed':token.token_status==='left'?'removed':'done';
  const prior=React.useRef({state:initial.token_status==='serving'?'now':initial.token_status==='waiting'&&initial.ahead===0?'next':initial.token_status});
  React.useEffect(()=>{const before=prior.current.state;const foreground=document.visibilityState==='visible';if(sound&&foreground&&before!==state&&(state==='next'||state==='now')){const audio=new Audio(state==='now'?'/sounds/now.mp3':'/sounds/next.mp3');audio.volume=.8;void audio.play().catch(()=>undefined);if(state==='now'&&'speechSynthesis'in window){window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(`Aapki baari hai! Token ${token.number}`);voice.volume=.8;window.speechSynthesis.speak(voice);}}if(state==='now'&&'vibrate'in navigator)navigator.vibrate([20,40,20]);if(before!==state&&state==='removed')setNotice('Owner ne aapko line se hata diya.');if(before!==state&&state==='now'){document.title=`Aapki baari · ${token.queue_name}`;window.setTimeout(()=>{document.title=token.queue_name},2500)}prior.current={state}},[sound,state,token.number,token.queue_name]);
  React.useEffect(()=>{if(state!=='now'||!('wakeLock'in navigator))return;let active=true;let lock:{release:()=>Promise<void>}|null=null;const hold=async()=>{try{if(active)lock=await (navigator as Navigator&{wakeLock:{request:(kind:'screen')=>Promise<{release:()=>Promise<void>}>}}).wakeLock.request('screen')}catch{}};void hold();const visible=()=>{if(document.visibilityState==='visible')void hold()};document.addEventListener('visibilitychange',visible);return()=>{active=false;document.removeEventListener('visibilitychange',visible);void lock?.release()}},[state]);
  const more=async(item:'people'|'sound'|'guide'|'leave')=>{setMenu(false); if(item==='people')router.push(`/app/tokens/${tokenId}/people`);if(item==='guide')router.push('/app/guide');if(item==='sound')router.push(`/app/tokens/${tokenId}/settings`);if(item==='leave')setConfirm(true);};
  const withdraw=async()=>{setBusy(true);const {data,error}=await db.rpc('customer_withdraw_token',{p_token_id:tokenId});setBusy(false);setConfirm(false);if(error||data?.result!=='ok'){setNotice('Line nahi chhodi ja saki. Dobara koshish karein.');return;}const {data:updated}=await db.rpc('customer_token_detail',{p_token_id:tokenId});if(updated?.result==='ok')setToken(updated);setNotice('Aap line se nikal gaye.');};
  const rejoin=async()=>{setBusy(true);const {data,error}=await db.rpc('rejoin_last',{p_token_id:tokenId});setBusy(false);if(error||data?.result!=='ok'){setNotice(data?.result==='paused'?'Line ruki hui hai.':data?.result==='limit'?'Aaj ke token khatam ho gaye.':data?.result==='active'?'Aapka ek active token pehle se hai.':'Line me wapas nahi aa paye. Dobara koshish karein.');return;}const {data:updated}=await db.rpc('customer_token_detail',{p_token_id:tokenId});if(updated?.result==='ok')setToken(updated);setNotice(`Aap line me wapas aa gaye. Number ${data.number}.`)};

  const nowText=token.token_status==='removed'?'Owner ne aapko line se hata diya. Dobara scan karke token le sakte hain.':token.token_status==='left'?'Aapne line chhod di.':token.token_status==='done'?'Dhanyavaad. Aapki baari poori hui.':state==='now'?'Aapki baari hai':state==='next'?'Taiyaar rahiye, aap agle hain':`${token.ahead} log pehle`;
  const eta=token.eta_at_issue?`${Math.max(1,Math.round((new Date(token.eta_at_issue).getTime()-Date.now())/60000))} min`:'Lagbhag 20–30 min';
  return <>
    <AppBar title={token.queue_name} onBack={()=>router.back()} rightActions={['waiting','serving'].includes(token.token_status)?<IconButton icon={<EllipsisVertical/>} aria-label="Aur options" onClick={()=>setMenu(true)} testId="live.more"/>:null} testId="live.appbar"/>
    <main className="container page tight" data-testid="live">

      {offline&&<Banner variant="offline" testId="live.banner"/>}
      {notice&&<p role="status" className="t-body-sm">{notice}</p>}
      <section data-testid="live.ticket"><TicketCard state={state} servingNumber={token.current_number??'—'} yourNumber={token.number} peopleAheadText={nowText} estimateTimeText={eta} startTimeText={`Shuru: ${new Date(token.started_at).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})}`}/></section>
      <Card testId="live.progress">
        <div className="t-label">Line me aapki jagah</div>
        <div className="stack-3"><ProgressLine percentage={100 / (token.ahead + 1)} /></div>
      </Card>
      {['waiting','serving'].includes(token.token_status)&&<>
      <Card testId="live.sound-row" style={{padding:'0 var(--sp-4)'}}><ToggleRow icon={<Volume2 size={24}/>} label="Awaaz se batao" helperText="Is screen par number update hone par awaaz sunayein." checked={sound} onChange={v=>{setSound(v);localStorage.setItem(`token-sound-${tokenId}`,String(v));if(v){const audio=new Audio('/sounds/next.mp3');audio.volume=.8;void audio.play().catch(()=>undefined);if('speechSynthesis'in window)(()=>{const voice=new SpeechSynthesisUtterance('Awaaz chalu ho gayi');voice.volume=.8;window.speechSynthesis.speak(voice)})();}}} testId="live.sound"/></Card>
        <Card testId="live.people-row" style={{padding:0}}><SettingsRow icon={<Users size={20}/>} label="Line ke log dekhein" value="" onClick={()=>router.push(`/app/tokens/${tokenId}/people`)}/></Card>
      </>}
      {state==='now'&&<p role="alert" className="t-h2">Aapki baari hai</p>}
      {state==='skipped'&&<Card testId="live.skipped"><h2 className="t-h3">Aapka number nikal gaya</h2><p className="t-body-sm c2">Aap line me last me wapas aa sakte hain.</p><div className="stack-3" style={{marginTop:'var(--sp-3)'}}><Button fullWidth loading={busy} onClick={()=>void rejoin()}>Line me wapas aayein</Button><Button fullWidth variant="tertiary" loading={busy} onClick={()=>setConfirm(true)}>Chhodein</Button></div></Card>}
      {state==='done'&&<a className="link-u" href={`/app/tokens/history/${tokenId}`}>History dekhein</a>}
    </main>
    <BottomSheet isOpen={menu} onClose={()=>setMenu(false)} title="Options" testId="live.options">
      <div className="console-menu">
        <button onClick={()=>more('people')}><Users/>{'Line ke log dekhein'}</button>
        <button onClick={()=>more('sound')}><Volume2/>{'Awaaz settings'}</button>
        <button onClick={()=>more('guide')}><CircleHelp/>{'Guide (Madad)'}</button>
        <button onClick={()=>more('leave')} style={{color:'var(--c-danger)'}}><LogOut/>{'Line chhodein'}</button>
      </div>
    </BottomSheet>
    <Dialog isOpen={confirm} title="Line chhodein?" body={`Aapka number ${token.number} chala jayega. Aap dobara scan karke naya token le sakte hain.`} primaryLabel={busy?'Rukiye…':'Haan, chhodein'} primaryVariant="danger-filled" onPrimary={withdraw} onCancel={()=>setConfirm(false)} testId="live.leave.confirm"/>
  </>;
}

