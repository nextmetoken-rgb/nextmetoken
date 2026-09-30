import { notFound, redirect } from 'next/navigation';
import OwnerConsole, { type ConsoleData } from '@/components/business/OwnerConsole';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function BusinessConsolePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/app/business/${params.id}`)}`);
  const { data: q } = await supabase.from('queues').select('id,name,status,start_number,token_limit').eq('id',params.id).eq('owner_id',user.id).is('deleted_at',null).maybeSingle();
  if (!q) notFound();
  const { data: session } = await supabase.from('sessions').select('id,started_at,current_number,version').eq('queue_id',q.id).is('ended_at',null).order('started_at',{ascending:false}).limit(1).maybeSingle();
  const { data: tokens } = session ? await supabase.from('tokens').select('id,number,display_name,is_walkin,status,hidden_for_owner,created_at,called_at').eq('session_id',session.id).eq('hidden_for_owner',false).order('number',{ascending:true}) : { data: [] };
  const initial: ConsoleData = { queue: q as ConsoleData['queue'], session: session as ConsoleData['session'], tokens: (tokens||[]) as ConsoleData['tokens'] };
  return <OwnerConsole initial={initial}/>;
}
