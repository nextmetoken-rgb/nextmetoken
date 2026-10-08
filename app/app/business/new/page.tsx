import {redirect} from 'next/navigation';
import NewQueueFlow from '@/components/business/NewQueueFlow';
import {createClient} from '@/lib/supabase/server';
export const dynamic='force-dynamic';
export default async function NewQueuePage(){const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');const {data:existing}=await db.from('queues').select('id').eq('owner_id',user.id).is('deleted_at',null).limit(1).maybeSingle();if(existing)redirect('/app/business');return <NewQueueFlow/>}
