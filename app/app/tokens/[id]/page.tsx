import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LiveToken } from '@/components/customer/LiveToken';

export const dynamic = 'force-dynamic';

export default async function LiveTokenPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data } = await supabase.rpc('customer_token_detail', { p_token_id: params.id });
  if (!data || data.result !== 'ok') notFound();
  return <LiveToken tokenId={params.id} initial={data} />;
}
