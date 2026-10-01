import {notFound,redirect} from 'next/navigation';import {createClient} from '@/lib/supabase/server';import {OwnerHistory} from '@/components/business/OwnerHistory';
export const dynamic='force-dynamic';
export default async function HistoryPage({params}:{params:{id:string}}){const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');const {data:q}=await db.from('queues').select('id,name').eq('id',params.id).eq('owner_id',user.id).is('deleted_at',null).maybeSingle();if(!q)notFound();return <OwnerHistory queueId={q.id} queueName={q.name}/>}
