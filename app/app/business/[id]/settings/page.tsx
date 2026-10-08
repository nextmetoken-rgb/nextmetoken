import {notFound,redirect} from 'next/navigation';import {createClient} from '@/lib/supabase/server';import QueueSettings from '@/components/business/QueueSettings';
export const dynamic='force-dynamic';
export default async function QueueSettingsPage({params}:{params:{id:string}}){const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');const {data}=await db.from('queues').select('id,name,book_id').eq('id',params.id).eq('owner_id',user.id).is('deleted_at',null).maybeSingle();if(!data)notFound();return <QueueSettings queue={data}/>}
