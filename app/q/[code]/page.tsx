import { redirect } from 'next/navigation';
import QrEntry from '@/components/customer/QrEntry';
import { CODE_RE, type PublicQueue } from '@/lib/publicQueue';
import { createClient } from '@/lib/supabase/server';
import { brand } from '@/lib/brand';
import { QrOwnerNotice } from '@/components/customer/QrOwnerNotice';

export const dynamic = 'force-dynamic';
export const metadata = { title: `Token | ${brand.name}` };

export default async function QrLandingPage({ params }: { params: { code: string } }) {
  const code = params.code;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let info: PublicQueue = { state: 'invalid' };
  let ownQueueId: string | null = null;
  if (CODE_RE.test(code)) {
    if(user){const {data:recovery}=await supabase.rpc('owner_recover_queue_by_code',{p_code:code});if(recovery?.result==='restored')redirect(`/app/business/${recovery.queue_id}?recovered=1`);if(recovery?.result==='active')ownQueueId=recovery.queue_id;}
    const { data } = await supabase.rpc('queue_public', { p_code: code });
    if (data) info = data as PublicQueue;
  }

  let userName: string | null = null;
  if (user) {
    const { data: profile } = await supabase.from('users').select('name').eq('id', user.id).maybeSingle();
    if (!profile?.name) redirect(`/onboarding/name?next=${encodeURIComponent(`/q/${code}`)}`);
    userName = profile.name;
    if (ownQueueId) return <QrOwnerNotice queueId={ownQueueId}/>;
    if (info.state !== 'invalid') {
      const { data: existing } = await supabase.rpc('my_active_token', { p_code: code });
      if (existing) redirect(`/app/tokens/${existing}?t=existing`);
    }
  }

  return <QrEntry code={code} initial={info} userName={userName} />;
}
