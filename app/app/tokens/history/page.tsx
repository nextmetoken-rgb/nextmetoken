'use client';
import React from 'react';
import {useRouter} from 'next/navigation';
import {AppBar} from '@/components/AppBar';
import {Card} from '@/components/Cards';
import {createClient} from '@/lib/supabase/client';
type Group={queue_id:string;business_name:string;tokens:{id:string;number:number;created_at:string;status:string}[]};
export default function TokenHistory(){const [groups,setGroups]=React.useState<Group[]>([]);const router=useRouter();React.useEffect(()=>{void createClient().rpc('customer_history_groups').then(({data})=>setGroups(Array.isArray(data)?data:[]))},[]);return <><AppBar title="Token History" onBack={()=>router.push('/app/tokens')}/><main className="container page tight">{groups.length===0?<p className="t-body-sm c2">Abhi history nahi hai.</p>:groups.map(group=><section key={group.queue_id} style={{marginBottom:20}}><h2 className="t-h3" style={{marginBottom:8}}>{group.business_name}</h2><Card style={{padding:0}}>{group.tokens.map((token,i)=><button key={token.id} onClick={()=>router.push(`/app/tokens/history/${token.id}`)} style={{width:'100%',minHeight:56,padding:'12px 16px',border:0,borderBottom:i===group.tokens.length-1?0:'1px solid var(--c-border)',background:'transparent',color:'var(--c-text)',display:'flex',justifyContent:'space-between',textAlign:'left'}}><span>Token #{token.number}</span><span className="t-caption">{new Date(token.created_at).toLocaleDateString('en-IN')}</span></button>)}</Card></section>)}</main></>}
