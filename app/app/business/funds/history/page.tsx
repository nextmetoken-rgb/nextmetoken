'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/AppBar';
import { Skeleton } from '@/components/Skeleton';
import { createClient } from '@/lib/supabase/client';

type Row = { id: string; kind: 'payment' | 'trial' | 'bonus'; days: number; amount_paise: number | null; method: string | null; method_detail: string | null; created_at: string };

const METHODS: Record<string, string> = { upi: 'UPI', card: 'Card', netbanking: 'Net banking', wallet: 'Wallet' };
const when = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

function line(r: Row) {
  if (r.kind === 'trial') return 'Next Me Token ki taraf se · Free trial bonus (nayi QR par)';
  if (r.kind === 'bonus') return 'Next Me Token ki taraf se · Free bonus';
  const m = r.method ? (METHODS[r.method] ?? 'Online') : 'Online payment';
  return r.method_detail ? `${m} · ${r.method_detail}` : m;
}

export default function DayHistory() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    void (async () => {
      const { data, error } = await createClient().from('day_history').select('id,kind,days,amount_paise,method,method_detail,created_at').order('created_at', { ascending: false }).limit(200);
      if (error || !data) { setFailed(true); setRows([]); return; }
      setRows(data as Row[]);
    })();
  }, []);
  return <>
    <AppBar title="History" onBack={() => router.push('/app/business/funds')} />
    <main className="container page tight funds-page" data-testid="funds.historypage">
      {rows === null ? <><Skeleton variant="card" height={64} /><Skeleton variant="card" height={64} /></>
        : rows.length === 0 ? <p className="dh-empty">{failed ? 'History load nahi ho payi. Supabase me 011_day_history.sql run karein ya dobara koshish karein.' : 'Abhi koi entry nahi hai.'}</p>
        : <div className="dh-list">{rows.map(r => <div className="dh-row" key={r.id}>
            <div className="dh-main"><b>+{r.days} din</b><span>{line(r)}</span><small>{when(r.created_at)}</small></div>
            <span className={`dh-amt${r.kind === 'payment' ? '' : ' free'}`}>{r.kind === 'payment' && r.amount_paise != null ? `₹${r.amount_paise / 100}` : 'Free'}</span>
          </div>)}</div>}
    </main>
  </>;
}
