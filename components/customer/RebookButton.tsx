'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RotateCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Info = { can_rebook?: boolean; code?: string | null };

/** "Dobara token lein": sirf tab dikhta hai jab wo jagah abhi live ho aur is jagah ka koi chalu token na ho. */
export function RebookButton({ queueId, info, compact = false }: { queueId?: string | null; info?: Info; compact?: boolean }) {
  const router = useRouter();
  const [fetched, setFetched] = React.useState<Info | null>(null);
  React.useEffect(() => {
    if (info || !queueId) return;
    let alive = true;
    void createClient().rpc('customer_rebook_info', { p_queue_id: queueId }).then(({ data }) => { if (alive && data) setFetched(data as Info); });
    return () => { alive = false; };
  }, [info, queueId]);
  const data = info ?? fetched;
  if (!data?.can_rebook || !data.code) return null;
  return (
    <button type="button" className={`rebook-btn${compact ? ' is-compact' : ''}`} onClick={() => router.push(`/q/${data.code}`)} data-testid="history.rebook">
      <RotateCw size={compact ? 15 : 18} />Dobara token lein
    </button>
  );
}
