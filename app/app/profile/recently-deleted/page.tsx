import {redirect} from 'next/navigation';import {createClient} from '@/lib/supabase/server';import {RecentlyDeleted} from '@/components/business/RecentlyDeleted';
export const dynamic='force-dynamic';
export default async function RecentlyDeletedPage(){const db=createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/login');return <RecentlyDeleted standalone/>}
