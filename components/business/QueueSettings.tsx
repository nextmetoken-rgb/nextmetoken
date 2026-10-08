'use client';
import React from 'react';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { createClient } from '@/lib/supabase/client';

export default function QueueSettings({queue}:{queue:{id:string;name:string;book_id:string}}){
  const [name,setName]=React.useState(queue.name),[bookId,setBookId]=React.useState(queue.book_id),[busy,setBusy]=React.useState(false),[notice,setNotice]=React.useState('');
  const save=async()=>{setBusy(true);setNotice('');const db=createClient();const {data:available}=await db.rpc('book_id_available',{p_book_id:bookId.trim().toLowerCase(),p_queue_id:queue.id});if(!available){setBusy(false);setNotice('Ye Book ID kisi aur business ke paas hai.');return;}const {data,error}=await db.rpc('owner_update_identity',{p_queue_id:queue.id,p_name:name.trim(),p_book_id:bookId.trim().toLowerCase()});setBusy(false);if(error||data?.result!=='ok'){setNotice(data?.result==='book_taken'?'Ye Book ID pehle se li gayi hai.':'Save nahi hua. Naam aur Book ID check karein.');return;}setNotice('Save ho gaya.');};
  return <><AppBar title="Business settings" onBack={()=>history.back()}/><main className="container page tight"><p className="t-body">Business ka naam aur QR se judi Book ID yahan badlein.</p><TextField label="Business name" value={name} maxLength={40} onChange={e=>setName(e.target.value)}/><TextField label="Book ID" value={bookId} maxLength={30} onChange={e=>setBookId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} helperText="3–30 letters/numbers; hyphen allowed. QR identity isi ID se judi rahegi."/><p className="t-caption">Link: {typeof window!=='undefined'?window.location.origin:''}/book/{bookId}</p>{notice&&<p role="status" className="t-body-sm">{notice}</p>}<Button fullWidth loading={busy} onClick={save}>Save karein</Button></main></>;
}
