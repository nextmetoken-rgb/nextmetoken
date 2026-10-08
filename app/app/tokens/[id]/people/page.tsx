import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PeopleView } from '@/components/customer/PeopleView';
export const dynamic='force-dynamic';
export default async function PeoplePage({params}:{params:{id:string}}){const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');const {data}=await db.rpc('customer_token_detail',{p_token_id:params.id});if(!data||data.result!=='ok')notFound();return <PeopleView id={params.id} initial={data}/>}
