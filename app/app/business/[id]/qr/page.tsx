import { notFound } from 'next/navigation';
import QrScreen from '@/components/business/QrScreen';
import { createClient } from '@/lib/supabase/server';
import { queueTitle } from '@/lib/queueView';

export default async function QrPage({ params, searchParams }: { params: { id: string }; searchParams: { created?: string } }) {
  const { data: q } = await createClient()
    .from('queues').select('id,code,name,counter_name,book_id').eq('id', params.id).is('deleted_at', null).maybeSingle();
  if (!q) notFound();
  return <QrScreen id={q.id} code={q.code} bookId={q.book_id} title={queueTitle(q)} created={searchParams.created === '1'} />;
}
