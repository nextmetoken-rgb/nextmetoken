'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { createClient } from '@/lib/supabase/client';
export function BookLookup(){const router=useRouter();const [value,setValue]=React.useState(''),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');const go=async()=>{const id=value.trim().toLowerCase();if(!id)return;setBusy(true);setError('');const {data, error:e}=await createClient().rpc('queue_book_public',{p_book_id:id});setBusy(false);if(e||data?.result!=='ok'){setError('Book ID nahi mila. Business se sahi ID maangein.');return}router.push(`/q/${data.code}`)};return <section className="stack-3"><h2 className="t-h3">Book ID se business dhoondein</h2><TextField label="Business Book ID" value={value} onChange={e=>setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} onKeyDown={e=>{if(e.key==='Enter')void go()}}/><Button fullWidth loading={busy} onClick={go}>Business kholein</Button>{error&&<p role="alert" className="t-body-sm">{error}</p>}</section>}
