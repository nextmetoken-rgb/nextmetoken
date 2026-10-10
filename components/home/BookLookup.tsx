'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Hash } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function BookLookup(){
  const router=useRouter();
  const [value,setValue]=React.useState(''),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const go=async()=>{
    const id=value.trim().toLowerCase();
    if(!id||busy)return;
    setBusy(true);setError('');
    const {data,error:e}=await createClient().rpc('queue_book_public',{p_book_id:id});
    setBusy(false);
    if(e||data?.result!=='ok'){setError('Ye Book ID nahi mili. Dobara check karein.');return}
    router.push(`/q/${data.code}`);
  };
  return <form className="book-lookup" onSubmit={ev=>{ev.preventDefault();void go()}} data-testid="booklookup">
    <label className="book-lookup-label" htmlFor="book-id-input">Business ka Book ID hai?</label>
    <div className="book-lookup-row">
      <span className="book-lookup-field"><Hash size={18} aria-hidden="true"/>
        <input id="book-id-input" value={value} onChange={e=>{setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''));setError('')}} placeholder="jaise salon-12" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="go" aria-invalid={!!error}/>
      </span>
      <button type="submit" className="book-lookup-go" disabled={!value.trim()||busy} aria-label="Business kholein">{busy?<span className="book-lookup-spin"/>:<ArrowRight size={20}/>}</button>
    </div>
    {error&&<p role="alert" className="book-lookup-err">{error}</p>}
  </form>;
}
