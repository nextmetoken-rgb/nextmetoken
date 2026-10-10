'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Clock3 } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { EmptyState } from '@/components/EmptyState';
import { Chip } from '@/components/Chip';
import { RebookButton } from '@/components/customer/RebookButton';
import { createClient } from '@/lib/supabase/client';

type Tok = { id: string; number: number; created_at: string; status: string };
type Group = { queue_id: string; business_name: string; can_rebook?: boolean; code?: string | null; tokens: Tok[] };

const LABEL: Record<string, string> = { done: 'Poora hua', left: 'Line chhodi', expired: 'Expire', removed: 'Hata diya', skipped: 'Nikal gaya', waiting: 'Intezar me', serving: 'Chal raha' };

export default function TokenHistory() {
  const [groups, setGroups] = React.useState<Group[] | null>(null);
  const router = useRouter();
  React.useEffect(() => { void createClient().rpc('customer_history_groups').then(({ data }) => setGroups(Array.isArray(data) ? data : [])); }, []);
  return <>
    <AppBar title="Token History" onBack={() => router.push('/app/tokens')} />
    <main className="container page tight">
      {groups === null ? <p className="t-body-sm c2">Load ho raha hai…</p>
        : groups.length === 0 ? <EmptyState icon={<Clock3 />} title="Abhi history nahi hai" body="Jaise hi aapke token poore honge, yahan dikhne lagenge." />
        : groups.map(group => (
          <section key={group.queue_id} className="hist-group">
            <header className="hist-head">
              <h2 className="t-h3">{group.business_name}</h2>
              <RebookButton info={{ can_rebook: group.can_rebook, code: group.code }} compact />
            </header>
            <div className="hist-list">
              {group.tokens.map(token => (
                <button key={token.id} type="button" className="hist-row" onClick={() => router.push(`/app/tokens/history/${token.id}`)}>
                  <span className="hist-num">#{token.number}</span>
                  <span className="hist-mid">
                    <b>{new Date(token.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</b>
                    <Chip variant={token.status === 'done' ? 'done' : 'left'} label={LABEL[token.status] ?? token.status} />
                  </span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        ))}
    </main>
  </>;
}
