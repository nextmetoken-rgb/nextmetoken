import { notFound, redirect } from 'next/navigation';
import OwnerConsole, { type ConsoleData } from '@/components/business/OwnerConsole';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function BusinessConsolePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/app/business/${params.id}`)}`);
  const { data: q } = await supabase.from('queues').select('id,name,code,status,start_number,token_limit,book_id,paid_days,test_days,trial_ends_at,intake_enabled,announcement_enabled,announcement_repeat_count,sound_box_enabled,sessions(id,started_at,current_number,version,ended_at,tokens(id,number,display_name,is_walkin,status,hidden_for_owner,created_at,called_at))').eq('id',params.id).eq('owner_id',user.id).is('deleted_at',null).order('started_at',{ascending:false,foreignTable:'sessions'}).limit(1,{foreignTable:'sessions'}).maybeSingle();
  if (!q) notFound();
  const session = (q.sessions || []).find((item: {ended_at?:string|null}) => !item.ended_at) || null;
  const { sessions: _sessions, ...queue } = q as typeof q & { sessions?: Array<{id:string;started_at:string;current_number:number|null;version:number;ended_at:string|null;tokens:ConsoleData['tokens']}> };
  const initial: ConsoleData = { queue: queue as ConsoleData['queue'], session: session as ConsoleData['session'], tokens: (session?.tokens || []).filter((token: {hidden_for_owner:boolean}) => !token.hidden_for_owner) as ConsoleData['tokens'] };
  return <OwnerConsole initial={initial}/>;
}
