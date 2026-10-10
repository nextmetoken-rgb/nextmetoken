'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { DaysCoin } from '@/components/DaysCoin';
import { createClient } from '@/lib/supabase/client';

declare global { interface Window { Razorpay?: new (options:any)=>{open:()=>void} } }

const PRESETS = [10, 50, 100, 200, 500];

export default function BusinessFunds(){
  const [amount,setAmount]=React.useState('50'),[balance,setBalance]=React.useState<{paid_days:number;test_days:number;trial_ends_at:string}|null>(null),[busy,setBusy]=React.useState(false),[message,setMessage]=React.useState('');
  React.useEffect(()=>{void (async()=>{const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)return;const {data}=await db.from('queues').select('id,paid_days,test_days,trial_ends_at').eq('owner_id',user.id).is('deleted_at',null).order('created_at',{ascending:true}).limit(1).maybeSingle();if(data){const {data:ent}=await db.rpc('refresh_queue_entitlement',{p_queue_id:data.id});setBalance({paid_days:ent?.paid_days??data.paid_days,test_days:ent?.test_days??data.test_days,trial_ends_at:ent?.trial_ends_at??data.trial_ends_at})}})()},[]);
  const pay=async()=>{const n=Number(amount);if(!Number.isInteger(n)||n<10||n>500){setMessage('₹10 se ₹500 ke beech amount chunein.');return}setBusy(true);setMessage('');try{const orderRes=await fetch('/api/payments/create-order',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({amount:n})});const order=await orderRes.json();if(!orderRes.ok)throw new Error(order.error==='payments_not_configured'?'Payment gateway abhi configure nahi hai.':order.error||'Order nahi ban paya.');if(!window.Razorpay){await new Promise<void>((resolve,reject)=>{const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=()=>resolve();s.onerror=()=>reject(new Error('Payment window load nahi hui.'));document.body.appendChild(s)})}const checkout=new window.Razorpay!({key:order.keyId,amount:order.amount,currency:order.currency,name:'Token App',description:`${n} queue days`,order_id:order.orderId,handler:async(response:any)=>{const verify=await fetch('/api/payments/verify',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(response)});const result=await verify.json();setMessage(verify.ok?'Payment verify ho gaya. Days add kar diye.':'Payment verify nahi ho saka. Support se sampark karein.');if(verify.ok)window.location.reload()},modal:{ondismiss:()=>setMessage('Payment poora nahi hua; balance nahi badla.')}});checkout.open()}catch(e){setMessage(e instanceof Error?e.message:'Payment shuru nahi ho paya.')}finally{setBusy(false)}};

  const trialLeft=balance?Math.max(0,Math.ceil((Date.parse(balance.trial_ends_at)-Date.now())/86400000)):0;
  const total=balance?balance.paid_days+balance.test_days+trialLeft:null;
  const n=Number(amount);
  const valid=Number.isInteger(n)&&n>=10&&n<=500;

  return <>
    <AppBar title="Din add karein" onBack={()=>history.back()} rightActions={<Link href="/app/business/funds/history" className="funds-hist-link" data-testid="funds.history">History</Link>}/>
    <main className="container page tight funds-page">
      <section className="funds-hero" aria-label="Bache hue din">
        <DaysCoin days={total??'—'} size="lg"/>
        <p className="funds-hero-title">Bache hue din</p>
      </section>

      <section className="funds-box" aria-label="Amount chunein">
        <div className="funds-box-head"><h2 className="t-h3">Kitne din add karne hain?</h2><span className="funds-rate">₹1 = 1 din</span></div>
        <div className="funds-presets" role="group" aria-label="Jaldi chunein">
          {PRESETS.map(p=><button key={p} type="button" className="funds-chip" aria-pressed={n===p} onClick={()=>{setAmount(String(p));setMessage('')}}>₹{p}</button>)}
        </div>
        <label className="funds-input">
          <span className="funds-input-sym">₹</span>
          <input type="number" inputMode="numeric" min={10} max={500} value={amount} onChange={e=>{setAmount(e.target.value);setMessage('')}} aria-label="Rupees" placeholder="10 se 500"/>
          <span className="funds-input-unit">= {valid?n:'—'} din</span>
        </label>
        {valid&&total!==null&&<p className="funds-after"><Sparkles size={16}/>Add hone ke baad: <b>{total+n} din</b></p>}
        <Button fullWidth loading={busy} disabled={!valid} onClick={pay}>{valid?`₹${n} se ${n} din add karein`:'Amount chunein'}</Button>
        {message&&<p role="status" className="funds-msg">{message}</p>}
      </section>

      <p className="funds-note"><ShieldCheck size={16}/>Razorpay secure checkout. Payment verify hone ke baad hi din add hote hain; cancel karne par balance nahi badhta.</p>
    </main>
  </>;
}
